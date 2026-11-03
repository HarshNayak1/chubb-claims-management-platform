package com.example.full_stack_demo.controller;

import com.example.full_stack_demo.dto.ClaimResponse;
import com.example.full_stack_demo.dto.DashboardStatsResponse;
import com.example.full_stack_demo.dto.UserResponse;
import com.example.full_stack_demo.enums.ClaimStatus;
import com.example.full_stack_demo.service.ClaimService;
import com.example.full_stack_demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    private final UserService userService;
    private final ClaimService claimService;

    public ManagerController(UserService userService, ClaimService claimService) {
        this.userService = userService;
        this.claimService = claimService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getManagerDashboard() {
        DashboardStatsResponse stats = userService.getManagerDashboardStats();
        return ResponseEntity.ok(stats);
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

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserResponse>> getAllEmployees() {
        List<UserResponse> employees = userService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }
}
