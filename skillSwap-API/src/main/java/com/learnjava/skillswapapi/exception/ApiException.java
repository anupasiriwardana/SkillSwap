package com.learnjava.skillswapapi.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/** Base class for errors that map directly to an HTTP status with a user-facing message. */
@Getter
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;

    protected ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
