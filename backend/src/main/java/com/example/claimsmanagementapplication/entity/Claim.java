package com.example.claimsmanagementapplication.entity;

import com.example.claimsmanagementapplication.enums.ClaimStatus;
import com.example.claimsmanagementapplication.enums.ClaimType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String claimNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClaimType claimType;

    @Column(nullable = false)
    private LocalDate incidentDate;

    @Column(nullable = false, length = 255)
    private String incidentLocation;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedLoss;

    @Column(nullable = false, length = 30)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClaimStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<ClaimHistory> history = new ArrayList<>();

    public Claim() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (status == null) {
            status = ClaimStatus.SUBMITTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ClaimHistory> getHistory() {
        return history;
    }

    public void setHistory(List<ClaimHistory> history) {
        this.history = history;
    }

    public void addHistory(ClaimHistory claimHistory) {
        history.add(claimHistory);
        claimHistory.setClaim(this);
    }
}
