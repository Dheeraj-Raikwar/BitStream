package com.example.BitStream.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.example.BitStream.controllers.UserController;
import com.example.BitStream.models.FileData;
import com.example.BitStream.models.UploadResponseMessage;
import com.example.BitStream.models.Video;
import com.example.BitStream.repository.UserRepository;
import com.example.BitStream.security.services.UserDetailsImpl;
import com.example.BitStream.service.UploadListService;
import com.example.BitStream.service.UserListService;
import com.example.BitStream.service.VideoService;
import com.example.BitStream.serviceImp.FileService;
import com.example.BitStream.models.VideoFileDto;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rest")
public class UserController {
			
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserListService userListService;
	
	@Autowired
	UploadListService uploadListService;
	
	@Autowired
	private VideoService videoService;

	private final FileService fileService;
	
	@Value("${upload.path}")
    private String uploadPath;
		
	private final static Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/user/upload")
	@PreAuthorize("hasRole('USER')")
    public ResponseEntity<UploadResponseMessage> uploadFile(@AuthenticationPrincipal UserDetailsImpl user, @RequestParam("file") MultipartFile file,
    		@RequestParam("title") String title,@RequestParam("category") String category) {
        
    	long userId = user.getId();    	
    	long randomId = generateId();
    	boolean safe=true;
    	
    	try {
        	// Write file in local storage
            fileService.save(file,Long.toString(randomId));

            return ResponseEntity.status(HttpStatus.OK)
                                 .body(new UploadResponseMessage("Uploaded the file successfully: " + file.getOriginalFilename()));
        } catch (Exception e) {
        	
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                                 .body(new UploadResponseMessage("Could not upload the file: " + file.getOriginalFilename() + "!"));
        }
    	
    		finally{
    		
    			// Update in DB if safe 
    			if(safe) {
    			
    			Video newVideo = new Video(randomId,title,category,file.getOriginalFilename());            	
            	videoService.saveById(newVideo,userId,randomId);
            	
    		}
    			
    	}
            	
    		
    			
    	}
    	    
    
    @GetMapping("/all")
    public ResponseEntity<List<VideoFileDto>> getListFiles() {
        List<FileData> fileInfos = fileService.loadAll()
                                              .stream()
                                              .map(this::pathToFileData)
                                              .collect(Collectors.toList());
        
        List<VideoFileDto> videolist = new ArrayList<VideoFileDto>();
        
        try {
        	
        for(FileData file:fileInfos) {
        	
        	String original = file.getFilename();
            int end = original.lastIndexOf(".");
            String name = original.substring(0,end);
            String ext = original.substring(end);
            
            if(ext.equals(".mp4")) {
            Resource rf =fileService.load(name+".png");
            byte[] arr =IOUtils.toByteArray(rf.getInputStream());
            String thumbnail = Base64
    		          .getEncoder()
    		          .encodeToString(arr);
        	
        	Optional<Video> video  = videoService.findById(Long.parseLong(name)); //name in storage is id in Db
			video.ifPresent(videos -> {
				videolist.add(new VideoFileDto(videos.getId(),videos.getTitle(),videos.getCategory(),videos.getFilename(),
						file.getSize(),thumbnail));
			});
    
        }
        }
        
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                                 .body(videolist);
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(videolist);
    }
    
    
    @GetMapping("/user/mylist")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<VideoFileDto>> getListFiles(@AuthenticationPrincipal UserDetailsImpl user) {
    	
    	List<Video> videolist = videoService.findbyuser(user.getId());
    	
    	List<VideoFileDto> vfdto = new ArrayList<VideoFileDto>();;
    	
    	 try {
    	
    	for(Video videos:videolist) {
    		
    		Resource rf =fileService.load(videos.getId()+".png");
            byte[] arr =IOUtils.toByteArray(rf.getInputStream());
            String thumbnail = Base64
    		          .getEncoder()
    		          .encodeToString(arr);
    		
    		Path path = Paths.get(uploadPath)
                    .resolve(Long.toString(videos.getId())+".mp4");
    		FileData fd =pathToFileData(path);
    		vfdto.add(new  VideoFileDto(videos.getId(),videos.getTitle(),videos.getCategory(),videos.getFilename(),
    				fd.getSize(),thumbnail));
    	}
        
    	 } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                     .body(vfdto);
    	 }
    	 
        return ResponseEntity.status(HttpStatus.OK)
                             .body(vfdto);
    }

    @DeleteMapping("/user/delete")
    @PreAuthorize("hasRole('USER')")    
    public void delete() {
        fileService.deleteAll();
    }    

    private FileData pathToFileData(Path path) {
        FileData fileData = new FileData();
        String filename = path.getFileName()
                              .toString();
        fileData.setFilename(filename);
        fileData.setUrl(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getFile", filename)
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

    @GetMapping("/get/{filename:.+}")
    @ResponseBody
    public ResponseEntity<InputStreamResource> getFile(@PathVariable String filename) throws IOException {
        Resource videoResource = fileService.load(filename);
        
     // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("inline", videoResource.getFilename());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        // Stream the video content
        InputStream inputStream = videoResource.getInputStream();
        InputStreamResource inputStreamResource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .headers(headers)
                .body(inputStreamResource);
    }
    
    
    
    /*Generate random id for storing videos*/
     
    public long generateId() {
    	
    	Date dNow = new Date();    	
        SimpleDateFormat ft = new SimpleDateFormat("yyMMddhhmmssMs");
        String datetime = ft.format(dNow);               
                
        return Long.parseLong(datetime)+9L + (long)(Math.random()*(9L - 1L));

      }
    
    

}
