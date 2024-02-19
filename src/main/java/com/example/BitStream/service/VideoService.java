package com.example.BitStream.service;

import java.util.List;
import java.util.Optional;

import com.example.BitStream.models.Video;


public interface VideoService {
	
	Optional<Video> findById(Long id);

    List<Video> findAll();
    
    List<Video> findbyuser(Long id);
   
    Optional<String> searchIdsByTitle(String title);
    
    List<Video> filter(String category);

    void saveById(Video video, Long userId, Long randomId);

}
