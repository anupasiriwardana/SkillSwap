package com.learnjava.skillswapapi.dto.admin;

public record AdminStatsResponse(
        long members,
        long deactivatedMembers,
        long skills,
        long teachListings,
        long learnListings,
        long pendingRequests,
        long acceptedRequests) {
}
