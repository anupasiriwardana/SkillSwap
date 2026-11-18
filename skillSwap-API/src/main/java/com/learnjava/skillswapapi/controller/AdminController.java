package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.admin.AdminSkillResponse;
import com.learnjava.skillswapapi.dto.admin.AdminStatsResponse;
import com.learnjava.skillswapapi.dto.admin.AdminUserResponse;
import com.learnjava.skillswapapi.dto.admin.MergeSkillRequest;
import com.learnjava.skillswapapi.dto.admin.UpdateUserStatusRequest;
import com.learnjava.skillswapapi.dto.common.PageResponse;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Admin-only endpoints. Access is restricted to ROLE_ADMIN in SecurityConfig. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsResponse stats() {
        return adminService.stats();
    }

    @GetMapping("/users")
    public PageResponse<AdminUserResponse> users(@RequestParam(defaultValue = "") String q,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        return adminService.users(q, page, size);
    }

    @PatchMapping("/users/{id}/status")
    public AdminUserResponse setStatus(@AuthenticationPrincipal AuthenticatedUser admin,
                                       @PathVariable Long id,
                                       @Valid @RequestBody UpdateUserStatusRequest request) {
        return adminService.setActive(admin.id(), id, request.active());
    }

    @GetMapping("/skills")
    public PageResponse<AdminSkillResponse> skills(@RequestParam(defaultValue = "") String q,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        return adminService.skills(q, page, size);
    }

    @PostMapping("/skills/{id}/merge")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void merge(@PathVariable Long id, @Valid @RequestBody MergeSkillRequest request) {
        adminService.mergeSkill(id, request.targetSkillId());
    }

    @DeleteMapping("/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable Long id) {
        adminService.deleteSkill(id);
    }
}
