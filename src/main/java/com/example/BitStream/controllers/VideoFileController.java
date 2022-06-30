package com.example.BitStream.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.stream.Collectors;
import org.apache.commons.io.IOUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.BitStream.controllers.VideoFileController;
import com.example.BitStream.FileHandling.StorageFileNotFoundException;
import com.example.BitStream.FileHandling.StorageService;


@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/videoFile")
public class VideoFileController {
	
	private final StorageService storageService;

	@Autowired
	public VideoFileController(StorageService storageService) {
		this.storageService = storageService;
	}

	@GetMapping("/getupload")
	public String listUploadedFiles(Model model) throws IOException {

		model.addAttribute("files", storageService.loadAll().map(
				path -> MvcUriComponentsBuilder.fromMethodName(VideoFileController.class,
						"serveFile", path.getFileName().toString()).build().toUri().toString())
				.collect(Collectors.toList()));

		return "uploadForm";
	}

	@GetMapping("/files/{filename:.+}")
	@ResponseBody
	public <Option>MultipartFile serveFile(@PathVariable String filename) throws IOException {

		Resource file = storageService.loadAsResource(filename);
		
		MultipartFile multipartFile = new MockMultipartFile("file",
		            file.getFilename(), "image/jpeg, image/jpg, image/png, image/gif", IOUtils.toByteArray(file.getInputStream()));
		
		
		/*
		File file = new File("src/test/resources/input.txt");
		FileInputStream input = new FileInputStream(file);
		MultipartFile multipartFile = new MockMultipartFile("file",
		            file.getName(), "text/plain", IOUtils.toByteArray(input));*/
		
		return multipartFile;
	}

	@PostMapping("/upload")
	public String handleFileUpload(@RequestParam("file") MultipartFile file,
			RedirectAttributes redirectAttributes) {

		storageService.store(file);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");

		return "redirect:/";
	}

	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}

	
	

}
