package com.learnjava.skillswapapi.service;

import com.learnjava.skillswapapi.dto.member.ConnectionInfo;
import com.learnjava.skillswapapi.dto.member.ConnectionStatus;
import com.learnjava.skillswapapi.entity.ExchangeRequest;
import com.learnjava.skillswapapi.entity.RequestStatus;
import com.learnjava.skillswapapi.repository.ExchangeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Works out how the viewer relates to other members (request sent, received, connected). */
@Service
@RequiredArgsConstructor
public class ConnectionService {

    private static final List<RequestStatus> OPEN_OR_ACCEPTED = List.of(RequestStatus.PENDING, RequestStatus.ACCEPTED);

    private final ExchangeRequestRepository requestRepository;

    @Transactional(readOnly = true)
    public Map<Long, ConnectionInfo> connectionsWith(Long viewerId, Collection<Long> otherIds) {
        if (otherIds.isEmpty()) {
            return Map.of();
        }
        Map<Long, ConnectionInfo> result = new HashMap<>();
        for (ExchangeRequest request : requestRepository.findBetween(viewerId, otherIds, OPEN_OR_ACCEPTED)) {
            boolean sentByViewer = request.getSender().getId().equals(viewerId);
            Long otherId = sentByViewer ? request.getRecipient().getId() : request.getSender().getId();
            ConnectionInfo info = toInfo(request, sentByViewer);
            // An accepted request outranks a pending one
            result.merge(otherId, info, (current, candidate) ->
                    current.status() == ConnectionStatus.CONNECTED ? current : candidate);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public ConnectionInfo connectionWith(Long viewerId, Long otherId) {
        return connectionsWith(viewerId, List.of(otherId)).getOrDefault(otherId, ConnectionInfo.NONE);
    }

    private static ConnectionInfo toInfo(ExchangeRequest request, boolean sentByViewer) {
        if (request.getStatus() == RequestStatus.ACCEPTED) {
            return new ConnectionInfo(ConnectionStatus.CONNECTED, request.getId());
        }
        return new ConnectionInfo(
                sentByViewer ? ConnectionStatus.REQUEST_SENT : ConnectionStatus.REQUEST_RECEIVED,
                request.getId());
    }
}
