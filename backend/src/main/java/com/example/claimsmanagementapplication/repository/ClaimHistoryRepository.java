package com.example.claimsmanagementapplication.repository;

import com.example.claimsmanagementapplication.entity.Claim;
import com.example.claimsmanagementapplication.entity.ClaimHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimHistoryRepository extends JpaRepository<ClaimHistory, Long> {
    List<ClaimHistory> findByClaimOrderByCreatedAtAsc(Claim claim);
}
