package com.learnjava.skillswapapi.dto;

import com.learnjava.skillswapapi.entity.ProficiencyLevel;
import com.learnjava.skillswapapi.entity.SkillType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SkillAddRequest {
    private String skillName;
    private SkillType skillType;
    private String category;
    private ProficiencyLevel proficiency;
    private Boolean isOnline;
    private Boolean isPhysical;
    private String description;
}
