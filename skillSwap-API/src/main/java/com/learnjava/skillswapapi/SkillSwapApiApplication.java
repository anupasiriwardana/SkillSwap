package com.learnjava.skillswapapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SkillSwapApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillSwapApiApplication.class, args);
    }
}
