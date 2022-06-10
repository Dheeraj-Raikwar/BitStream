package com.example.BitStream.serviceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.BitStream.models.UserList;
import com.example.BitStream.repository.UserListRepository;
import com.example.BitStream.repository.UserRepository;
import com.example.BitStream.service.UserListService;


@Service
public class UserListServiceImpl implements UserListService{
	
	 
	private final UserListRepository userListRepository;
	
	private final UserRepository userRepository;
	
	
	@Autowired
    public UserListServiceImpl(UserListRepository userListRepository, UserRepository userRepository) {
        this.userListRepository = userListRepository;
        this.userRepository = userRepository;
    }

	@Override
	public UserList getOne(Long id) {
		return userListRepository.getById(id);
	}


	@Override
	public long findByUserId(Long id) {
		return userListRepository.findByUserId(id);
	}

	@Override
	public boolean existsByUser(Long id) {
		
		return userListRepository.existsByUser(id);
	}


}
