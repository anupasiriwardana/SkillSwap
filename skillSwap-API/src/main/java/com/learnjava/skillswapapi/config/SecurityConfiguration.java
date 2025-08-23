package com.learnjava.skillswapapi.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll() // Added example endpoint
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  //No Remembering Guests
                                                //JWT is self-contained - server doesn't need to remember sessions
                )
                    //Hires the credential verification team from ApplicationConfig -> checks usernames and passwords
                .authenticationProvider(authenticationProvider)
                    //Puts our JwtAuthenticationFilter before Spring's default login filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

//This class is the rulebook that tells Spring Security how to
//        protect your application - which doors are open, which need keys, and how to handle security.


//CSRF Disable = "We're using digital tickets, not paper wristbands"
//Authorize Requests = "Lobby: anyone can enter, VIP areas: invitation only"
//Stateless Sessions = "We won't remember you - show your ticket each time"
//Authentication Provider = "Here's our ID checking team"
//JWT Filter = "Our custom bouncer who understands digital tickets"