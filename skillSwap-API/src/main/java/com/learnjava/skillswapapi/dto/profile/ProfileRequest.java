package com.learnjava.skillswapapi.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfileRequest(
        @NotBlank(message = "First name is required") @Size(max = 100) String firstName,
        @NotBlank(message = "Last name is required") @Size(max = 100) String lastName,
        @Size(max = 120, message = "Keep the headline under 120 characters") String headline,
        @NotBlank(message = "Tell others a little about yourself")
        @Size(max = 2000, message = "Keep this under 2000 characters") String about,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[+0-9 ()-]{7,30}$", message = "Enter a valid phone number") String phone,
        @NotBlank(message = "Country is required") @Size(max = 100) String country,
        @NotBlank(message = "City is required") @Size(max = 100) String city,
        @Size(max = 255) String address) {
}
