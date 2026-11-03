package com.example.full_stack_demo.repository;

import com.example.full_stack_demo.entity.User;
import com.example.full_stack_demo.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleOrderByCreatedAtDesc(Role role);
    long countByRole(Role role);
}
