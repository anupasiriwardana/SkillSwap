package com.learnjava.skillswapapi.dto.profile;

import java.time.Instant;

public record MyProfileResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String headline,
        String about,
        String phone,
        String country,
        String city,
        String address,
        Instant memberSince) {
}
