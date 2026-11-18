package com.learnjava.skillswapapi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/** A skill a user offers to teach or wants to learn. */
@Entity
@Table(name = "user_skills")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private SkillType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProficiencyLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LearningMode mode;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String city;

    @Column(length = 255)
    private String location;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
