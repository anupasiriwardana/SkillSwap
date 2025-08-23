package com.learnjava.skillswapapi.config;

import com.learnjava.skillswapapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean       //ID Checker
    public UserDetailsService userDetailsService() { //Finds users by email in the database
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean       //safe cracker
    public PasswordEncoder passwordEncoder() { //Encrypts passwords and checks if entered passwords match stored ones
        return new BCryptPasswordEncoder();
    }

    @Bean       //Uses the ID Checker and Safe Cracker to verify login credentials
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());   // The ID Checker
        authProvider.setPasswordEncoder(passwordEncoder());         // The Safe Cracker
        return authProvider;
    }

    @Bean       //Oversees the entire authentication process
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

//How They Work Together:
//    Someone tries to logiin with email and password
//    Security Chief (AuthenticationManager) takes charge
//    Chief delegates to Verification Specialist (AuthenticationProvider)
//    Specialist uses:
//        ID Checker to find the user by email
//        Safe Cracker to verify the password matches
//    If both check out: Access granted!
//    If either fails: Access denied!

//Real-world Analogy: Nightclub Security
//    UserDetailsService: The bouncer who checks your ID against the guest list
//    PasswordEncoder: The guy who checks if your secret handshake is correct
//    AuthenticationProvider: The manager who coordinates both checks
//    AuthenticationManager: The head of security overseeing everything

