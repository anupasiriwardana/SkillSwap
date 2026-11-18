package com.learnjava.skillswapapi.dto.admin;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(@NotNull Boolean active) {
}
