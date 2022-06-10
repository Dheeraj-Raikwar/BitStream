package com.example.BitStream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.BitStream.models.UserList;

public interface UserListRepository extends JpaRepository<UserList, Long> {

	// Fetch user_list_id by user_id
	@Query(value ="select id from user_list where user_id= ?1",nativeQuery=true)
	long findByUserId(Long id);

	Boolean existsByUser(Long id);
	
	UserList getById(Long id);
	
}
