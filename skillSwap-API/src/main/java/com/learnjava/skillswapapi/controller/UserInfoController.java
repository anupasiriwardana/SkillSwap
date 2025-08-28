package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.config.JwtExtractorHelper;
import com.learnjava.skillswapapi.config.JwtService;
import com.learnjava.skillswapapi.dto.ApiResponse;
import com.learnjava.skillswapapi.dto.UserInfoResponse;
import com.learnjava.skillswapapi.dto.UserProfileRequest;
import com.learnjava.skillswapapi.service.UserInfoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-info")
@RequiredArgsConstructor
public class UserInfoController {
    private final UserInfoService userInfoService;
    private final JwtExtractorHelper jwtExtractorHelper;

    @PostMapping("/create-profile")
    public ResponseEntity<ApiResponse> createUserProfile(
            @RequestBody UserProfileRequest userProfileRequest,
            HttpServletRequest request
    ) {
        Integer userId = jwtExtractorHelper.extractUserIdFromRequest(request);
        ApiResponse response = userInfoService.createUserProfile(userProfileRequest, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-userinfo")
    public ResponseEntity<UserInfoResponse> getUserInfo(
            HttpServletRequest request
    ){
        Integer userId = jwtExtractorHelper.extractUserIdFromRequest(request);
        UserInfoResponse response = userInfoService.getUserDetails(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-all-userinfo")
    public ResponseEntity<List<UserInfoResponse>> getAllUserInfo(){
        List<UserInfoResponse> response = userInfoService.getAllUserDetails();
        return ResponseEntity.ok(response);
    }
}
