package com.learnjava.skillswapapi.dto.member;

import com.learnjava.skillswapapi.dto.skill.UserSkillResponse;

import java.util.List;

/** A member card: public details, their skills and how they relate to the viewer. */
public record MemberSummaryResponse(
        Long id,
        String firstName,
        String lastName,
        String headline,
        String city,
        String country,
        List<UserSkillResponse> teaching,
        List<UserSkillResponse> learning,
        ConnectionInfo connection) {
}
