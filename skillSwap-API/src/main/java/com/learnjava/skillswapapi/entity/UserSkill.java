package com.learnjava.skillswapapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_skills",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill_id", "type"}))
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "skill_id", nullable = false)
    private Integer skillId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private SkillType type; // TEACH, LEARN, BOTH

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency")
    private ProficiencyLevel proficiency; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    @Column(name = "is_online", nullable = false)
    private Boolean isOnline = false;

    @Column(name = "is_physical", nullable = false)
    private Boolean isPhysical = false;

    @Column(name = "description")
    private String description;

}