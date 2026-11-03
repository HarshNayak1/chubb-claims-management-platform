package com.example.claimsmanagementapplication;

import com.example.claimsmanagementapplication.dto.AuthRequest;
import com.example.claimsmanagementapplication.dto.StatusUpdateRequest;
import com.example.claimsmanagementapplication.enums.ClaimStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class ClaimsApplicationIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .addFilter(springSecurityFilterChain)
                .build();
    }

    private String obtainToken(String email, String password) throws Exception {
        AuthRequest req = new AuthRequest(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("token").asText();
    }

    @Test
    @DisplayName("Test 1: Login succeeds for USER, EMPLOYEE, and MANAGER accounts")
    void testLoginsForAllRoles() throws Exception {
        String userToken = obtainToken("user01@chubb.com", "User@123");
        assertNotNull(userToken);

        String empToken = obtainToken("employee01@chubb.com", "Employee@123");
        assertNotNull(empToken);

        String mgrToken = obtainToken("manager01@chubb.com", "Manager@123");
        assertNotNull(mgrToken);
    }

    @Test
    @DisplayName("Test 2: Invalid login returns 401 Unauthorized")
    void testInvalidLogin() throws Exception {
        AuthRequest badReq = new AuthRequest("user01@chubb.com", "WrongPassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }

    @Test
    @DisplayName("Test 3: USER can create a claim and receive a unique claim number")
    void testUserCreateClaim() throws Exception {
        String userToken = obtainToken("user02@chubb.com", "User@123");

        String claimJson = """
                {
                    "claimType": "MOTOR",
                    "incidentDate": "2026-03-01",
                    "incidentLocation": "Collins St, Melbourne",
                    "description": "Bumper scratch during parallel parking.",
                    "estimatedLoss": 1250.00,
                    "contactNumber": "+61 411 222 333"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/user/claims")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(claimJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.claimNumber", matchesPattern("^CHB-\\d{4}-\\d{6}$")))
                .andExpect(jsonPath("$.status", is("SUBMITTED")))
                .andExpect(jsonPath("$.history", hasSize(greaterThanOrEqualTo(1))))
                .andReturn();

        JsonNode resp = objectMapper.readTree(result.getResponse().getContentAsString());
        Long claimId = resp.get("id").asLong();

        // Check user can view their own claim
        mockMvc.perform(get("/api/user/claims/" + claimId)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(claimId.intValue())));
    }

    @Test
    @DisplayName("Test 4: EMPLOYEE can view claims and update status with audit comments")
    void testEmployeeStatusUpdate() throws Exception {
        String empToken = obtainToken("employee01@chubb.com", "Employee@123");

        // Employee lists claims
        MvcResult listResult = mockMvc.perform(get("/api/employee/claims")
                        .header("Authorization", "Bearer " + empToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(15))))
                .andReturn();

        JsonNode claims = objectMapper.readTree(listResult.getResponse().getContentAsString());
        long targetClaimId = claims.get(0).get("id").asLong();

        // Update status to UNDER_REVIEW
        StatusUpdateRequest updateReq = new StatusUpdateRequest(
                ClaimStatus.UNDER_REVIEW,
                "Assigned assessor reviewing initial photos and documents."
        );

        mockMvc.perform(put("/api/employee/claims/" + targetClaimId + "/status")
                        .header("Authorization", "Bearer " + empToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UNDER_REVIEW")))
                .andExpect(jsonPath("$.history", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    @DisplayName("Test 5: MANAGER can view dashboard stats, users, and employees")
    void testManagerDashboardAndUserLists() throws Exception {
        String mgrToken = obtainToken("manager01@chubb.com", "Manager@123");

        // Manager dashboard
        mockMvc.perform(get("/api/manager/dashboard")
                        .header("Authorization", "Bearer " + mgrToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalClaims", greaterThanOrEqualTo(15)))
                .andExpect(jsonPath("$.totalUsers", is(10)))
                .andExpect(jsonPath("$.totalEmployees", is(10)));

        // Manager users list
        mockMvc.perform(get("/api/manager/users")
                        .header("Authorization", "Bearer " + mgrToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(10)))
                .andExpect(jsonPath("$[0].password").doesNotExist());

        // Manager employees list
        mockMvc.perform(get("/api/manager/employees")
                        .header("Authorization", "Bearer " + mgrToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(10)))
                .andExpect(jsonPath("$[0].password").doesNotExist());
    }

    @Test
    @DisplayName("Test 6: Role-based authorization blocks USER from manager endpoints (403 Forbidden)")
    void testRbacProtection() throws Exception {
        String userToken = obtainToken("user01@chubb.com", "User@123");

        mockMvc.perform(get("/api/manager/dashboard")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/employee/claims")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }
}
