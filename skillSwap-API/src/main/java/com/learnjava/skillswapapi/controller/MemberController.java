package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.common.PageResponse;
import com.learnjava.skillswapapi.dto.member.MemberProfileResponse;
import com.learnjava.skillswapapi.dto.member.MemberSummaryResponse;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    /** Directory of all members, optionally filtered by a skill they list and their city. */
    @GetMapping
    public PageResponse<MemberSummaryResponse> directory(@AuthenticationPrincipal AuthenticatedUser user,
                                                         @RequestParam(required = false) String skill,
                                                         @RequestParam(required = false) String city,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "12") int size) {
        return memberService.directory(user.id(), skill, city, page, size);
    }

    @GetMapping("/{id}")
    public MemberProfileResponse profile(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        return memberService.profile(user, id);
    }
}
