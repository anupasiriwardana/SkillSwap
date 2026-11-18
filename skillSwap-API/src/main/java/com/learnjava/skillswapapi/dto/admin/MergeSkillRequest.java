package com.learnjava.skillswapapi.dto.admin;

import jakarta.validation.constraints.NotNull;

/** Moves every listing and request from one skill onto {@code targetSkillId}, then deletes the original. */
public record MergeSkillRequest(@NotNull(message = "Choose the skill to merge into") Long targetSkillId) {
}
