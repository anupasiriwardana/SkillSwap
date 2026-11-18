package com.learnjava.skillswapapi.entity;

public enum LearningMode {
    ONLINE,
    IN_PERSON,
    BOTH;

    public boolean includesInPerson() {
        return this == IN_PERSON || this == BOTH;
    }
}
