package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.skill.UserSkillRequest;
import com.learnjava.skillswapapi.dto.skill.UserSkillResponse;
import com.learnjava.skillswapapi.entity.LearningMode;
import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.UserSkill;
import com.learnjava.skillswapapi.exception.ConflictException;
import com.learnjava.skillswapapi.exception.NotFoundException;
import com.learnjava.skillswapapi.mapper.SkillMapper;
import com.learnjava.skillswapapi.repository.UserRepository;
import com.learnjava.skillswapapi.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.learnjava.skillswapapi.service.support.Queries.trimToNull;

/** The signed-in member's own teach / learn listings. */
@Service
@RequiredArgsConstructor
public class UserSkillService {

    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;

    @Transactional(readOnly = true)
    public List<UserSkillResponse> listMine(Long userId) {
        return userSkillRepository.findAllByUserId(userId).stream()
                .map(SkillMapper::toResponse)
                .toList();
    }

    @Transactional
    public UserSkillResponse add(Long userId, UserSkillRequest request) {
        Skill skill = skillService.findOrCreate(request.skillName());
        if (userSkillRepository.existsByUserIdAndSkillIdAndType(userId, skill.getId(), request.type())) {
            throw duplicate(skill, request.type());
        }
        UserSkill userSkill = UserSkill.builder()
                .user(userRepository.getReferenceById(userId))
                .skill(skill)
                .type(request.type())
                .build();
        apply(userSkill, request);
        return SkillMapper.toResponse(userSkillRepository.save(userSkill));
    }

    @Transactional
    public UserSkillResponse update(Long userId, Long userSkillId, UserSkillRequest request) {
        UserSkill userSkill = findOwned(userId, userSkillId);
        Skill skill = skillService.findOrCreate(request.skillName());
        if (userSkillRepository.existsByUserIdAndSkillIdAndTypeAndIdNot(
                userId, skill.getId(), request.type(), userSkillId)) {
            throw duplicate(skill, request.type());
        }
        userSkill.setSkill(skill);
        userSkill.setType(request.type());
        apply(userSkill, request);
        return SkillMapper.toResponse(userSkill);
    }

    @Transactional
    public void delete(Long userId, Long userSkillId) {
        userSkillRepository.delete(findOwned(userId, userSkillId));
    }

    private UserSkill findOwned(Long userId, Long userSkillId) {
        return userSkillRepository.findByIdAndUserId(userSkillId, userId)
                .orElseThrow(() -> new NotFoundException("Skill listing not found."));
    }

    private static void apply(UserSkill userSkill, UserSkillRequest request) {
        userSkill.setLevel(request.level());
        userSkill.setMode(request.mode());
        userSkill.setDescription(trimToNull(request.description()));
        boolean inPerson = request.mode() != LearningMode.ONLINE;
        userSkill.setCity(inPerson ? trimToNull(request.city()) : null);
        userSkill.setLocation(inPerson ? trimToNull(request.location()) : null);
    }

    private static ConflictException duplicate(Skill skill, SkillType type) {
        String list = type == SkillType.TEACH ? "skills you teach" : "skills you want to learn";
        return new ConflictException(skill.getName() + " is already in your " + list + ".");
    }
}
