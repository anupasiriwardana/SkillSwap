package com.learnjava.skillswapapi.config;

import com.learnjava.skillswapapi.entity.User;
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

        User user = (User) userDetails;
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("email", user.getEmail());
        extraClaims.put("userID", user.getId());
        extraClaims.put("firstName", user.getFirstName());
        extraClaims.put("lastName", user.getLastName());

        return generateToken(extraClaims, userDetails);     // Calls the advanced version
    }

    //why2 generate token func ->> method overloading
    //above -> Quick and easy token generation
    //below(advanced version) -> Token generation with custom data
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts.builder()
                .claims(extraClaims)        // Extra user details go here
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

    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    public String extractFirstName(String token) {
        return extractClaim(token, claims -> claims.get("firstName", String.class));
    }

    public String extractLastName(String token) {
        return extractClaim(token, claims -> claims.get("lastName", String.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
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


//In your controllers or services, you can now get user details directly from the token:
    // Get user ID from token
    //Long userId = jwtService.extractUserId(token);

    // Get user role from token
    //String role = jwtService.extractRole(token);

    // Get full name from token
    //String fullName = jwtService.extractFirstName(token) + " " + jwtService.extractLastName(token);