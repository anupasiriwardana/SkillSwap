package com.learnjava.skillswapapi.config;

import com.learnjava.skillswapapi.config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtExtractorHelper {

    private final JwtService jwtService;

    public String extractTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid authorization header"); // Or a custom exception
        }
        return authHeader.substring(7); // Return the pure JWT token
    }

    // Optional: Helper to directly extract the User ID
    public Integer extractUserIdFromRequest(HttpServletRequest request) {
        String jwtToken = extractTokenFromRequest(request);
        return jwtService.extractUserId(jwtToken);
    }
}
