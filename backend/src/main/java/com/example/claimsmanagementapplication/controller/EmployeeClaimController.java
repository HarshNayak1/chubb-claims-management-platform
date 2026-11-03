package com.example.claimsmanagementapplication.controller;

import com.example.claimsmanagementapplication.dto.ClaimResponse;
import com.example.claimsmanagementapplication.dto.DashboardStatsResponse;
import com.example.claimsmanagementapplication.dto.StatusUpdateRequest;
import com.example.claimsmanagementapplication.enums.ClaimStatus;
import com.example.claimsmanagementapplication.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeClaimController {

    private final ClaimService claimService;

    public EmployeeClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping("/claims")
    public ResponseEntity<List<ClaimResponse>> getAllClaims(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ClaimStatus status) {
        List<ClaimResponse> claims = claimService.getAllClaims(query, status);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/claims/{id}")
    public ResponseEntity<ClaimResponse> getClaimById(@PathVariable Long id) {
        ClaimResponse claim = claimService.getClaimById(id);
        return ResponseEntity.ok(claim);
    }

    @PutMapping("/claims/{id}/status")
    public ResponseEntity<ClaimResponse> updateClaimStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication) {
        String employeeEmail = authentication.getName();
        ClaimResponse response = claimService.updateClaimStatus(id, request, employeeEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getEmployeeDashboard() {
        DashboardStatsResponse stats = claimService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
