package com.example.BitStream.serviceImp;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.BitStream.models.UploadList;
import com.example.BitStream.models.UserList;
import com.example.BitStream.models.Video;
import com.example.BitStream.repository.UploadListRepository;
import com.example.BitStream.repository.UserListRepository;
import com.example.BitStream.repository.UserRepository;
import com.example.BitStream.repository.VideoRepository;
import com.example.BitStream.service.UploadListService;
import com.example.BitStream.service.UserListService;
import com.example.BitStream.service.VideoService;

@Service
public class VideoServiceImpl implements VideoService{
	
	
	private final VideoRepository videoRepository;	
	private final UserListRepository userListRepository;
	private final UploadListRepository uploadListRepository;
	

	public VideoServiceImpl(VideoRepository videoRepository, UserListRepository userListRepository,
			UploadListRepository uploadListRepository) {
		super();
		this.videoRepository = videoRepository;
		this.userListRepository = userListRepository;
		this.uploadListRepository = uploadListRepository;
	}

	@Override
	public Optional<Video> findById(Long id) {
	
		return videoRepository.findById(id);
	}

	@Override
	public List<Video> findAll() {
		
		return videoRepository.findAll();
	}

	@Override
	public List<Video> findbyuser(Long id) {
		
		long userListid = userListRepository.findByUserId(id);
		List<Long> video_ids =  uploadListRepository.findVideoUserListId(userListid);
		List<Video> video_list= new ArrayList<Video>();
		
		for(Long ids:video_ids) {
			Optional<Video> video  = videoRepository.findById(ids);
			video.ifPresent(videos -> {
				video_list.add(videos);    
			});
			
		}
		return video_list;
	}

	@Override
	public List<Video> filter(String category) {
		
		return videoRepository.findByCategory(category);
	}

	@Override
	public void saveById(Video video, Long userId, Long randomId) {
		
		videoRepository.saveWithId(randomId,video.getTitle(),video.getCategory(),video.getFilename());
		
		long ui = userListRepository.findByUserId(userId); //user_list id
		
		uploadListRepository.addNew(ui,randomId);
		
		
	}


}
