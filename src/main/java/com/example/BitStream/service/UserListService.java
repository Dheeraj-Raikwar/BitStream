package com.example.BitStream.service;

import com.example.BitStream.models.UserList;

public interface UserListService {
	
	UserList getOne(Long id);
	
	long findByUserId(Long id);
	
	boolean existsByUser(Long id);
	
	
}
