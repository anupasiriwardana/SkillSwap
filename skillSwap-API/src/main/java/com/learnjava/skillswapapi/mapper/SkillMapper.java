package com.learnjava.skillswapapi.mapper;

import com.learnjava.skillswapapi.dto.skill.SkillResponse;
import com.learnjava.skillswapapi.dto.skill.UserSkillResponse;
import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.UserSkill;

import java.util.Collection;
import java.util.List;

public final class SkillMapper {

    private SkillMapper() {
    }

    public static SkillResponse toResponse(Skill skill) {
        return skill == null ? null : new SkillResponse(skill.getId(), skill.getName());
    }

    public static UserSkillResponse toResponse(UserSkill userSkill) {
        return new UserSkillResponse(
                userSkill.getId(),
                userSkill.getSkill().getId(),
                userSkill.getSkill().getName(),
                userSkill.getType(),
                userSkill.getLevel(),
                userSkill.getMode(),
                userSkill.getDescription(),
                userSkill.getCity(),
                userSkill.getLocation());
    }

    public static List<UserSkillResponse> ofType(Collection<UserSkill> userSkills, SkillType type) {
        return userSkills.stream()
                .filter(us -> us.getType() == type)
                .map(SkillMapper::toResponse)
                .toList();
    }
}
