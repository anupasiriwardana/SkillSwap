package com.learnjava.skillswapapi.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private String country;
    private String state;
    private String city;
    private String address;
    private String bio;
    private Integer pointsBalance;
    private LocalDateTime createdAt;
}
