package com.example.claimsmanagementapplication.service;

import com.example.claimsmanagementapplication.dto.AuthRequest;
import com.example.claimsmanagementapplication.dto.AuthResponse;
import com.example.claimsmanagementapplication.entity.User;
import com.example.claimsmanagementapplication.exception.BadRequestException;
import com.example.claimsmanagementapplication.exception.UnauthorizedException;
import com.example.claimsmanagementapplication.repository.UserRepository;
import com.example.claimsmanagementapplication.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated. Please contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
