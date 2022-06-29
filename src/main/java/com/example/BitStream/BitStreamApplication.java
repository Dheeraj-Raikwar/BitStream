package com.example.BitStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import com.example.BitStream.FileHandling.StorageService;
import com.example.BitStream.FileHandling.StorageProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class BitStreamApplication {

	public static void main(String[] args) {
		SpringApplication.run(BitStreamApplication.class, args);
	}
	
	@Bean
	CommandLineRunner init(StorageService storageService) {
		return (args) -> {
			storageService.deleteAll();
			storageService.init();
		};
	}

}
