package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.common.PageResponse;
import com.learnjava.skillswapapi.dto.member.ConnectionInfo;
import com.learnjava.skillswapapi.dto.member.ConnectionStatus;
import com.learnjava.skillswapapi.dto.member.ContactInfo;
import com.learnjava.skillswapapi.dto.member.MemberProfileResponse;
import com.learnjava.skillswapapi.dto.member.MemberSummaryResponse;
import com.learnjava.skillswapapi.entity.Profile;
import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.entity.UserSkill;
import com.learnjava.skillswapapi.exception.NotFoundException;
import com.learnjava.skillswapapi.mapper.SkillMapper;
import com.learnjava.skillswapapi.mapper.UserMapper;
import com.learnjava.skillswapapi.repository.ProfileRepository;
import com.learnjava.skillswapapi.repository.UserSkillRepository;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.support.Queries;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Browsing other members and viewing their profiles. */
@Service
@RequiredArgsConstructor
public class MemberService {

    private final ProfileRepository profileRepository;
    private final UserSkillRepository userSkillRepository;
    private final ConnectionService connectionService;

    @Transactional(readOnly = true)
    public PageResponse<MemberSummaryResponse> directory(Long viewerId, String skill, String city, int page, int size) {
        Page<Profile> profiles = profileRepository.searchDirectory(
                viewerId, Role.USER,
                Queries.containsPattern(city),
                Queries.containsPattern(skill),
                Queries.page(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<Long> userIds = profiles.getContent().stream().map(Profile::getUserId).toList();
        Map<Long, List<UserSkill>> skillsByUser = userIds.isEmpty() ? Map.of()
                : userSkillRepository.findAllByUserIdIn(userIds).stream()
                .collect(Collectors.groupingBy(us -> us.getUser().getId()));
        Map<Long, ConnectionInfo> connections = connectionService.connectionsWith(viewerId, userIds);

        List<MemberSummaryResponse> content = profiles.getContent().stream()
                .map(profile -> {
                    User user = profile.getUser();
                    List<UserSkill> skills = skillsByUser.getOrDefault(user.getId(), List.of());
                    return new MemberSummaryResponse(
                            user.getId(), user.getFirstName(), user.getLastName(),
                            profile.getHeadline(), profile.getCity(), profile.getCountry(),
                            SkillMapper.ofType(skills, SkillType.TEACH),
                            SkillMapper.ofType(skills, SkillType.LEARN),
                            connections.getOrDefault(user.getId(), ConnectionInfo.NONE));
                })
                .toList();
        return PageResponse.of(profiles, content);
    }

    @Transactional(readOnly = true)
    public MemberProfileResponse profile(AuthenticatedUser viewer, Long memberId) {
        Profile profile = profileRepository.findById(memberId)
                .orElseThrow(() -> new NotFoundException("Member not found."));
        User user = profile.getUser();
        boolean self = viewer.id().equals(memberId);
        if (!viewer.isAdmin() && !self && (!user.isActive() || user.getRole() != Role.USER)) {
            throw new NotFoundException("Member not found.");
        }

        List<UserSkill> skills = userSkillRepository.findAllByUserId(memberId);
        ConnectionInfo connection = self ? ConnectionInfo.NONE : connectionService.connectionWith(viewer.id(), memberId);
        boolean canSeeContact = self || viewer.isAdmin() || connection.status() == ConnectionStatus.CONNECTED;
        ContactInfo contact = canSeeContact ? UserMapper.toContact(user, profile) : null;

        return new MemberProfileResponse(
                user.getId(), user.getFirstName(), user.getLastName(),
                profile.getHeadline(), profile.getAbout(), profile.getCity(), profile.getCountry(),
                user.getCreatedAt(),
                SkillMapper.ofType(skills, SkillType.TEACH),
                SkillMapper.ofType(skills, SkillType.LEARN),
                connection,
                contact);
    }
}
