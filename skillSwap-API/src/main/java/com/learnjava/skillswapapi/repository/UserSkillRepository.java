package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill,Integer> {
    List<UserSkill> findByUserId(Integer userId);

    List<UserSkill> findBySkillId(Integer skillId);

    Optional<UserSkill> findByUserIdAndSkillId(Integer userId, Integer skillId);

    Optional<UserSkill> findByUserIdAndSkillIdAndType(Integer userId, Integer skillId, SkillType type);

    List<UserSkill> findByType(SkillType type);

    List<UserSkill> findByIsOnlineTrue();

    List<UserSkill> findByIsPhysicalTrue();
}
