package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.skill.UserSkillRequest;
import com.learnjava.skillswapapi.dto.skill.UserSkillResponse;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.UserSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/me/skills")
@RequiredArgsConstructor
public class MySkillController {

    private final UserSkillService userSkillService;

    @GetMapping
    public List<UserSkillResponse> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return userSkillService.listMine(user.id());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserSkillResponse add(@AuthenticationPrincipal AuthenticatedUser user,
                                 @Valid @RequestBody UserSkillRequest request) {
        return userSkillService.add(user.id(), request);
    }

    @PutMapping("/{id}")
    public UserSkillResponse update(@AuthenticationPrincipal AuthenticatedUser user,
                                    @PathVariable Long id,
                                    @Valid @RequestBody UserSkillRequest request) {
        return userSkillService.update(user.id(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        userSkillService.delete(user.id(), id);
    }
}
