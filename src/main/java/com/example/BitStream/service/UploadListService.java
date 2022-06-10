package com.example.BitStream.service;

import java.util.List;

import com.example.BitStream.models.UploadList;
import com.example.BitStream.models.Video;

public interface UploadListService {
	
	UploadList getOne(Long id);
	
	List<Long> findVideoUserListId(Long id);

}
