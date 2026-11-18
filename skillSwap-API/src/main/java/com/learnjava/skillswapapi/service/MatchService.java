package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.match.MatchResponse;
import com.learnjava.skillswapapi.dto.match.MatchesResponse;
import com.learnjava.skillswapapi.dto.member.ConnectionInfo;
import com.learnjava.skillswapapi.entity.LearningMode;
import com.learnjava.skillswapapi.entity.Profile;
import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.SkillType;
import com.learnjava.skillswapapi.entity.User;
import com.learnjava.skillswapapi.entity.UserSkill;
import com.learnjava.skillswapapi.mapper.SkillMapper;
import com.learnjava.skillswapapi.repository.ProfileRepository;
import com.learnjava.skillswapapi.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Finds members whose skills complement the viewer's:
 * they teach something the viewer wants to learn, and/or want to learn something the viewer teaches.
 */
@Service
@RequiredArgsConstructor
public class MatchService {

    private final UserSkillRepository userSkillRepository;
    private final ProfileRepository profileRepository;
    private final ConnectionService connectionService;

    /**
     * @param mode optional: only keep listings that can happen this way (BOTH listings always qualify)
     * @param city optional: only keep members whose listing or profile city contains this text
     */
    @Transactional(readOnly = true)
    public MatchesResponse findMatches(Long viewerId, LearningMode mode, String city) {
        List<UserSkill> mine = userSkillRepository.findAllByUserId(viewerId);
        Set<Long> wantToLearn = skillIds(mine, SkillType.LEARN);
        Set<Long> canTeach = skillIds(mine, SkillType.TEACH);

        Map<Long, List<UserSkill>> theyTeach = groupByUser(
                listingsOfOthers(SkillType.TEACH, wantToLearn, viewerId, mode));
        Map<Long, List<UserSkill>> theyLearn = groupByUser(
                listingsOfOthers(SkillType.LEARN, canTeach, viewerId, mode));

        Set<Long> candidateIds = new HashSet<>(theyTeach.keySet());
        candidateIds.addAll(theyLearn.keySet());

        // Members who have not finished onboarding are not shown anywhere
        Map<Long, Profile> profiles = candidateIds.isEmpty() ? Map.of()
                : profileRepository.findByUserIdIn(candidateIds).stream()
                .collect(Collectors.toMap(Profile::getUserId, Function.identity()));
        Map<Long, ConnectionInfo> connections = connectionService.connectionsWith(viewerId, profiles.keySet());
        String cityFilter = city == null || city.isBlank() ? null : city.trim().toLowerCase(Locale.ROOT);

        List<MatchResponse> mutual = new ArrayList<>();
        List<MatchResponse> teachOnly = new ArrayList<>();
        List<MatchResponse> learnOnly = new ArrayList<>();

        for (Profile profile : profiles.values()) {
            Long id = profile.getUserId();
            List<UserSkill> teaches = inCity(theyTeach.getOrDefault(id, List.of()), profile, cityFilter);
            List<UserSkill> learns = inCity(theyLearn.getOrDefault(id, List.of()), profile, cityFilter);
            if (teaches.isEmpty() && learns.isEmpty()) {
                continue;
            }
            MatchResponse match = toMatch(profile, teaches, learns,
                    connections.getOrDefault(id, ConnectionInfo.NONE));
            if (!teaches.isEmpty() && !learns.isEmpty()) {
                mutual.add(match);
            } else if (!teaches.isEmpty()) {
                teachOnly.add(match);
            } else {
                learnOnly.add(match);
            }
        }

        Comparator<MatchResponse> strongestFirst = Comparator
                .comparingInt((MatchResponse m) -> m.canTeachYou().size() + m.wantsToLearn().size())
                .reversed()
                .thenComparing(MatchResponse::firstName, String.CASE_INSENSITIVE_ORDER);
        mutual.sort(strongestFirst);
        teachOnly.sort(strongestFirst);
        learnOnly.sort(strongestFirst);

        return new MatchesResponse(mutual, teachOnly, learnOnly, !canTeach.isEmpty(), !wantToLearn.isEmpty());
    }

    private List<UserSkill> listingsOfOthers(SkillType type, Set<Long> skillIds, Long viewerId, LearningMode mode) {
        if (skillIds.isEmpty()) {
            return List.of();
        }
        return userSkillRepository.findListingsOfOthers(type, skillIds, viewerId, Role.USER).stream()
                .filter(us -> fitsMode(us.getMode(), mode))
                .toList();
    }

    private static boolean fitsMode(LearningMode listingMode, LearningMode wanted) {
        return wanted == null || wanted == LearningMode.BOTH
                || listingMode == LearningMode.BOTH || listingMode == wanted;
    }

    private static List<UserSkill> inCity(List<UserSkill> listings, Profile profile, String cityFilter) {
        if (cityFilter == null) {
            return listings;
        }
        boolean profileCityMatches = contains(profile.getCity(), cityFilter);
        return listings.stream()
                .filter(us -> profileCityMatches || contains(us.getCity(), cityFilter))
                .toList();
    }

    private static boolean contains(String value, String lowerNeedle) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(lowerNeedle);
    }

    private static Set<Long> skillIds(List<UserSkill> listings, SkillType type) {
        return listings.stream()
                .filter(us -> us.getType() == type)
                .map(us -> us.getSkill().getId())
                .collect(Collectors.toSet());
    }

    private static Map<Long, List<UserSkill>> groupByUser(List<UserSkill> listings) {
        return listings.stream().collect(Collectors.groupingBy(us -> us.getUser().getId()));
    }

    private static MatchResponse toMatch(Profile profile, List<UserSkill> teaches, List<UserSkill> learns,
                                         ConnectionInfo connection) {
        User user = profile.getUser();
        return new MatchResponse(
                user.getId(), user.getFirstName(), user.getLastName(),
                profile.getHeadline(), profile.getCity(), profile.getCountry(),
                teaches.stream().map(SkillMapper::toResponse).toList(),
                learns.stream().map(SkillMapper::toResponse).toList(),
                connection);
    }
}
