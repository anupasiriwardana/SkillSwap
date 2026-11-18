package com.learnjava.skillswapapi.dto.member;

import com.learnjava.skillswapapi.dto.skill.UserSkillResponse;

import java.time.Instant;
import java.util.List;

public record MemberProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String headline,
        String about,
        String city,
        String country,
        Instant memberSince,
        List<UserSkillResponse> teaching,
        List<UserSkillResponse> learning,
        ConnectionInfo connection,
        /* null unless the viewer and this member are connected */
        ContactInfo contact) {
}
