package com.learnjava.skillswapapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            UserAlreadyExistsException.class,
            ResourceAlreadyExistsException.class,
            BadRequestException.class,
            BadCredentialsException.class,
            UsernameNotFoundException.class,
            DisabledException.class,
            LockedException.class,
            JwtAuthenticationException.class,
            JwtExpiredException.class,
            JwtInvalidException.class
    })
    public ResponseEntity<Object> handleCustomExceptions(RuntimeException ex, WebRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (ex instanceof UserAlreadyExistsException ||
                ex instanceof ResourceAlreadyExistsException
            ) {
            status = HttpStatus.CONFLICT; // 409
        } else if (ex instanceof BadRequestException) {
            status = HttpStatus.BAD_REQUEST; // 400
        }else if(ex instanceof ResourceNotFoundException) {
            status = HttpStatus.NOT_FOUND;
        }else if (ex instanceof BadCredentialsException ||
                    ex instanceof UsernameNotFoundException ||
                    ex instanceof DisabledException ||
                    ex instanceof LockedException ||
                    ex instanceof JwtAuthenticationException ||
                    ex instanceof JwtExpiredException ||
                    ex instanceof JwtInvalidException) {
            status = HttpStatus.UNAUTHORIZED; // 401 - All auth failures
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "error");
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, status);
    }
}