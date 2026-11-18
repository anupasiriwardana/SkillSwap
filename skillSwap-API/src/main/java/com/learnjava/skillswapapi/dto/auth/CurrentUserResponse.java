package com.learnjava.skillswapapi.dto.auth;

import com.learnjava.skillswapapi.entity.Role;

public record CurrentUserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        Role role,
        boolean profileCompleted,
        long pendingIncomingRequests) {
}
