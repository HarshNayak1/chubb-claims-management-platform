package com.example.full_stack_demo.dto;

import java.math.BigDecimal;

public class DashboardStatsResponse {

    private long totalClaims;
    private long submittedClaims;
    private long underReviewClaims;
    private long infoRequiredClaims;
    private long approvedClaims;
    private long rejectedClaims;
    private long settledClaims;
    private long pendingClaims; // submitted + under_review + info_required
    private long totalUsers;
    private long totalEmployees;
    private BigDecimal totalEstimatedLoss;

    public DashboardStatsResponse() {
    }

    public long getTotalClaims() {
        return totalClaims;
    }

    public void setTotalClaims(long totalClaims) {
        this.totalClaims = totalClaims;
    }

    public long getSubmittedClaims() {
        return submittedClaims;
    }

    public void setSubmittedClaims(long submittedClaims) {
        this.submittedClaims = submittedClaims;
    }

    public long getUnderReviewClaims() {
        return underReviewClaims;
    }

    public void setUnderReviewClaims(long underReviewClaims) {
        this.underReviewClaims = underReviewClaims;
    }

    public long getInfoRequiredClaims() {
        return infoRequiredClaims;
    }

    public void setInfoRequiredClaims(long infoRequiredClaims) {
        this.infoRequiredClaims = infoRequiredClaims;
    }

    public long getApprovedClaims() {
        return approvedClaims;
    }

    public void setApprovedClaims(long approvedClaims) {
        this.approvedClaims = approvedClaims;
    }

    public long getRejectedClaims() {
        return rejectedClaims;
    }

    public void setRejectedClaims(long rejectedClaims) {
        this.rejectedClaims = rejectedClaims;
    }

    public long getSettledClaims() {
        return settledClaims;
    }

    public void setSettledClaims(long settledClaims) {
        this.settledClaims = settledClaims;
    }

    public long getPendingClaims() {
        return pendingClaims;
    }

    public void setPendingClaims(long pendingClaims) {
        this.pendingClaims = pendingClaims;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public BigDecimal getTotalEstimatedLoss() {
        return totalEstimatedLoss;
    }

    public void setTotalEstimatedLoss(BigDecimal totalEstimatedLoss) {
        this.totalEstimatedLoss = totalEstimatedLoss;
    }
}
