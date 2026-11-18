package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.admin.AdminSkillResponse;
import com.learnjava.skillswapapi.dto.admin.AdminStatsResponse;
import com.learnjava.skillswapapi.dto.admin.AdminUserResponse;
import com.learnjava.skillswapapi.dto.common.PageResponse;
import com.learnjava.skillswapapi.entity.RequestStatus;
import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.Skill;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.exception.BadRequestException;
import com.learnjava.skillswapapi.exception.NotFoundException;
import com.learnjava.skillswapapi.mapper.UserMapper;
import com.learnjava.skillswapapi.repository.ExchangeRequestRepository;
import com.learnjava.skillswapapi.repository.SkillRepository;
import com.learnjava.skillswapapi.repository.UserRepository;
import com.learnjava.skillswapapi.repository.UserSkillRepository;
import com.learnjava.skillswapapi.service.support.Queries;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final ExchangeRequestRepository requestRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse stats() {
        return new AdminStatsResponse(
                userRepository.countByRole(Role.USER),
                userRepository.countByRoleAndActiveFalse(Role.USER),
                skillRepository.count(),
                userSkillRepository.countByType(SkillType.TEACH),
                userSkillRepository.countByType(SkillType.LEARN),
                requestRepository.countByStatus(RequestStatus.PENDING),
                requestRepository.countByStatus(RequestStatus.ACCEPTED));
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> users(String query, int page, int size) {
        return PageResponse.of(
                userRepository.search(Queries.containsPattern(query),
                        Queries.page(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))),
                UserMapper::toAdminUser);
    }

    @Transactional
    public AdminUserResponse setActive(Long adminId, Long userId, boolean active) {
        if (adminId.equals(userId)) {
            throw new BadRequestException("You can't change the status of your own account.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found."));
        user.setActive(active);
        return UserMapper.toAdminUser(user);
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminSkillResponse> skills(String query, int page, int size) {
        return PageResponse.of(
                skillRepository.searchWithUsage(Queries.containsPattern(query), SkillType.TEACH, SkillType.LEARN,
                        Queries.page(page, size, Sort.unsorted())),
                view -> new AdminSkillResponse(view.getId(), view.getName(),
                        view.getTeachCount(), view.getLearnCount(), view.getCreatedAt()));
    }

    /** Folds a duplicate skill (e.g. "Guitar lessons") into another (e.g. "Guitar"). */
    @Transactional
    public void mergeSkill(Long sourceId, Long targetId) {
        if (sourceId.equals(targetId)) {
            throw new BadRequestException("Choose a different skill to merge into.");
        }
        Skill target = skillRepository.findById(targetId)
                .orElseThrow(() -> new NotFoundException("Target skill not found."));
        if (!skillRepository.existsById(sourceId)) {
            throw new NotFoundException("Skill not found.");
        }
        userSkillRepository.deleteDuplicatesForMerge(sourceId, targetId);
        userSkillRepository.reassignSkill(sourceId, target);
        requestRepository.reassignRequestedSkill(sourceId, target);
        requestRepository.reassignOfferedSkill(sourceId, target);
        skillRepository.deleteById(sourceId);
    }

    /** Deletes a skill along with every listing of it (the database cascades the listings). */
    @Transactional
    public void deleteSkill(Long skillId) {
        if (!skillRepository.existsById(skillId)) {
            throw new NotFoundException("Skill not found.");
        }
        skillRepository.deleteById(skillId);
    }
}
