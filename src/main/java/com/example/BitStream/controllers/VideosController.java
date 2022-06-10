package com.example.BitStream.controllers;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.BitStream.models.Video;
import com.example.BitStream.repository.VideoRepository;


@RestController
@RequestMapping("/api")
public class VideosController {
	
	@Autowired
	private VideoRepository repository;
	
	
	@GetMapping("/videos")
    public ResponseEntity<?> getAllUsers() {
        List<Video> video = repository.findAll();

        return new ResponseEntity<>(video, HttpStatus.OK);
    }

}
