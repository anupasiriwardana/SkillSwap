package com.learnjava.skillswapapi.dto.member;

public record ConnectionInfo(ConnectionStatus status, Long requestId) {

    public static final ConnectionInfo NONE = new ConnectionInfo(ConnectionStatus.NONE, null);
}
