package com.example.BitStream.models;

public class VideoFileDto {
	
	private long id;
	private String title;
	private String category;
	private String filename;
	private Long size;
	private String thumbnail;
	
	
	public VideoFileDto() {}


	public VideoFileDto(long id, String title, String category, String filename, Long size, String thumbnail) {
		super();
		this.id = id;
		this.title = title;
		this.category = category;
		this.filename = filename;
		this.size = size;
		this.thumbnail = thumbnail;
	}


	public long getId() {
		return id;
	}


	public void setId(long id) {
		this.id = id;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getCategory() {
		return category;
	}


	public void setCategory(String category) {
		this.category = category;
	}


	public String getFilename() {
		return filename;
	}


	public void setFilename(String filename) {
		this.filename = filename;
	}


	public Long getSize() {
		return size;
	}


	public void setSize(Long size) {
		this.size = size;
	}


	public String getThumbnail() {
		return thumbnail;
	}


	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}
	
	
	

}
