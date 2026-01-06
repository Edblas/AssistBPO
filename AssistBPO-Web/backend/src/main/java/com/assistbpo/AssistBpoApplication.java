package com.assistbpo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AssistBpoApplication {
    public static void main(String[] args) {
        SpringApplication.run(AssistBpoApplication.class, args);
    }
}
