package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.auth.AuthResponse;
import com.learnjava.skillswapapi.dto.auth.CurrentUserResponse;
import com.learnjava.skillswapapi.dto.auth.LoginRequest;
import com.learnjava.skillswapapi.dto.auth.RegisterRequest;
import com.learnjava.skillswapapi.entity.RequestStatus;
import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.exception.ConflictException;
import com.learnjava.skillswapapi.exception.NotFoundException;
import com.learnjava.skillswapapi.mapper.UserMapper;
import com.learnjava.skillswapapi.repository.ExchangeRequestRepository;
import com.learnjava.skillswapapi.repository.ProfileRepository;
import com.learnjava.skillswapapi.repository.UserRepository;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ExchangeRequestRepository requestRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /** Creates a member account and signs them in straight away. */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists.");
        }
        User user = userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .role(Role.USER)
                .active(true)
                .build());
        String token = jwtService.issueToken(AuthenticatedUser.from(user));
        return new AuthResponse(token, UserMapper.toCurrentUser(user, false, 0));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizeEmail(request.email()), request.password()));
        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        return new AuthResponse(jwtService.issueToken(principal), currentUser(principal.id()));
    }

    @Transactional(readOnly = true)
    public CurrentUserResponse currentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Account not found."));
        return UserMapper.toCurrentUser(user,
                profileRepository.existsById(userId),
                requestRepository.countByRecipientIdAndStatus(userId, RequestStatus.PENDING));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
