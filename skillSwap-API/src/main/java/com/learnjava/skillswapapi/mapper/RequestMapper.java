package com.learnjava.skillswapapi.mapper;

import com.learnjava.skillswapapi.dto.member.ContactInfo;
import com.learnjava.skillswapapi.dto.request.ExchangeRequestResponse;
import com.learnjava.skillswapapi.entity.ExchangeRequest;

public final class RequestMapper {

    private RequestMapper() {
    }

    public static ExchangeRequestResponse toResponse(ExchangeRequest request, ContactInfo otherPartyContact) {
        return new ExchangeRequestResponse(
                request.getId(),
                request.getStatus(),
                UserMapper.toRef(request.getSender()),
                UserMapper.toRef(request.getRecipient()),
                SkillMapper.toResponse(request.getRequestedSkill()),
                SkillMapper.toResponse(request.getOfferedSkill()),
                request.getMessage(),
                request.getCreatedAt(),
                request.getRespondedAt(),
                otherPartyContact);
    }
}
