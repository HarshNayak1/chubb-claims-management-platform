package com.example.claimsmanagementapplication.controller;

import com.example.claimsmanagementapplication.dto.ClaimCreateRequest;
import com.example.claimsmanagementapplication.dto.ClaimResponse;
import com.example.claimsmanagementapplication.dto.DashboardStatsResponse;
import com.example.claimsmanagementapplication.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
public class UserClaimController {

    private final ClaimService claimService;

    public UserClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/claims")
    public ResponseEntity<ClaimResponse> createClaim(@Valid @RequestBody ClaimCreateRequest request,
                                                     Authentication authentication) {
        String userEmail = authentication.getName();
        ClaimResponse response = claimService.createClaim(request, userEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/claims")
    public ResponseEntity<List<ClaimResponse>> getMyClaims(Authentication authentication) {
        String userEmail = authentication.getName();
        List<ClaimResponse> claims = claimService.getUserClaims(userEmail);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/claims/{id}")
    public ResponseEntity<ClaimResponse> getMyClaimById(@PathVariable Long id,
                                                        Authentication authentication) {
        String userEmail = authentication.getName();
        ClaimResponse claim = claimService.getUserClaimById(id, userEmail);
        return ResponseEntity.ok(claim);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getUserDashboard(Authentication authentication) {
        String userEmail = authentication.getName();
        DashboardStatsResponse stats = claimService.getUserDashboardStats(userEmail);
        return ResponseEntity.ok(stats);
    }
}
