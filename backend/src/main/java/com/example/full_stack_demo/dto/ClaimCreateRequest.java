package com.example.full_stack_demo.dto;

import com.example.full_stack_demo.enums.ClaimType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ClaimCreateRequest {

    @NotNull(message = "Claim type is required (MOTOR or PROPERTY)")
    private ClaimType claimType;

    @NotNull(message = "Incident date is required")
    private LocalDate incidentDate;

    @NotBlank(message = "Incident location is required")
    private String incidentLocation;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Estimated loss amount is required")
    @DecimalMin(value = "0.01", message = "Estimated loss must be greater than zero")
    private BigDecimal estimatedLoss;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    public ClaimCreateRequest() {
    }

    public ClaimType getClaimType() {
        return claimType;
    }

    public void setClaimType(ClaimType claimType) {
        this.claimType = claimType;
    }

    public LocalDate getIncidentDate() {
        return incidentDate;
    }

    public void setIncidentDate(LocalDate incidentDate) {
        this.incidentDate = incidentDate;
    }

    public String getIncidentLocation() {
        return incidentLocation;
    }

    public void setIncidentLocation(String incidentLocation) {
        this.incidentLocation = incidentLocation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getEstimatedLoss() {
        return estimatedLoss;
    }

    public void setEstimatedLoss(BigDecimal estimatedLoss) {
        this.estimatedLoss = estimatedLoss;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
}
