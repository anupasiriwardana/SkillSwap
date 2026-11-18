package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.skill.SkillResponse;
import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.mapper.SkillMapper;
import com.learnjava.skillswapapi.repository.SkillRepository;
import com.learnjava.skillswapapi.service.support.Queries;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** The shared skill catalogue. Members add to it implicitly by naming new skills. */
@Service
@RequiredArgsConstructor
public class SkillService {

    private static final int SUGGESTION_LIMIT = 8;

    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public List<SkillResponse> suggest(String query) {
        String pattern = Queries.containsPattern(query);
        return skillRepository.suggest(pattern.isEmpty() ? "%" : pattern, PageRequest.of(0, SUGGESTION_LIMIT))
                .stream()
                .map(SkillMapper::toResponse)
                .toList();
    }

    /** Finds a skill by name ignoring case and spacing, creating it if nobody has used it yet. */
    @Transactional
    public Skill findOrCreate(String name) {
        String normalized = Skill.normalize(name);
        return skillRepository.findByNormalizedName(normalized)
                .orElseGet(() -> skillRepository.save(Skill.builder()
                        .name(Skill.tidy(name))
                        .normalizedName(normalized)
                        .build()));
    }
}
