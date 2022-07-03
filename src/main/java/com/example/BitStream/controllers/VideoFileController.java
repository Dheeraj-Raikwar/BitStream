package com.example.BitStream.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import com.example.BitStream.models.FileData;
import com.example.BitStream.models.UploadResponseMessage;
import com.example.BitStream.models.Video;
import com.example.BitStream.repository.UserRepository;
import com.example.BitStream.security.services.UserDetailsImpl;
import com.example.BitStream.service.UploadListService;
import com.example.BitStream.service.UserListService;
import com.example.BitStream.service.VideoService;
import com.example.BitStream.serviceImp.FileService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/upload")
public class VideoFileController {
			
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserListService userListService;
	
	@Autowired
	UploadListService uploadListService;
	
	@Autowired
	private VideoService videoService;

	private final FileService fileService;
	
	
	private final static Logger log = LoggerFactory.getLogger(VideoFileController.class);

    @Autowired
    public VideoFileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping
    public ResponseEntity<UploadResponseMessage> uploadFile(@AuthenticationPrincipal UserDetailsImpl user, @RequestParam("file") MultipartFile file) {
        
    	long userId = user.getId();    	
    	long randomId = generateId();
    	boolean safe=true;
    	
    	try {
        	// Write file in local storage
            fileService.save(file,Long.toString(randomId));

            return ResponseEntity.status(HttpStatus.OK)
                                 .body(new UploadResponseMessage("Uploaded the file successfully: " + file.getOriginalFilename()));
        } catch (Exception e) {
        	safe=false;
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                                 .body(new UploadResponseMessage("Could not upload the file: " + file.getOriginalFilename() + "!"));
        }
    	finally{
    		
    		// Update in DB if safe 
    		if(safe) {
    			
    			Video newVideo = new Video(randomId,"title","category",file.getOriginalFilename());            	
            	videoService.saveById(newVideo,userId,randomId);
            	
    		}
    			
    	}
    	
    }    
    
    @GetMapping
    public ResponseEntity<List<Video>> getListFiles() {
        List<FileData> fileInfos = fileService.loadAll()
                                              .stream()
                                              .map(this::pathToFileData)
                                              .collect(Collectors.toList());
        
        List<Video> videolist = new ArrayList<Video>();
        
        for(FileData file:fileInfos) {
        	
        	Optional<Video> video  = videoService.findById(Long.parseLong(file.getFilename()));
			video.ifPresent(videos -> {
				videolist.add(videos);    
			});
    
        }        

        return ResponseEntity.status(HttpStatus.OK)
                             .body(videolist);
    }

    @DeleteMapping
    public void delete() {
        fileService.deleteAll();
    }

    private FileData pathToFileData(Path path) {
        FileData fileData = new FileData();
        String filename = path.getFileName()
                              .toString();
        fileData.setFilename(filename);
        fileData.setUrl(MvcUriComponentsBuilder.fromMethodName(VideoFileController.class, "getFile", filename)
                                               .build()
                                               .toString());
        try {
            fileData.setSize(Files.size(path));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        }

        return fileData;
    }

    @GetMapping("{filename:.+}")
    @ResponseBody
    public ResponseEntity<String> getFile(@PathVariable String filename) throws IOException {
        Resource file = fileService.load(filename);
        
        byte[] arr =IOUtils.toByteArray(file.getInputStream());
        String encodedString = Base64
		          .getEncoder()
		          .encodeToString(arr);
        
        return ResponseEntity.ok()
                             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                             .body(encodedString);
    }
    
    
    
    /*Generate random id for storing videos*/
     
    public long generateId() {
    	
    	Date dNow = new Date();    	
        SimpleDateFormat ft = new SimpleDateFormat("yyMMddhhmmssMs");
        String datetime = ft.format(dNow);               
                
        return Long.parseLong(datetime)+9L + (long)(Math.random()*(9L - 1L));

      }
    
    

}
