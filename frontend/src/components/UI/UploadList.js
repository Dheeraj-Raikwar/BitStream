import React,{useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";

const api_url = 'http://localhost:8080/api/test/user/uploadlist';

const user = JSON.parse(localStorage.getItem('user'));
let api_token;
if (user && user.accessToken) {
     api_token=user.accessToken;
  } else {
    api_token="";
  
  }

let data=[];
function UploadList(){

   useEffect(() => {

    getUploadList();

  }, []);

  const getUploadList = async () => {

   try {
       let res = await axios({
            url: api_url,
            method: 'get',
            timeout: 8000,
            headers: { Authorization: 'Bearer ' + api_token}
        })
        if(res.status === 200){

            console.log(res.status);
        
        }  

       data=await res.data;
         
    }
    catch (err) {
        console.error(err);
    }
};

 /*uploadlist=data.map(
        (video)=>{
            return(
                <li>
                    <p>{video.title}
                    {video.category}
                    {video.filename}</p>
                </li>
            )
        }
    )
*/


  return data.map((video) => <li>{video.title}</li>);
}

export default UploadList;