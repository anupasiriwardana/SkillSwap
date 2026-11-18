package com.learnjava.skillswapapi.dto.auth;

public record AuthResponse(String token, CurrentUserResponse user) {
}
