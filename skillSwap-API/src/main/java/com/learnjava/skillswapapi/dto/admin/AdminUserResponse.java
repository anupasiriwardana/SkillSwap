package com.learnjava.skillswapapi.dto.admin;

import com.learnjava.skillswapapi.entity.Role;

import java.time.Instant;

public record AdminUserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        Role role,
        boolean active,
        Instant createdAt) {
}
