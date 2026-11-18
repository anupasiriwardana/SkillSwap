package com.learnjava.skillswapapi.dto.member;

/** Only shared between members with an accepted request. */
public record ContactInfo(String email, String phone, String address) {
}
