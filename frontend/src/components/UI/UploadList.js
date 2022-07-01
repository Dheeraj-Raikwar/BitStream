import React,{useEffect,useState } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";

const api_url = 'http://localhost:8080/api/videoFile/files/baeldung.jpeg';

const user = JSON.parse(localStorage.getItem('user'));

let api_token;
if (user && user.accessToken) {
     api_token=user.accessToken;
  } else {
    api_token="";
  
  }

let data;
function UploadList(){

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

        data=res.data;



    }
    catch (err) {
        console.error(err);
    }


};

useEffect(() => {

    getUploadList();

  }, []);


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

  //return data.map((video) => <li>{video.bytes}</li>);
   

  return <div>

  <img src={"data:image/jpeg;base64," + data} alt="Fetching Image..." height={200} width={200}/>

  <img src="http://localhost:8080/api/videoFile/files/baeldung.jpeg" alt="Fetching Image..." height={200} width={200}/>

  </div>;

  
}

export default UploadList;