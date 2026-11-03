package com.example.claimsmanagementapplication.service;

import com.example.claimsmanagementapplication.dto.*;
import com.example.claimsmanagementapplication.entity.Claim;
import com.example.claimsmanagementapplication.entity.ClaimHistory;
import com.example.claimsmanagementapplication.entity.User;
import com.example.claimsmanagementapplication.enums.ClaimStatus;
import com.example.claimsmanagementapplication.exception.BadRequestException;
import com.example.claimsmanagementapplication.exception.ResourceNotFoundException;
import com.example.claimsmanagementapplication.repository.ClaimHistoryRepository;
import com.example.claimsmanagementapplication.repository.ClaimRepository;
import com.example.claimsmanagementapplication.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository,
                        ClaimHistoryRepository claimHistoryRepository,
                        UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.claimHistoryRepository = claimHistoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ClaimResponse createClaim(ClaimCreateRequest request, String userEmail) {
        if (request.getIncidentDate() != null && request.getIncidentDate().isAfter(LocalDate.now().plusDays(1))) {
            throw new BadRequestException("Incident date cannot be in the future.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        String claimNumber = generateNextClaimNumber();

        Claim claim = new Claim();
        claim.setClaimNumber(claimNumber);
        claim.setUser(user);
        claim.setClaimType(request.getClaimType());
        claim.setIncidentDate(request.getIncidentDate());
        claim.setIncidentLocation(request.getIncidentLocation().trim());
        claim.setDescription(request.getDescription().trim());
        claim.setEstimatedLoss(request.getEstimatedLoss());
        claim.setContactNumber(request.getContactNumber().trim());
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        Claim savedClaim = claimRepository.save(claim);

        ClaimHistory initialHistory = new ClaimHistory(
                savedClaim,
                null,
                ClaimStatus.SUBMITTED,
                "Claim filed by claimant",
                user.getFullName() + " (" + user.getEmail() + ")"
        );
        claimHistoryRepository.save(initialHistory);
        savedClaim.getHistory().add(initialHistory);

        return mapToResponse(savedClaim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getUserClaims(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return claimRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClaimResponse getUserClaimById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Claim claim = claimRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));

        return mapToResponse(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getAllClaims(String query, ClaimStatus status) {
        List<Claim> claims;
        if ((query != null && !query.trim().isEmpty()) || status != null) {
            String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
            claims = claimRepository.searchClaims(trimmedQuery, status);
        } else {
            claims = claimRepository.findAllByOrderByCreatedAtDesc();
        }

        return claims.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClaimResponse getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
        return mapToResponse(claim);
    }

    @Transactional
    public ClaimResponse updateClaimStatus(Long id, StatusUpdateRequest request, String employeeEmail) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));

        User employee = userRepository.findByEmail(employeeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + employeeEmail));

        ClaimStatus previousStatus = claim.getStatus();
        ClaimStatus newStatus = request.getStatus();

        if (previousStatus == newStatus && previousStatus == ClaimStatus.SETTLED) {
            throw new BadRequestException("Claim is already settled.");
        }

        claim.setStatus(newStatus);
        claim.setUpdatedAt(LocalDateTime.now());

        String updatedByLabel = employee.getFullName() + " [EMP ID: #" + employee.getId() + "]";
        ClaimHistory historyEntry = new ClaimHistory(
                claim,
                previousStatus,
                newStatus,
                request.getComment().trim(),
                updatedByLabel
        );
        claim.addHistory(historyEntry);

        Claim updatedClaim = claimRepository.save(claim);
        return mapToResponse(updatedClaim);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        long submitted = claimRepository.countByStatus(ClaimStatus.SUBMITTED);
        long underReview = claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW);
        long infoRequired = claimRepository.countByStatus(ClaimStatus.INFORMATION_REQUIRED);
        long approved = claimRepository.countByStatus(ClaimStatus.APPROVED);
        long rejected = claimRepository.countByStatus(ClaimStatus.REJECTED);
        long settled = claimRepository.countByStatus(ClaimStatus.SETTLED);
        long total = claimRepository.count();

        stats.setTotalClaims(total);
        stats.setSubmittedClaims(submitted);
        stats.setUnderReviewClaims(underReview);
        stats.setInfoRequiredClaims(infoRequired);
        stats.setApprovedClaims(approved);
        stats.setRejectedClaims(rejected);
        stats.setSettledClaims(settled);
        stats.setPendingClaims(submitted + underReview + infoRequired);

        BigDecimal totalLoss = claimRepository.findAll().stream()
                .map(Claim::getEstimatedLoss)
                .filter(l -> l != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalEstimatedLoss(totalLoss);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getUserDashboardStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        DashboardStatsResponse stats = new DashboardStatsResponse();
        long submitted = claimRepository.countByUserAndStatus(user, ClaimStatus.SUBMITTED);
        long underReview = claimRepository.countByUserAndStatus(user, ClaimStatus.UNDER_REVIEW);
        long infoRequired = claimRepository.countByUserAndStatus(user, ClaimStatus.INFORMATION_REQUIRED);
        long approved = claimRepository.countByUserAndStatus(user, ClaimStatus.APPROVED);
        long rejected = claimRepository.countByUserAndStatus(user, ClaimStatus.REJECTED);
        long settled = claimRepository.countByUserAndStatus(user, ClaimStatus.SETTLED);
        long total = claimRepository.countByUser(user);

        stats.setTotalClaims(total);
        stats.setSubmittedClaims(submitted);
        stats.setUnderReviewClaims(underReview);
        stats.setInfoRequiredClaims(infoRequired);
        stats.setApprovedClaims(approved);
        stats.setRejectedClaims(rejected);
        stats.setSettledClaims(settled);
        stats.setPendingClaims(submitted + underReview + infoRequired);

        return stats;
    }

    private synchronized String generateNextClaimNumber() {
        int year = LocalDate.now().getYear();
        Long maxId = claimRepository.findMaxId();
        long nextId = (maxId == null ? 0L : maxId) + 1;
        String claimNumber;
        do {
            claimNumber = String.format("CHB-%d-%06d", year, nextId++);
        } while (claimRepository.findByClaimNumber(claimNumber).isPresent());
        return claimNumber;
    }

    public ClaimResponse mapToResponse(Claim claim) {
        ClaimResponse resp = new ClaimResponse();
        resp.setId(claim.getId());
        resp.setClaimNumber(claim.getClaimNumber());
        if (claim.getUser() != null) {
            resp.setClaimantId(claim.getUser().getId());
            resp.setClaimantName(claim.getUser().getFullName());
            resp.setClaimantEmail(claim.getUser().getEmail());
        }
        resp.setClaimType(claim.getClaimType());
        resp.setIncidentDate(claim.getIncidentDate());
        resp.setIncidentLocation(claim.getIncidentLocation());
        resp.setDescription(claim.getDescription());
        resp.setEstimatedLoss(claim.getEstimatedLoss());
        resp.setContactNumber(claim.getContactNumber());
        resp.setStatus(claim.getStatus());
        resp.setCreatedAt(claim.getCreatedAt());
        resp.setUpdatedAt(claim.getUpdatedAt());

        if (claim.getHistory() != null) {
            List<ClaimHistoryResponse> historyResponses = claim.getHistory().stream()
                    .map(h -> new ClaimHistoryResponse(
                            h.getId(),
                            h.getPreviousStatus(),
                            h.getNewStatus(),
                            h.getComment(),
                            h.getUpdatedBy(),
                            h.getCreatedAt()
                    ))
                    .collect(Collectors.toList());
            resp.setHistory(historyResponses);
        }

        return resp;
    }
}
