package com.example.BitStream.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
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
@Table(name="user_list")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserList {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name = "id")
	private Long id;
	

	@OneToMany(cascade = CascadeType.ALL, mappedBy="userList")
	 private List<UploadList> uploadlist;
	 //Getter and setter
	 public List<UploadList> getUploadList() {
	 return uploadlist;
	 }
	 public void setCars(List<UploadList> uploadlist) {
	 this.uploadlist = uploadlist;
	 }
	 
	 @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id")
	    private User user;
	

}
