import React, { useState } from 'react';


const user = JSON.parse(localStorage.getItem('user'));
let api_token;
if (user && user.accessToken) {
     api_token=user.accessToken;
  } else {
    api_token="";
  
  }

const UploadFile = () => {
    const [files, setFiles] = useState('');
    const [title, setitle] = useState('');
    const [category, setCategory] = useState('');
    const [filename, setFilename] = useState('');

    //state for checking file size
    const [fileSize, setFileSize] = useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = useState(null);
    //base end point url
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080/api/upload";

    const uploadFileHandler = (event) => {
        setFiles(event.target.files);
       };

    const uploadtitleHandler = (event) => {
        setitle(event.target.value);
                
       };

    const uploadcategoryHandler = (event) => {
        setCategory(event.target.value);
                
       };

    const uploadFilenameHandler = (event) => {
        setFilename(event.target.value);         
       };

      const fileSubmitHandler = (event) => {
       event.preventDefault();
       setFileSize(true);
       setFileUploadProgress(true);
       setFileUploadResponse(null);

        const formData = new FormData();

            if (files[0].size > 1024*1024*1024){
                setFileSize(false);
                setFileUploadProgress(false);
                setFileUploadResponse(null);
                return;
            }

            formData.append('file', files[0])
            formData.append('title', title)
            formData.append('category', category)
            formData.append('filename', filename)  

        const requestOptions = {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + api_token},
            body: formData
        };
        fetch(FILE_UPLOAD_BASE_ENDPOINT, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message
                    const error = (data && data.responseMessage) || response.status;
                    setFileUploadResponse(data.responseMessage);
                    return Promise.reject(error);
                }

               console.log(data.responseMessage);
               setFileUploadResponse(data.responseMessage);
            })
            .catch(error => {
                console.error('Error while uploading file!', error);
            });
        setFileUploadProgress(false);
      };

    return(

      <form onSubmit={fileSubmitHandler}>
         <input type="file"  multiple onChange={uploadFileHandler}/>
         <input type="text" onChange={uploadtitleHandler}/>
         <input type="text" onChange={uploadcategoryHandler}/>
         <input type="text" onChange={uploadFilenameHandler}/>
         <button type='submit'>Upload</button>
         {!fileSize && <p style={{color:'red'}}>File size exceeded!!</p>}
         {fileUploadProgress && <p style={{color:'red'}}>Uploading File(s)</p>}
        {fileUploadResponse!=null && <p style={{color:'green'}}>{fileUploadResponse}</p>}
      </form>

    );
}
export default UploadFile;