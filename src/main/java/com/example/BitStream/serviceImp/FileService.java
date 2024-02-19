package com.example.BitStream.serviceImp;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;

import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.BitStream.controllers.UserController;
import com.example.BitStream.repository.VideoRepository;

@Service
public class FileService {

	@Value("${upload.path}")
	private String uploadPath;

	@PostConstruct
	public void init() {
		try {
			Files.createDirectories(Paths.get(uploadPath));
		} catch (IOException e) {
			throw new RuntimeException("Could not create upload folder!");
		}
	}

	public void save(MultipartFile file, String filename) {

		boolean issafe = true;
		String original = file.getOriginalFilename();
		int start = file.getOriginalFilename().lastIndexOf(".");
		String extension = original.substring(start);

		try {
			Path root = Paths.get(uploadPath);
			if (!Files.exists(root)) {
				init();
			}

			Files.copy(file.getInputStream(), root.resolve(filename + extension));

		} catch (Exception e) {
			issafe = false;
			throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
		}

		finally {

			/* Generate thumb-nail for video */
			if (issafe) {
				Path path = Paths.get(uploadPath).resolve(filename);
				FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber(uploadPath +"\\" +filename + extension);

				try {
					frameGrabber.start();
				} catch (org.bytedeco.javacv.FFmpegFrameGrabber.Exception e1) {
					e1.printStackTrace();
				}

				Java2DFrameConverter aa = new Java2DFrameConverter();

				try {
					BufferedImage bi;

					// for (int i = 0; i < 1000; i++) {
					Frame f = frameGrabber.grabKeyFrame();

					bi = aa.convert(f);
					while (bi != null) {

						ImageIO.write(bi, "png", new File(uploadPath +"\\"+ filename + ".png"));

						f = frameGrabber.grabKeyFrame();
						bi = aa.convert(f);
					}
					frameGrabber.stop();
				} catch (Exception e) {

					e.printStackTrace();
				}

			}

		}

	}

	public Resource load(String filename) {
		try {
			Path file = Paths.get(uploadPath).resolve(filename);
			Resource resource = new UrlResource(file.toUri());

			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new RuntimeException("Could not read the file!");
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Error: " + e.getMessage());
		}
	}

	public void deleteAll() {
		FileSystemUtils.deleteRecursively(Paths.get(uploadPath).toFile());
	}

	public List<Path> loadAll() {
		try {
			Path root = Paths.get(uploadPath);
			if (Files.exists(root)) {
				return Files.walk(root, 1).filter(path -> !path.equals(root)).collect(Collectors.toList());
			}

			return Collections.emptyList();
		} catch (IOException e) {
			throw new RuntimeException("Could not list the files!");
		}
	}
	
	public List<Path> search(Optional<String> fn) {
		
		try {
			
			Path root = Paths.get(uploadPath);
			if (Files.exists(root)) {
				return Files.walk(root, 1)
						.filter(path -> Files.isRegularFile(path)) // Filter only regular files
						.filter(path -> fn.stream().anyMatch(fileName -> path.getFileName().toString().contains(fileName))) // Filter by file names in the list
	                    .collect(Collectors.toList());
			}

			return Collections.emptyList();
		} catch (IOException e) {
			throw new RuntimeException("Could not list the files!");
		}
	}
}
