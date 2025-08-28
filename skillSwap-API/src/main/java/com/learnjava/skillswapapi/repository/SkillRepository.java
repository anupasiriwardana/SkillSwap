package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill,Integer> {
    List<Skill> findBySkillNameContainingIgnoreCase(String skillName);
    List<Skill> findByCategoryContainingIgnoreCase(String categoryName);
    Optional<Skill> findBySkillNameIgnoreCase(String skillName);
    Optional<Skill> findBySkillNameAndCategoryIgnoreCase(String skillName, String categoryName);

    @Query("SELECT DISTINCT s.category FROM Skill s")
    List<String> findAllDistinctCategories();
}
