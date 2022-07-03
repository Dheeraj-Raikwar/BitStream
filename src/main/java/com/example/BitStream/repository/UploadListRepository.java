package com.example.BitStream.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.BitStream.models.UploadList;
import com.example.BitStream.models.Video;

public interface UploadListRepository extends JpaRepository<UploadList, Long> {
	
	// Fetch Video-id by user_list_id
	@Query(value ="select video_id from upload_list where user_list_id= ?1",nativeQuery=true) 
	List<Long> findVideoUserListId(Long id);
	
	Boolean existsByUserList(Long id);
	
	
	// add new Video-id by user_list_id
	// Insert new Record
	@Modifying
	@Transactional
	@Query(value ="insert into upload_list(user_list_id,video_id) values(?1,?2)",nativeQuery=true)
	void addNew(Long userlist, long videoid);
	
}
