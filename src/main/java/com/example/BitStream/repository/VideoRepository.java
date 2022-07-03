package com.example.BitStream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.BitStream.models.Video;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

public interface VideoRepository extends JpaRepository<Video, Long> {
	
	//Fetch Video by video_id
	@Query(value ="select * from video where id= ?1",nativeQuery=true) 
	Optional<Video> findById(Long id);
	
	List<Video> findByTitle(String title);
	
	List<Video> findByCategory(String category);
	
	List<Video> findByFilename(String filename);
	
	// add new Video-id by user_list_id
	// Insert new Record
	@Modifying
	@Transactional
	@Query(value ="insert into video(id,title,category,filename) values(?1,?2,?3,?4)",nativeQuery=true)
	void saveWithId(Long randomId,String title, String category, String filename);

}
