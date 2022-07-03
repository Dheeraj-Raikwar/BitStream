import React,{ Component,useRef, useState, } from "react";
import {Card, CardGroup} from 'react-bootstrap';
import { Redirect, NavLink} from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";
const baseURL = "http://localhost:8080/api/upload";

const user = JSON.parse(localStorage.getItem('user'));

let api_token;
if (user && user.accessToken) {
     api_token=user.accessToken;
  } else {
    api_token="";
  
}

class UploadList extends Component {

    constructor(props) {
        super(props);
        this.state = {videos: []};
    }

    async componentDidMount() {

        try 
        {

       let res = await axios({
            url: baseURL,
            method: 'get',
            timeout: 8000,
            headers: { Authorization: 'Bearer ' + api_token}
        })
        if(res.status === 200){

            console.log("Inside UploadList");
        }

        const data= res.data;

        this.setState({ videos: [...data] });

        }
        catch (err) {
        console.error(err);
        }

    }

    render(){

        return( <div>

            
            <CardGroup>


        {this.state.videos.map(
        (video)=>
                <Card style={{ width: '15rem' }} key={video.id}>
                    <NavLink to={`/player/${video.id}`}>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                        <Card.Title>{video.title}
                        </Card.Title>
                        <Card.Text style={{width: '15rem'}, {overflow: 'hidden'}}>{video.category}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">{video.filename}</small>
                    </Card.Footer>
                    </NavLink>
                 </Card>
            )}
            
            </CardGroup>

            </div>
            )
        
    }
}
export default UploadList;