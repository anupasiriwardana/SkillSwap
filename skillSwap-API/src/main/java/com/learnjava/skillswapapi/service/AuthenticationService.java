package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.config.JwtService;
import com.learnjava.skillswapapi.controller.AuthenticationRequest;
import com.learnjava.skillswapapi.controller.AuthenticationResponse;
import com.learnjava.skillswapapi.controller.RegisterRequest;
import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.exception.UserAlreadyExistsException;
import com.learnjava.skillswapapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request){

        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))  //encrypt password
                .role(Role.USER)  //set ROLE
                .build();
        userRepository.save(user);  //save user to db
        return "User registered successfully";
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        try {
            authenticationManager.authenticate(   //verify credentials
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid Email or Password");
        }

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)//return the jwt key
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}


//handles both user registration and login - basically,
// it's where users get their digital keys (JWT tokens).

//Step-by-step login:
//    Verify email/password using Spring Security's AuthenticationManager
//    If credentials are wrong → throws exception
//    If credentials are correct → find user in database
//    Generate new JWT token
//    Return the token to user


//AuthenticationManager - The "ID Verifier" : checks if email/password combination is correct