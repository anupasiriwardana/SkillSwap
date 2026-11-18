package com.learnjava.skillswapapi;

import com.learnjava.skillswapapi.dto.match.MatchesResponse;
import com.learnjava.skillswapapi.entity.*;
import com.learnjava.skillswapapi.repository.ProfileRepository;
import com.learnjava.skillswapapi.repository.UserSkillRepository;
import com.learnjava.skillswapapi.service.ConnectionService;
import com.learnjava.skillswapapi.service.MatchService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/** Covers the matching rules, which is where a silent bug would hurt most. */
class SkillSwapApiApplicationTests {

    private final UserSkillRepository userSkills = mock(UserSkillRepository.class);
    private final ProfileRepository profiles = mock(ProfileRepository.class);
    private final ConnectionService connections = mock(ConnectionService.class);
    private final MatchService matchService = new MatchService(userSkills, profiles, connections);

    private final Skill guitar = skill(1L, "Guitar");
    private final Skill maths = skill(2L, "Mathematics");
    private final Skill spanish = skill(3L, "Spanish");

    private final User me = user(10L, "Ann");
    private final User mutual = user(20L, "Ben");
    private final User teacherOnly = user(30L, "Cara");

    @Test
    void groupsMembersIntoMutualAndOneWayMatches() {
        // I teach guitar and want to learn maths and Spanish
        when(userSkills.findAllByUserId(10L)).thenReturn(List.of(
                listing(me, guitar, SkillType.TEACH, LearningMode.ONLINE),
                listing(me, maths, SkillType.LEARN, LearningMode.ONLINE),
                listing(me, spanish, SkillType.LEARN, LearningMode.ONLINE)));
        // Ben teaches maths and wants guitar (mutual); Cara teaches Spanish only (one-way)
        when(userSkills.findListingsOfOthers(eq(SkillType.TEACH), anyCollection(), eq(10L), eq(Role.USER)))
                .thenReturn(List.of(
                        listing(mutual, maths, SkillType.TEACH, LearningMode.BOTH),
                        listing(teacherOnly, spanish, SkillType.TEACH, LearningMode.IN_PERSON)));
        when(userSkills.findListingsOfOthers(eq(SkillType.LEARN), anyCollection(), eq(10L), eq(Role.USER)))
                .thenReturn(List.of(listing(mutual, guitar, SkillType.LEARN, LearningMode.ONLINE)));
        when(profiles.findByUserIdIn(anyCollection())).thenReturn(List.of(profile(mutual), profile(teacherOnly)));
        when(connections.connectionsWith(anyLong(), anyCollection())).thenReturn(Map.of());

        MatchesResponse all = matchService.findMatches(10L, null, null);
        assertThat(all.mutual()).extracting("firstName").containsExactly("Ben");
        assertThat(all.canTeachYou()).extracting("firstName").containsExactly("Cara");
        assertThat(all.wantToLearn()).isEmpty();

        // Filtering to online drops Cara's in-person-only listing
        MatchesResponse online = matchService.findMatches(10L, LearningMode.ONLINE, null);
        assertThat(online.mutual()).hasSize(1);
        assertThat(online.canTeachYou()).isEmpty();
    }

    private static Skill skill(Long id, String name) {
        return Skill.builder().id(id).name(name).normalizedName(Skill.normalize(name)).build();
    }

    private static User user(Long id, String firstName) {
        return User.builder().id(id).firstName(firstName).lastName("Test").role(Role.USER).build();
    }

    private static Profile profile(User user) {
        return Profile.builder().userId(user.getId()).user(user).city("Colombo").build();
    }

    private static UserSkill listing(User user, Skill skill, SkillType type, LearningMode mode) {
        return UserSkill.builder().user(user).skill(skill).type(type)
                .level(ProficiencyLevel.INTERMEDIATE).mode(mode).build();
    }
}
