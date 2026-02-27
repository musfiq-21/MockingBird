package com.newsApp.service;

import com.newsApp.dto.*;
import com.newsApp.entity.User;
import com.newsApp.repository.UserRepository;
import com.newsApp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername().toLowerCase())) {
            throw new IllegalArgumentException("Username is already taken.");
        }
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = User.builder()
                .name(req.getName().trim())
                .username(req.getUsername().trim().toLowerCase())
                .email(req.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        String identifier = req.getUsername().trim().toLowerCase();

        User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }
}
