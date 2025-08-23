package com.learnjava.skillswapapi.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        //Looks for the "Authorization" header with "Bearer " prefix
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);

        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            //Looks up the user in the database to get their details
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            //Checks if the token is genuine and not expired
            if(jwtService.isTokenValid(jwt, userDetails)) {
                //Creates a security pass and puts it in the current request's context
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(request, response);
        }

    }
}

//This filter is a security checkpoint that runs before every request.
//It looks for JWT tokens, verifies them, and tells Spring Security who's making the request.

//JwtService = Invitation verification machine

//SecurityContextHolder - The "VIP Lounge"
//    Stores who's currently "logged in" for this request
//    Like a special area that remembers who has valid access


//UsernamePasswordAuthenticationToken - The "VIP Wristband"
//    Contains: Who you are + Your permissions + Request details
//    Like a wristband that shows you're authenticated


//WebAuthenticationDetailsSource - The "Security Camera"
//    Adds request details like IP address, session ID, etc.
//    Like security noting down where you came from
