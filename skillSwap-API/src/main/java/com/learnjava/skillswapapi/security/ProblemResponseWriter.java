package com.learnjava.skillswapapi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnjava.skillswapapi.exception.GlobalExceptionHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/** Writes 401/403 responses from the security filter chain in the same problem format as controllers. */
@Component
@RequiredArgsConstructor
public class ProblemResponseWriter {

    private final ObjectMapper objectMapper;

    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, ex) ->
                write(response, HttpStatus.UNAUTHORIZED, "Please sign in to continue.");
    }

    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, ex) ->
                write(response, HttpStatus.FORBIDDEN, "You do not have access to this resource.");
    }

    private void write(HttpServletResponse response, HttpStatus status, String detail) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), GlobalExceptionHandler.problem(status, detail));
    }
}
