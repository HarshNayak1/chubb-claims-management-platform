package com.example.full_stack_demo.dto;

import com.example.full_stack_demo.enums.ClaimStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "New status is required")
    private ClaimStatus status;

    @NotBlank(message = "Review comment is required")
    private String comment;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(ClaimStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
