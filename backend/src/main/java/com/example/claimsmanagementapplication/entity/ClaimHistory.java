package com.example.claimsmanagementapplication.entity;

import com.example.claimsmanagementapplication.enums.ClaimStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_history")
public class ClaimHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ClaimStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClaimStatus newStatus;

    @Column(nullable = false, length = 2000)
    private String comment;

    @Column(nullable = false, length = 100)
    private String updatedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ClaimHistory() {
    }

    public ClaimHistory(Claim claim, ClaimStatus previousStatus, ClaimStatus newStatus, String comment, String updatedBy) {
        this.claim = claim;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.comment = comment;
        this.updatedBy = updatedBy;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Claim getClaim() {
        return claim;
    }

    public void setClaim(Claim claim) {
        this.claim = claim;
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
