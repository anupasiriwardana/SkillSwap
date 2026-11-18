package com.learnjava.skillswapapi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/** A request from one user to swap skills with another. */
@Entity
@Table(name = "exchange_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    /** What the sender wants to learn from the recipient. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_skill_id")
    private Skill requestedSkill;

    /** What the sender offers to teach in return (optional). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_skill_id")
    private Skill offeredSkill;

    @Column(length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "responded_at")
    private Instant respondedAt;

    public boolean involves(Long userId) {
        return sender.getId().equals(userId) || recipient.getId().equals(userId);
    }
}
