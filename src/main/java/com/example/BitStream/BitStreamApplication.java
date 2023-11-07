package com.example.BitStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@SpringBootApplication
public class BitStreamApplication {
	
	private static final Logger logger = LoggerFactory.getLogger(BitStreamApplication.class);

	public static void main(String[] args) {
		try {
		SpringApplication.run(BitStreamApplication.class, args);
		}
		catch(Exception e){
//			logger.info("This is an informational message.");
	        logger.error("This is an exception message.",e);
		}
		
	}

}
