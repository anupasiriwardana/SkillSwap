package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.dto.UserInfoResponse;
import com.learnjava.skillswapapi.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {
    Optional<UserProfile> findByUserId(Integer userId);
}
