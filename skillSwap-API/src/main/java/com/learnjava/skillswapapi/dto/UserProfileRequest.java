package com.learnjava.skillswapapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequest {
    private LocalDate dateOfBirth;
    private String gender;
    private String country;
    private String state;
    private String city;
    private String address;
    private String bio;
}
