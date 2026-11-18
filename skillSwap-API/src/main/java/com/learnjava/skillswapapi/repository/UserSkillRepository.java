package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    @Query("""
            select us from UserSkill us join fetch us.skill
            where us.user.id = :userId
            order by us.createdAt desc
            """)
    List<UserSkill> findAllByUserId(@Param("userId") Long userId);

    @Query("""
            select us from UserSkill us join fetch us.skill
            where us.user.id in :userIds
            order by us.createdAt desc
            """)
    List<UserSkill> findAllByUserIdIn(@Param("userIds") Collection<Long> userIds);

    @Query("select us from UserSkill us join fetch us.skill where us.id = :id and us.user.id = :userId")
    Optional<UserSkill> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    boolean existsByUserIdAndSkillIdAndType(Long userId, Long skillId, SkillType type);

    boolean existsByUserIdAndSkillIdAndTypeAndIdNot(Long userId, Long skillId, SkillType type, Long id);

    long countByType(SkillType type);

    /**
     * Matching building block: listings of the given type for the given skills,
     * owned by other active members.
     */
    @Query("""
            select us from UserSkill us
            join fetch us.skill s
            join fetch us.user u
            where us.type = :type and s.id in :skillIds
              and u.id <> :viewerId and u.active = true and u.role = :role
            """)
    List<UserSkill> findListingsOfOthers(@Param("type") SkillType type,
                                         @Param("skillIds") Collection<Long> skillIds,
                                         @Param("viewerId") Long viewerId,
                                         @Param("role") Role role);

    // --- Admin skill merge -------------------------------------------------

    /** Drops listings that would duplicate an existing listing once the skills are merged. */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            delete from UserSkill us
            where us.skill.id = :sourceId and exists (
                select 1 from UserSkill t
                where t.user = us.user and t.type = us.type and t.skill.id = :targetId)
            """)
    int deleteDuplicatesForMerge(@Param("sourceId") Long sourceId, @Param("targetId") Long targetId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update UserSkill us set us.skill = :target where us.skill.id = :sourceId")
    int reassignSkill(@Param("sourceId") Long sourceId, @Param("target") Skill target);
}
