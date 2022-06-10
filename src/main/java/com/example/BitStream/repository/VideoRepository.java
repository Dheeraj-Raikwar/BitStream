package com.example.BitStream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.BitStream.models.Video;
import java.util.List;
import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {
	
	//Fetch Video by video_id
	@Query(value ="select * from video where id= ?1",nativeQuery=true) 
	Optional<Video> findById(Long id);
	
	List<Video> findByTitle(String title);
	
	List<Video> findByCategory(String category);
	
	List<Video> findByFilename(String filename);

}
