package com.learnjava.skillswapapi.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

/** Issues and verifies the access tokens. The subject is the user id. */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(JwtProperties properties) {
        byte[] keyBytes = Decoders.BASE64.decode(properties.secret());
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be a base64 string of at least 32 bytes");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = properties.expirationMs();
    }

    public String issueToken(AuthenticatedUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(user.id()))
                .claim("role", user.role().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(key)
                .compact();
    }

    /** Returns the user id when the token is valid and not expired. */
    public Optional<Long> parseUserId(String token) {
        try {
            String subject = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            return Optional.of(Long.valueOf(subject));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
