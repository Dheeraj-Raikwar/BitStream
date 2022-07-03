package com.example.BitStream.models;

import javax.persistence.*;

@Entity
@Table(name="video")
public class Video {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	private String title;
	private String category;
	private String filename;
	
	public Video() {}
	
	public Video(long id, String title, String category,String filename) {		
		super();
		this.id=id;
		this.title=title;
		this.category=category;
		this.filename=filename;
	}	

	public String getTitle() {
		return title;
	}
	
	public void setTitile(String title) {
		this.title=title;
	}
	
	public String getCategory() {
		return category;
	}
	
	public void setCategory(String category) {
		this.category=category;
	}
	
	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}
	
	
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private UploadList uploadList;

	
	
}
