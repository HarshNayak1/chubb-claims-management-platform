package com.example.full_stack_demo.dto;

import com.example.full_stack_demo.enums.ClaimStatus;
import java.time.LocalDateTime;

public class ClaimHistoryResponse {

    private Long id;
    private ClaimStatus previousStatus;
    private ClaimStatus newStatus;
    private String comment;
    private String updatedBy;
    private LocalDateTime createdAt;

    public ClaimHistoryResponse() {
    }

    public ClaimHistoryResponse(Long id, ClaimStatus previousStatus, ClaimStatus newStatus, String comment, String updatedBy, LocalDateTime createdAt) {
        this.id = id;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.comment = comment;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClaimStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(ClaimStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public ClaimStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ClaimStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
