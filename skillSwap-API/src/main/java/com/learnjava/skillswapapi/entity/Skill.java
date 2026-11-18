package com.learnjava.skillswapapi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.Locale;

@Entity
@Table(name = "skills")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String name;

    /** Lower-cased, whitespace-collapsed name used for matching, so "Guitar " and "guitar" are one skill. */
    @Column(name = "normalized_name", nullable = false, unique = true, length = 80)
    private String normalizedName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public static String tidy(String name) {
        return name.trim().replaceAll("\\s+", " ");
    }

    public static String normalize(String name) {
        return tidy(name).toLowerCase(Locale.ROOT);
    }
}
