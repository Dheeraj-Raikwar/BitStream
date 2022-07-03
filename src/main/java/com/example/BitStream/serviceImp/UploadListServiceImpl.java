package com.example.BitStream.serviceImp;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BitStream.models.UploadList;
import com.example.BitStream.models.Video;
import com.example.BitStream.repository.UploadListRepository;
import com.example.BitStream.repository.UserListRepository;
import com.example.BitStream.repository.VideoRepository;
import com.example.BitStream.service.UploadListService;

@Service
public class UploadListServiceImpl implements UploadListService{
	
	
	
	private final UploadListRepository uploadListRepository;
	
	private final UserListRepository userListRepository;
	
	private final VideoRepository videoRepository;
	public UploadListServiceImpl(UploadListRepository uploadListRepository, UserListRepository userListRepository,
			VideoRepository videoRepository) {
		super();
		this.uploadListRepository = uploadListRepository;
		this.userListRepository = userListRepository;
		this.videoRepository = videoRepository;
	}

	@Override
	public UploadList getOne(Long id) {
	
		return uploadListRepository.getOne(id);
	}

	@Override
	public List<Long> findVideoUserListId(Long id) {
		
		return uploadListRepository.findVideoUserListId(id);
	}

	@Override
	public void addNew(Long userlist, long videoid) {
		
		uploadListRepository.addNew(userlist, videoid);
		
	}

}