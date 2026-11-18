package com.learnjava.skillswapapi.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * @param requestedSkillId a skill the recipient teaches that the sender wants to learn
 * @param offeredSkillId   optional skill the sender teaches in return
 */
public record CreateExchangeRequest(
        @NotNull(message = "Choose who to send the request to") Long recipientId,
        @NotNull(message = "Choose the skill you want to learn") Long requestedSkillId,
        Long offeredSkillId,
        @Size(max = 500, message = "Keep the message under 500 characters") String message) {
}
