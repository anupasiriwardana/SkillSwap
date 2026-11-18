package com.learnjava.skillswapapi.dto.request;

import com.learnjava.skillswapapi.dto.member.ContactInfo;
import com.learnjava.skillswapapi.dto.skill.SkillResponse;
import com.learnjava.skillswapapi.entity.RequestStatus;

import java.time.Instant;

public record ExchangeRequestResponse(
        Long id,
        RequestStatus status,
        MemberRef sender,
        MemberRef recipient,
        SkillResponse requestedSkill,
        SkillResponse offeredSkill,
        String message,
        Instant createdAt,
        Instant respondedAt,
        /* the other member's contact details, once the request is accepted */
        ContactInfo contact) {
}
