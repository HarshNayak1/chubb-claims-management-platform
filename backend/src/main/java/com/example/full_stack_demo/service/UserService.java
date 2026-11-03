package com.example.full_stack_demo.service;

import com.example.full_stack_demo.dto.DashboardStatsResponse;
import com.example.full_stack_demo.dto.UserResponse;
import com.example.full_stack_demo.entity.User;
import com.example.full_stack_demo.enums.Role;
import com.example.full_stack_demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ClaimService claimService;

    public UserService(UserRepository userRepository, ClaimService claimService) {
        this.userRepository = userRepository;
        this.claimService = claimService;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.USER)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllEmployees() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.EMPLOYEE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getManagerDashboardStats() {
        DashboardStatsResponse stats = claimService.getDashboardStats();
        stats.setTotalUsers(userRepository.countByRole(Role.USER));
        stats.setTotalEmployees(userRepository.countByRole(Role.EMPLOYEE));
        return stats;
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
