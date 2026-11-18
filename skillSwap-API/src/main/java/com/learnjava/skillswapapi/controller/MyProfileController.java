package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.profile.MyProfileResponse;
import com.learnjava.skillswapapi.dto.profile.ProfileRequest;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me/profile")
@RequiredArgsConstructor
public class MyProfileController {

    private final ProfileService profileService;

    @GetMapping
    public MyProfileResponse get(@AuthenticationPrincipal AuthenticatedUser user) {
        return profileService.getMine(user.id());
    }

    @PutMapping
    public MyProfileResponse save(@AuthenticationPrincipal AuthenticatedUser user,
                                  @Valid @RequestBody ProfileRequest request) {
        return profileService.saveMine(user.id(), request);
    }
}
