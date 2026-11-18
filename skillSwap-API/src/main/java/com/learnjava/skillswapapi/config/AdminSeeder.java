package com.learnjava.skillswapapi.config;

import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    private final AdminProperties adminProperties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!adminProperties.isConfigured()) {
            log.info("ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin account creation");
            return;
        }
        String email = adminProperties.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            return;
        }
        userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(adminProperties.password()))
                .firstName("Admin")
                .lastName("User")
                .role(Role.ADMIN)
                .active(true)
                .build());
        log.info("Created admin account {}", email);
    }
}
