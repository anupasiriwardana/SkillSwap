package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.entity.SkillType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNormalizedName(String normalizedName);

    /** Autocomplete: skills whose name contains the pattern, most used first. */
    @Query("""
            select s from Skill s
            where s.normalizedName like :pattern
            order by (select count(us) from UserSkill us where us.skill = s) desc, s.name asc
            """)
    List<Skill> suggest(@Param("pattern") String pattern, Pageable pageable);

    /** Admin skill list with how many members teach / want to learn each one. */
    @Query(value = """
            select s.id as id, s.name as name, s.createdAt as createdAt,
                   (select count(t) from UserSkill t where t.skill = s and t.type = :teach) as teachCount,
                   (select count(l) from UserSkill l where l.skill = s and l.type = :learn) as learnCount
            from Skill s
            where (:q = '' or s.normalizedName like :q)
            order by s.name asc
            """,
            countQuery = "select count(s) from Skill s where (:q = '' or s.normalizedName like :q)")
    Page<SkillUsageView> searchWithUsage(@Param("q") String q,
                                         @Param("teach") SkillType teach,
                                         @Param("learn") SkillType learn,
                                         Pageable pageable);

    interface SkillUsageView {
        Long getId();

        String getName();

        java.time.Instant getCreatedAt();

        Long getTeachCount();

        Long getLearnCount();
    }
}
