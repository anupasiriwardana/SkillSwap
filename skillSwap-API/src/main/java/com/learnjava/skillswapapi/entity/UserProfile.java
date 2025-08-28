package com.learnjava.skillswapapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender" , length = 30)
    private String gender;

    @Column(name = "country" , length = 100)
    private String country;

    @Column(name = "state" ,  length = 100)
    private String state;

    @Column(name = "city" ,  length = 100)
    private String city;

    @Column(name = "address")
    private String address;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "points_balance" , nullable = false)
    private Integer pointsBalance;

    @Column(name = "created_at" , updatable = false)
    private LocalDateTime createdAt;
}
