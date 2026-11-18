package com.learnjava.skillswapapi.dto.match;

import com.learnjava.skillswapapi.dto.member.ConnectionInfo;
import com.learnjava.skillswapapi.dto.skill.UserSkillResponse;

import java.util.List;

/**
 * Another member who fits the viewer's skills.
 *
 * @param canTeachYou     their TEACH listings for skills the viewer wants to learn
 * @param wantsToLearn    their LEARN listings for skills the viewer teaches
 */
public record MatchResponse(
        Long id,
        String firstName,
        String lastName,
        String headline,
        String city,
        String country,
        List<UserSkillResponse> canTeachYou,
        List<UserSkillResponse> wantsToLearn,
        ConnectionInfo connection) {
}
