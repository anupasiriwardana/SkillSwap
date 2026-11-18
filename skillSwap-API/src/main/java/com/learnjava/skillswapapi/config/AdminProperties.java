package com.learnjava.skillswapapi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Credentials for the first admin account, created on startup when it does not exist yet. */
@ConfigurationProperties(prefix = "app.admin")
public record AdminProperties(String email, String password) {

    public boolean isConfigured() {
        return email != null && !email.isBlank() && password != null && !password.isBlank();
    }
}
