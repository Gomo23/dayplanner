package com.dayplanner.security;

import com.dayplanner.model.User;
import com.dayplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

/**
 * Handles ONLY Spring Security's loadUserByUsername().
 * Kept separate from AuthService to break the circular dependency:
 *
 *   OLD (broken):
 *     AuthService (implements UserDetailsService)
 *       ← SecurityConfig needs AuthService to build AuthenticationManager
 *       ← JwtFilter needs AuthService to load user
 *       → AuthService needs AuthenticationManager  💥 LOOP
 *
 *   NEW (fixed):
 *     UserDetailsServiceImpl ← JwtFilter          ✅
 *     UserDetailsServiceImpl ← SecurityConfig      ✅
 *     AuthService            ← AuthenticationManager (no loop) ✅
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}
