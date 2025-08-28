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
@Table(name = "user_teach_skills",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill_id"}))
public class UserTeachSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id",  nullable = false)
    private Integer userId;

    @Column(name = "skill_id" ,  nullable = false)
    private Integer skillId;

    @Column(name = "demand_multiplier",  nullable = false)
    private Double demandMultiplier;
}
