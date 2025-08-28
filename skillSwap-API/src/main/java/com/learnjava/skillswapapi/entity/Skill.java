package com.learnjava.skillswapapi.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data // Lombok annotation to generate getters, setters, toString, etc.
@NoArgsConstructor // Lombok generates a no-args constructor
@AllArgsConstructor // Lombok generates a constructor with all arguments
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "skill_name", nullable = false, unique = true)
    private String skillName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "base_point_cost", nullable = false)
    private Integer basePointCost;

    @Column(name = "base_demand_multiplier", nullable = false)
    private Double baseDemandMultiplier;

}
