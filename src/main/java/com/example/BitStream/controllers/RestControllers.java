package com.example.BitStream.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.BitStream.models.Video;
import com.example.BitStream.repository.RoleRepository;
import com.example.BitStream.repository.UploadListRepository;
import com.example.BitStream.repository.UserListRepository;
import com.example.BitStream.repository.UserRepository;
import com.example.BitStream.security.services.UserDetailsImpl;
import com.example.BitStream.service.UploadListService;
import com.example.BitStream.service.UserListService;
import com.example.BitStream.service.VideoService;
import com.example.BitStream.serviceImp.VideoServiceImpl;

@RestController
@RequestMapping("/api/rest")
public class RestControllers {
	
	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;
	
	@Autowired
	UserListService userListService;
	
	@Autowired
	UploadListService uploadListService;
	
	@Autowired
	private VideoService videoService;

	@GetMapping("/user/uploadlist")
    public ResponseEntity<?> getuploadlist(@AuthenticationPrincipal UserDetailsImpl user) {
	
		long userId = user.getId();
	/*	UserListServiceImpl userListServiceImpl = 
		long isUserlist = userListService.findByUserId(userId);
			//return new ResponseEntity<>(isUserlist, HttpStatus.OK);
		
		long userListId= userListRepository.findByUserId(userId);
		boolean isUploadlist = uploadListRepository.existsByUserList(userListId);		
		if(!isUploadlist)
			return new ResponseEntity<>(isUploadlist, HttpStatus.OK);*/
		
		List<Video> videos = new ArrayList<Video>();
       try {
		videos = videoService.findbyuser(userId);
        return new ResponseEntity<>(videos, HttpStatus.OK);
       }
       catch(Exception e){
    	   return new ResponseEntity<>("No Videos Found.", HttpStatus.OK);
       }
    }

}
