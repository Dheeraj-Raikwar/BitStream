package com.example.BitStream.models;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@SuppressWarnings("serial")
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="upload_list")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UploadList {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name = "upload_id")
	private Long id;
	

	public Long getId() {
		return id;
	}
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_list_id", nullable=false)
	private UserList userList;
	
	
	public UserList getUserList() {
		return userList;
	}
	public void setUserList(UserList userList) {
		this.userList = userList;
	}
	
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "video_id", referencedColumnName = "id")
    private Video video;

}
