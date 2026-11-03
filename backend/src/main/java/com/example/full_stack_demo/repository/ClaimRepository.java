package com.example.full_stack_demo.repository;

import com.example.full_stack_demo.entity.Claim;
import com.example.full_stack_demo.entity.User;
import com.example.full_stack_demo.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByUserOrderByCreatedAtDesc(User user);
    Optional<Claim> findByIdAndUser(Long id, User user);
    Optional<Claim> findByClaimNumber(String claimNumber);
    List<Claim> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Claim c WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(c.claimNumber) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) " +
           "ORDER BY c.createdAt DESC")
    List<Claim> searchClaims(@Param("query") String query, @Param("status") ClaimStatus status);

    long countByStatus(ClaimStatus status);
    long countByUser(User user);
    long countByUserAndStatus(User user, ClaimStatus status);

    @Query("SELECT MAX(c.id) FROM Claim c")
    Long findMaxId();
}
