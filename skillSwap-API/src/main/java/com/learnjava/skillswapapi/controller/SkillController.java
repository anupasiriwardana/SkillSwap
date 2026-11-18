package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.skill.SkillResponse;
import com.learnjava.skillswapapi.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    /** Autocomplete for the skill name field. */
    @GetMapping("/suggest")
    public List<SkillResponse> suggest(@RequestParam(defaultValue = "") String q) {
        return skillService.suggest(q);
    }
}
