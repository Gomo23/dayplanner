package com.dayplanner.service;

import com.dayplanner.dto.*;
import com.dayplanner.model.User;
import com.dayplanner.repository.UserRepository;
import com.dayplanner.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles register and login ONLY.
 * Does NOT implement UserDetailsService — that is UserDetailsServiceImpl.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use");

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .build();
        userRepo.save(user);
        return new AuthResponse(jwtUtil.generate(user.getEmail()), user.getName(), user.getEmail());
    }

    public AuthResponse login(AuthRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        return new AuthResponse(jwtUtil.generate(user.getEmail()), user.getName(), user.getEmail());
    }
}
