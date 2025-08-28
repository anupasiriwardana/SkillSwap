package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.ApiResponse;
import com.learnjava.skillswapapi.dto.SkillAddRequest;
import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.UserSkill;
import com.learnjava.skillswapapi.entity.UserTeachSkill;
import com.learnjava.skillswapapi.exception.BadRequestException;
import com.learnjava.skillswapapi.exception.ResourceAlreadyExistsException;
import com.learnjava.skillswapapi.exception.ResourceNotFoundException;
import com.learnjava.skillswapapi.exception.UserAlreadyExistsException;
import com.learnjava.skillswapapi.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserSkillService {

    private UserSkillRepository userSkillRepository;
    private UserRepository userRepository;
    private UserProfileRepository userProfileRepository;
    private SkillRepository skillRepository;
    private UserTeachSkillRepository userTeachSkillRepository;

    public ApiResponse addUserSkill(SkillAddRequest skillAddRequest, Integer userId) {
        // Check if skill exists or create new one
        Skill skill = skillRepository.findBySkillNameIgnoreCase(skillAddRequest.getSkillName())
                .orElseGet(() -> {
                    var newSkill = Skill.builder()
                            .skillName(skillAddRequest.getSkillName())
                            .category(skillAddRequest.getCategory())
                            .basePointCost(10)
                            .baseDemandMultiplier(1.0)
                            .build();

                    try {
                        return skillRepository.save(newSkill);
                    } catch (Exception e) {
                        throw new BadRequestException("Skill could not be saved: " + e.getMessage());
                    }
                });

        // Check if user already has this skill with the SAME TYPE(LEARN, TEACH)
        if (userSkillRepository.findByUserIdAndSkillIdAndType(userId, skill.getId(), skillAddRequest.getSkillType()).isPresent()) {
            throw new ResourceAlreadyExistsException("You already have this skill with the same type (TEACH/LEARN)");
        }

        // Save user skill
        var newUserSkill = UserSkill.builder()
                .skillId(skill.getId()) // Use the actual skill ID
                .userId(userId)
                .type(skillAddRequest.getSkillType())
                .proficiency(skillAddRequest.getProficiency())
                .isOnline(skillAddRequest.getIsOnline())
                .isPhysical(skillAddRequest.getIsPhysical())
                .description(skillAddRequest.getDescription())
                .build();

        try {
            userSkillRepository.save(newUserSkill);
        } catch (Exception e) {
            throw new BadRequestException("User skill could not be saved: " + e.getMessage());
        }

        // If it's a teaching skill, add to skill teach table
        if (skillAddRequest.getSkillType() != SkillType.LEARN) {
            var userTeachSkill = UserTeachSkill.builder()
                    .userId(userId)
                    .skillId(skill.getId()) // Use the actual skill ID
                    .demandMultiplier(1.0)
                    .build();

            // You need to save userTeachSkill to its repository here
             userTeachSkillRepository.save(userTeachSkill);
        }

        return ApiResponse.builder()
                .status("success")
                .message("Skill added successfully")
                .build();
    }
}