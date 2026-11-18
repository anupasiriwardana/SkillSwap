package com.learnjava.skillswapapi.service.support;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Locale;

/** Small helpers for building search patterns and safe page requests. */
public final class Queries {

    public static final int MAX_PAGE_SIZE = 50;

    private Queries() {
    }

    /** Lower-cased "contains" LIKE pattern, or an empty string meaning "no filter". */
    public static String containsPattern(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        String escaped = value.trim().toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return "%" + escaped + "%";
    }

    public static Pageable page(int page, int size, Sort sort) {
        return PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, MAX_PAGE_SIZE), sort);
    }

    public static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
