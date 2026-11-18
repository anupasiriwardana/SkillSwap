package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.member.ContactInfo;
import com.learnjava.skillswapapi.dto.request.CreateExchangeRequest;
import com.learnjava.skillswapapi.dto.request.ExchangeRequestResponse;
import com.learnjava.skillswapapi.entity.ExchangeRequest;
import com.learnjava.skillswapapi.entity.Profile;
import com.learnjava.skillswapapi.entity.RequestStatus;
import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.exception.BadRequestException;
import com.learnjava.skillswapapi.exception.ConflictException;
import com.learnjava.skillswapapi.exception.NotFoundException;
import com.learnjava.skillswapapi.mapper.RequestMapper;
import com.learnjava.skillswapapi.mapper.UserMapper;
import com.learnjava.skillswapapi.repository.ExchangeRequestRepository;
import com.learnjava.skillswapapi.repository.ProfileRepository;
import com.learnjava.skillswapapi.repository.SkillRepository;
import com.learnjava.skillswapapi.repository.UserRepository;
import com.learnjava.skillswapapi.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.learnjava.skillswapapi.service.support.Queries.trimToNull;

/** Sending, answering and listing skill swap requests. */
@Service
@RequiredArgsConstructor
public class ExchangeRequestService {

    private final ExchangeRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    @Transactional
    public ExchangeRequestResponse send(Long senderId, CreateExchangeRequest request) {
        Long recipientId = request.recipientId();
        if (senderId.equals(recipientId)) {
            throw new BadRequestException("You can't send a request to yourself.");
        }
        User recipient = userRepository.findById(recipientId)
                .filter(user -> user.isActive() && user.getRole() == Role.USER)
                .orElseThrow(() -> new NotFoundException("Member not found."));
        if (!profileRepository.existsById(senderId)) {
            throw new BadRequestException("Complete your profile before sending requests.");
        }
        if (!userSkillRepository.existsByUserIdAndSkillIdAndType(recipientId, request.requestedSkillId(), SkillType.TEACH)) {
            throw new BadRequestException("This member doesn't teach that skill.");
        }
        if (request.offeredSkillId() != null && !userSkillRepository.existsByUserIdAndSkillIdAndType(
                senderId, request.offeredSkillId(), SkillType.TEACH)) {
            throw new BadRequestException("You can only offer skills you have listed to teach.");
        }
        if (requestRepository.existsBetween(senderId, recipientId, RequestStatus.PENDING)) {
            throw new ConflictException("There is already a pending request between you and this member.");
        }

        ExchangeRequest saved = requestRepository.save(ExchangeRequest.builder()
                .sender(userRepository.getReferenceById(senderId))
                .recipient(recipient)
                .requestedSkill(skillRepository.getReferenceById(request.requestedSkillId()))
                .offeredSkill(request.offeredSkillId() == null ? null
                        : skillRepository.getReferenceById(request.offeredSkillId()))
                .message(trimToNull(request.message()))
                .status(RequestStatus.PENDING)
                .build());
        return toResponses(senderId, List.of(reload(saved.getId()))).getFirst();
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequestResponse> incoming(Long userId) {
        return toResponses(userId, requestRepository.findIncoming(userId));
    }

    @Transactional(readOnly = true)
    public List<ExchangeRequestResponse> outgoing(Long userId) {
        return toResponses(userId, requestRepository.findOutgoing(userId));
    }

    @Transactional
    public ExchangeRequestResponse accept(Long userId, Long requestId) {
        return respond(userId, requestId, RequestStatus.ACCEPTED);
    }

    @Transactional
    public ExchangeRequestResponse decline(Long userId, Long requestId) {
        return respond(userId, requestId, RequestStatus.DECLINED);
    }

    @Transactional
    public ExchangeRequestResponse cancel(Long userId, Long requestId) {
        ExchangeRequest request = reload(requestId);
        if (!request.getSender().getId().equals(userId)) {
            throw new NotFoundException("Request not found.");
        }
        requirePending(request);
        request.setStatus(RequestStatus.CANCELLED);
        request.setRespondedAt(Instant.now());
        return toResponses(userId, List.of(request)).getFirst();
    }

    private ExchangeRequestResponse respond(Long userId, Long requestId, RequestStatus newStatus) {
        ExchangeRequest request = reload(requestId);
        if (!request.getRecipient().getId().equals(userId)) {
            throw new NotFoundException("Request not found.");
        }
        requirePending(request);
        request.setStatus(newStatus);
        request.setRespondedAt(Instant.now());
        return toResponses(userId, List.of(request)).getFirst();
    }

    private static void requirePending(ExchangeRequest request) {
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new ConflictException("This request has already been " + request.getStatus().name().toLowerCase() + ".");
        }
    }

    private ExchangeRequest reload(Long requestId) {
        return requestRepository.findWithDetailsById(requestId)
                .orElseThrow(() -> new NotFoundException("Request not found."));
    }

    /** Maps requests for the viewer, attaching the other member's contact details on accepted ones. */
    private List<ExchangeRequestResponse> toResponses(Long viewerId, List<ExchangeRequest> requests) {
        List<Long> connectedIds = requests.stream()
                .filter(r -> r.getStatus() == RequestStatus.ACCEPTED)
                .map(r -> otherParty(r, viewerId).getId())
                .toList();
        Map<Long, Profile> profiles = connectedIds.isEmpty() ? Map.of()
                : profileRepository.findByUserIdIn(connectedIds).stream()
                .collect(Collectors.toMap(Profile::getUserId, Function.identity()));

        return requests.stream()
                .map(r -> {
                    ContactInfo contact = null;
                    if (r.getStatus() == RequestStatus.ACCEPTED) {
                        User other = otherParty(r, viewerId);
                        contact = UserMapper.toContact(other, profiles.get(other.getId()));
                    }
                    return RequestMapper.toResponse(r, contact);
                })
                .toList();
    }

    private static User otherParty(ExchangeRequest request, Long viewerId) {
        return request.getSender().getId().equals(viewerId) ? request.getRecipient() : request.getSender();
    }
}
