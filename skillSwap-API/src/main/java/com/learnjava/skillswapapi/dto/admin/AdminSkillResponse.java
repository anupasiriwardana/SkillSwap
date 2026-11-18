package com.learnjava.skillswapapi.dto.admin;

import java.time.Instant;

public record AdminSkillResponse(Long id, String name, long teachCount, long learnCount, Instant createdAt) {
}
