package com.learnjava.skillswapapi.security;

import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/** The signed-in user as seen by Spring Security. Inject with {@code @AuthenticationPrincipal}. */
public record AuthenticatedUser(Long id, String email, String passwordHash, Role role, boolean active)
        implements UserDetails {

    public static AuthenticatedUser from(User user) {
        return new AuthenticatedUser(user.getId(), user.getEmail(), user.getPasswordHash(),
                user.getRole(), user.isActive());
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
