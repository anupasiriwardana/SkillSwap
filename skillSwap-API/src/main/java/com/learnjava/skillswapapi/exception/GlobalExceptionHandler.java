package com.learnjava.skillswapapi.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Turns every error into an RFC 7807 problem response:
 * {@code { "status": 400, "title": "...", "detail": "...", "errors": { "field": "message" } }}.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ProblemDetail handleApi(ApiException ex) {
        return problem(ex.getStatus(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        ex.getBindingResult().getGlobalErrors()
                .forEach(error -> errors.putIfAbsent(error.getObjectName(), error.getDefaultMessage()));

        ProblemDetail problem = problem(HttpStatus.BAD_REQUEST, "Some fields are invalid.");
        problem.setProperty("errors", errors);
        return problem;
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ProblemDetail handleUnreadable(Exception ex) {
        return problem(HttpStatus.BAD_REQUEST, "The request could not be read.");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        return problem(HttpStatus.UNAUTHORIZED, "Incorrect email or password.");
    }

    @ExceptionHandler(DisabledException.class)
    public ProblemDetail handleDisabled(DisabledException ex) {
        return problem(HttpStatus.FORBIDDEN, "This account has been deactivated.");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        return problem(HttpStatus.FORBIDDEN, "You do not have access to this resource.");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleIntegrity(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
        return problem(HttpStatus.CONFLICT, "This change conflicts with existing data.");
    }

    @ExceptionHandler({NoResourceFoundException.class, HttpRequestMethodNotSupportedException.class})
    public ProblemDetail handleNotFound(Exception ex) {
        return problem(HttpStatus.NOT_FOUND, "Not found.");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        log.error("Unhandled error", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
    }

    public static ProblemDetail problem(HttpStatus status, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(status.getReasonPhrase());
        return problem;
    }
}
