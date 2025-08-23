package com.learnjava.skillswapapi.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    // Constructor injection with @Value to get the secret from application.properties
    public JwtService(@Value("${jwt.secret}") String secretKey,
                      @Value("${jwt.expiration}") long expiration) {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);

        this.expiration = expiration;
    }

    //Creates new passports (JWT tokens) for authenticated users
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);     // Calls the advanced version
    }

    //why2 generate token func ->> method overloading
    //above -> Quick and easy token generation
    //below(advanced version) -> Token generation with custom data
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    //Reads information from existing passports(tokens)
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //Reads information from existing passports(tokens)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //Reads information from existing passports(tokens)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String userEmail = extractUsername(token);
        return (userEmail.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

//When User Logs In (Gets Passport/token):
//    User provides correct email/password
//    Passport Office creates a JWT token: generateToken(userDetails)
//    User receives this digital passport


//When User Makes Request (Shows Passport):
//    User sends request with JWT token in header
//    Passport Inspection reads the token: extractUsername(token)
//    Passport Validation checks: isTokenValid(token, userDetails)
//    If valid → Access granted! ✅


//generateToken() = Getting your passport stamped when entering a country
//extractUsername() = Border agent reading your name from passport
//isTokenValid() = Checking if passport is genuine and not expired
//secretKey = The government's official seal that makes passports authentic


// Just create a basic token
//String token = jwtService.generateToken(userDetails);


// Create token with extra information
//Map<String, Object> extraClaims = new HashMap<>();
//extraClaims.put("role", user.getRole());
//        extraClaims.put("userId", user.getId());
//        extraClaims.put("preferences", user.getPreferences());
//
//String token = jwtService.generateToken(extraClaims, userDetails);