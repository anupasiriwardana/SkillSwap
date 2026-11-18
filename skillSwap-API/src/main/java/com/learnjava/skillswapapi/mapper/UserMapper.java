package com.learnjava.skillswapapi.mapper;

import com.learnjava.skillswapapi.dto.admin.AdminUserResponse;
import com.learnjava.skillswapapi.dto.auth.CurrentUserResponse;
import com.learnjava.skillswapapi.dto.member.ContactInfo;
import com.learnjava.skillswapapi.dto.profile.MyProfileResponse;
import com.learnjava.skillswapapi.dto.request.MemberRef;
import com.learnjava.skillswapapi.entity.Profile;
import com.learnjava.skillswapapi.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static CurrentUserResponse toCurrentUser(User user, boolean profileCompleted, long pendingIncoming) {
        return new CurrentUserResponse(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(),
                user.getRole(), profileCompleted, pendingIncoming);
    }

    /** {@code profile} may be null when the member has not finished onboarding. */
    public static MyProfileResponse toMyProfile(User user, Profile profile) {
        return new MyProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                profile == null ? null : profile.getHeadline(),
                profile == null ? null : profile.getAbout(),
                profile == null ? null : profile.getPhone(),
                profile == null ? null : profile.getCountry(),
                profile == null ? null : profile.getCity(),
                profile == null ? null : profile.getAddress(),
                user.getCreatedAt());
    }

    public static ContactInfo toContact(User user, Profile profile) {
        return new ContactInfo(user.getEmail(),
                profile == null ? null : profile.getPhone(),
                profile == null ? null : profile.getAddress());
    }

    public static MemberRef toRef(User user) {
        return new MemberRef(user.getId(), user.getFirstName(), user.getLastName());
    }

    public static AdminUserResponse toAdminUser(User user) {
        return new AdminUserResponse(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(),
                user.getRole(), user.isActive(), user.getCreatedAt());
    }
}
