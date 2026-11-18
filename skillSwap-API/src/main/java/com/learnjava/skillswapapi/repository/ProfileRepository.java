package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.Profile;
import com.learnjava.skillswapapi.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    List<Profile> findByUserIdIn(Collection<Long> userIds);

    /**
     * Member directory: active members with a profile, excluding the viewer.
     * Filters are lower-cased LIKE patterns; pass an empty string to skip one.
     */
    @Query(value = """
            select p from Profile p join fetch p.user u
            where u.active = true and u.role = :role and u.id <> :viewerId
              and (:city = '' or lower(p.city) like :city)
              and (:skill = '' or exists (
                    select 1 from UserSkill us
                    where us.user = u and us.skill.normalizedName like :skill))
            """,
            countQuery = """
            select count(p) from Profile p join p.user u
            where u.active = true and u.role = :role and u.id <> :viewerId
              and (:city = '' or lower(p.city) like :city)
              and (:skill = '' or exists (
                    select 1 from UserSkill us
                    where us.user = u and us.skill.normalizedName like :skill))
            """)
    Page<Profile> searchDirectory(@Param("viewerId") Long viewerId,
                                  @Param("role") Role role,
                                  @Param("city") String city,
                                  @Param("skill") String skill,
                                  Pageable pageable);
}
