package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}