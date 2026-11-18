package com.learnjava.skillswapapi.dto.member;

/** Relationship between the viewer and another member, derived from their requests. */
public enum ConnectionStatus {
    NONE,
    REQUEST_SENT,
    REQUEST_RECEIVED,
    CONNECTED
}
