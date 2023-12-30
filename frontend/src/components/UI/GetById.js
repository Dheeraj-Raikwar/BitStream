import React,{useEffect,useState } from "react";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";

const api_url = 'http://localhost:8080/api/upload';

const user = JSON.parse(localStorage.getItem('user'));

let api_token;
if (user && user.accessToken) {
     api_token=user.accessToken;
  } else {
    api_token="";
  
  }

let data;
let id='Shenhe Leaks - Gameplay Animations - Genshin Impact 2.4.mp4'
function GetById(){

  const getUploadList = async () => {

   try {

       let res = await axios({
            url: api_url+'/'+id,
            method: 'get',
            timeout: 8000,
            headers: { Authorization: 'Bearer ' + api_token}
        })
        if(res.status === 200){
            console.log("Inside Get By Id");
            data=res.data;
        }
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

  <video controls muted autoPlay
  src={"data:video/mp4;base64," + data}/>
  </div>;

  
}

export default GetById;