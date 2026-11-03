package com.example.full_stack_demo.repository;

import com.example.full_stack_demo.entity.Claim;
import com.example.full_stack_demo.entity.ClaimHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimHistoryRepository extends JpaRepository<ClaimHistory, Long> {
    List<ClaimHistory> findByClaimOrderByCreatedAtAsc(Claim claim);
}
