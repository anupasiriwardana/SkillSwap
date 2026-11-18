package com.learnjava.skillswapapi.dto.skill;

import com.learnjava.skillswapapi.entity.LearningMode;
import com.learnjava.skillswapapi.entity.ProficiencyLevel;
import com.learnjava.skillswapapi.entity.SkillType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * A skill to teach or learn. For TEACH the level is how well the member knows it;
 * for LEARN it is their current level.
 */
public record UserSkillRequest(
        @NotBlank(message = "Skill name is required")
        @Size(max = 80, message = "Keep the skill name under 80 characters") String skillName,
        @NotNull(message = "Choose teach or learn") SkillType type,
        @NotNull(message = "Choose a level") ProficiencyLevel level,
        @NotNull(message = "Choose how you want to meet") LearningMode mode,
        @Size(max = 1000, message = "Keep the description under 1000 characters") String description,
        @Size(max = 100) String city,
        @Size(max = 255) String location) {

    @JsonIgnore
    @AssertTrue(message = "City is required for in-person sessions")
    public boolean isCityGivenForInPerson() {
        return mode == null || !mode.includesInPerson() || (city != null && !city.isBlank());
    }
}
