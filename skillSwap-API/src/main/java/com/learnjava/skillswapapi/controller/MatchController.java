package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.match.MatchesResponse;
import com.learnjava.skillswapapi.entity.LearningMode;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public MatchesResponse matches(@AuthenticationPrincipal AuthenticatedUser user,
                                   @RequestParam(required = false) LearningMode mode,
                                   @RequestParam(required = false) String city) {
        return matchService.findMatches(user.id(), mode, city);
    }
}
