package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.ApiResponse;
import com.learnjava.skillswapapi.dto.UserInfoResponse;
import com.learnjava.skillswapapi.dto.UserProfileRequest;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.entity.UserProfile;
import com.learnjava.skillswapapi.exception.BadRequestException;
import com.learnjava.skillswapapi.exception.ResourceNotFoundException;
import com.learnjava.skillswapapi.exception.UserAlreadyExistsException;
import com.learnjava.skillswapapi.repository.UserProfileRepository;
import com.learnjava.skillswapapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserInfoService {

    private UserProfileRepository userProfileRepository;
    private UserRepository userRepository;

    public ApiResponse createUserProfile(UserProfileRequest userProfileRequest, Integer userId){
        if(userProfileRepository.findByUserId(userId).isPresent()){
            throw new UserAlreadyExistsException("User details already exists");
        }

        var userProfile = UserProfile.builder()
                .userId(userId)
                .dateOfBirth(userProfileRequest.getDateOfBirth())
                .gender(userProfileRequest.getGender())
                .country(userProfileRequest.getCountry())
                .state(userProfileRequest.getState())
                .city(userProfileRequest.getCity())
                .address(userProfileRequest.getAddress())
                .bio(userProfileRequest.getBio())
                .pointsBalance(0)
                .createdAt(LocalDateTime.now())
                .build();

        try {
            userProfileRepository.save(userProfile);
        } catch (Exception e) {
            throw new BadRequestException("User details could not be saved" + e.getMessage());
        }

        return ApiResponse.builder()
                .status("success")
                .message("User profile created successfully")
                .build();
    }

    public UserInfoResponse getUserDetails(Integer userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User details not found"));

        return UserInfoResponse.builder()
                .userId(userId)
                .dateOfBirth(userProfile.getDateOfBirth())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .dateOfBirth(userProfile.getDateOfBirth())
                .gender(userProfile.getGender())
                .country(userProfile.getCountry())
                .state(userProfile.getState())
                .city(userProfile.getCity())
                .address(userProfile.getAddress())
                .bio(userProfile.getBio())
                .pointsBalance(userProfile.getPointsBalance())
                .createdAt(userProfile.getCreatedAt())
                .build();
    }

    public List<UserInfoResponse> getAllUserDetails() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> {
                    // Try to find user profile, but handle case where it might not exist
                    UserProfile userProfile = userProfileRepository.findByUserId(user.getId())
                            .orElse(null); // Return null if profile doesn't exist

                    return UserInfoResponse.builder()
                            .userId(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(user.getEmail())
                            .dateOfBirth(userProfile != null ? userProfile.getDateOfBirth() : null)
                            .gender(userProfile != null ? userProfile.getGender() : null)
                            .country(userProfile != null ? userProfile.getCountry() : null)
                            .state(userProfile != null ? userProfile.getState() : null)
                            .city(userProfile != null ? userProfile.getCity() : null)
                            .address(userProfile != null ? userProfile.getAddress() : null)
                            .bio(userProfile != null ? userProfile.getBio() : null)
                            .pointsBalance(userProfile != null ? userProfile.getPointsBalance() : 0)
                            .createdAt(userProfile != null ? userProfile.getCreatedAt() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
