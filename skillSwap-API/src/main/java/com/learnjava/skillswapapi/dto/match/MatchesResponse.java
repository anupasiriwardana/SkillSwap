package com.learnjava.skillswapapi.dto.match;

import java.util.List;

/**
 * @param mutual          they teach something you want to learn, and want to learn something you teach
 * @param canTeachYou     they only teach something you want to learn
 * @param wantToLearn     they only want to learn something you teach
 * @param hasTeachSkills  whether the viewer has listed anything to teach (for empty states)
 * @param hasLearnSkills  whether the viewer has listed anything to learn (for empty states)
 */
public record MatchesResponse(
        List<MatchResponse> mutual,
        List<MatchResponse> canTeachYou,
        List<MatchResponse> wantToLearn,
        boolean hasTeachSkills,
        boolean hasLearnSkills) {
}
