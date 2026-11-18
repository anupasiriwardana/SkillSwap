package com.learnjava.skillswapapi.controller;

import com.learnjava.skillswapapi.dto.request.CreateExchangeRequest;
import com.learnjava.skillswapapi.dto.request.ExchangeRequestResponse;
import com.learnjava.skillswapapi.security.AuthenticatedUser;
import com.learnjava.skillswapapi.service.ExchangeRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ExchangeRequestController {

    private final ExchangeRequestService requestService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExchangeRequestResponse send(@AuthenticationPrincipal AuthenticatedUser user,
                                       @Valid @RequestBody CreateExchangeRequest request) {
        return requestService.send(user.id(), request);
    }

    @GetMapping("/incoming")
    public List<ExchangeRequestResponse> incoming(@AuthenticationPrincipal AuthenticatedUser user) {
        return requestService.incoming(user.id());
    }

    @GetMapping("/outgoing")
    public List<ExchangeRequestResponse> outgoing(@AuthenticationPrincipal AuthenticatedUser user) {
        return requestService.outgoing(user.id());
    }

    @PostMapping("/{id}/accept")
    public ExchangeRequestResponse accept(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        return requestService.accept(user.id(), id);
    }

    @PostMapping("/{id}/decline")
    public ExchangeRequestResponse decline(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        return requestService.decline(user.id(), id);
    }

    @PostMapping("/{id}/cancel")
    public ExchangeRequestResponse cancel(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        return requestService.cancel(user.id(), id);
    }
}
