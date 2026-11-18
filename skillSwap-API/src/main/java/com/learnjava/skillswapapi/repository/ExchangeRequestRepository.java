package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.ExchangeRequest;
import com.learnjava.skillswapapi.entity.RequestStatus;
import com.learnjava.skillswapapi.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    String FETCH_ALL = """
            select r from ExchangeRequest r
            join fetch r.sender join fetch r.recipient
            left join fetch r.requestedSkill left join fetch r.offeredSkill
            """;

    @Query(FETCH_ALL + " where r.id = :id")
    Optional<ExchangeRequest> findWithDetailsById(@Param("id") Long id);

    @Query(FETCH_ALL + " where r.recipient.id = :userId order by r.createdAt desc")
    List<ExchangeRequest> findIncoming(@Param("userId") Long userId);

    @Query(FETCH_ALL + " where r.sender.id = :userId order by r.createdAt desc")
    List<ExchangeRequest> findOutgoing(@Param("userId") Long userId);

    /** Requests in the given statuses between the viewer and any of the other users, in either direction. */
    @Query("""
            select r from ExchangeRequest r
            where r.status in :statuses
              and ((r.sender.id = :viewerId and r.recipient.id in :otherIds)
                or (r.recipient.id = :viewerId and r.sender.id in :otherIds))
            """)
    List<ExchangeRequest> findBetween(@Param("viewerId") Long viewerId,
                                      @Param("otherIds") Collection<Long> otherIds,
                                      @Param("statuses") Collection<RequestStatus> statuses);

    @Query("""
            select count(r) > 0 from ExchangeRequest r
            where r.status = :status
              and ((r.sender.id = :a and r.recipient.id = :b) or (r.sender.id = :b and r.recipient.id = :a))
            """)
    boolean existsBetween(@Param("a") Long a, @Param("b") Long b, @Param("status") RequestStatus status);

    long countByStatus(RequestStatus status);

    long countByRecipientIdAndStatus(Long recipientId, RequestStatus status);

    // --- Admin skill merge -------------------------------------------------

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update ExchangeRequest r set r.requestedSkill = :target where r.requestedSkill.id = :sourceId")
    int reassignRequestedSkill(@Param("sourceId") Long sourceId, @Param("target") Skill target);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update ExchangeRequest r set r.offeredSkill = :target where r.offeredSkill.id = :sourceId")
    int reassignOfferedSkill(@Param("sourceId") Long sourceId, @Param("target") Skill target);
}
