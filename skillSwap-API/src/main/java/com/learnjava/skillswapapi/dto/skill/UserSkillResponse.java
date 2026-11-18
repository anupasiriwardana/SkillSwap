package com.learnjava.skillswapapi.dto.skill;

import com.learnjava.skillswapapi.entity.LearningMode;
import com.learnjava.skillswapapi.entity.ProficiencyLevel;
import com.learnjava.skillswapapi.entity.SkillType;

public record UserSkillResponse(
        Long id,
        Long skillId,
        String skillName,
        SkillType type,
        ProficiencyLevel level,
        LearningMode mode,
        String description,
        String city,
        String location) {
}
