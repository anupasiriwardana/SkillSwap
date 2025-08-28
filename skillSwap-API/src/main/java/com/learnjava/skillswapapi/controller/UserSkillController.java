package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.config.JwtExtractorHelper;
import com.learnjava.skillswapapi.dto.ApiResponse;
import com.learnjava.skillswapapi.dto.SkillAddRequest;
import com.learnjava.skillswapapi.service.UserSkillService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skill")
@RequiredArgsConstructor
public class UserSkillController {
    private final UserSkillService userSkillService;
    private final JwtExtractorHelper jwtExtractorHelper;

    @PostMapping("/add-skill")
    public ResponseEntity<ApiResponse> addUserSkill(
            @RequestBody SkillAddRequest skillAddRequest,
            HttpServletRequest request
            ){
        Integer userId = jwtExtractorHelper.extractUserIdFromRequest(request);
        ApiResponse response = userSkillService.addUserSkill(skillAddRequest,userId);
        return ResponseEntity.ok(response);
    }
}
