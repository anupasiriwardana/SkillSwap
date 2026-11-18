package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.profile.MyProfileResponse;
import com.learnjava.skillswapapi.dto.profile.ProfileRequest;
import com.learnjava.skillswapapi.entity.Profile;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.exception.NotFoundException;
import com.learnjava.skillswapapi.mapper.UserMapper;
import com.learnjava.skillswapapi.repository.ProfileRepository;
import com.learnjava.skillswapapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.learnjava.skillswapapi.service.support.Queries.trimToNull;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public MyProfileResponse getMine(Long userId) {
        User user = findUser(userId);
        return UserMapper.toMyProfile(user, profileRepository.findById(userId).orElse(null));
    }

    /** Creates the profile on first save (onboarding) and updates it afterwards. */
    @Transactional
    public MyProfileResponse saveMine(Long userId, ProfileRequest request) {
        User user = findUser(userId);
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());

        Profile profile = profileRepository.findById(userId)
                .orElseGet(() -> Profile.builder().user(user).build());
        profile.setHeadline(trimToNull(request.headline()));
        profile.setAbout(request.about().trim());
        profile.setPhone(request.phone().trim());
        profile.setCountry(request.country().trim());
        profile.setCity(request.city().trim());
        profile.setAddress(trimToNull(request.address()));

        return UserMapper.toMyProfile(user, profileRepository.save(profile));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Account not found."));
    }
}
