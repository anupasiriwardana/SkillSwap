package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.controller.RegisterRequest;
import com.learnjava.skillswapapi.controller.AuthenticationRequest;
import com.learnjava.skillswapapi.controller.AuthenticationResponse;
import com.learnjava.skillswapapi.dto.ApiResponse;
import com.learnjava.skillswapapi.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        String message = authService.register(request);
        ApiResponse response = ApiResponse.builder()
                .status("success")
                .message(message)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}