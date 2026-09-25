package com.movemate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EntityScan(basePackages = "com.movemate")
@EnableJpaRepositories(basePackages = "com.movemate")
public class MoveMateApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoveMateApplication.class, args);
    }
}
