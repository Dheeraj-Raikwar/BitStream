import React,{ Component,useRef, useState, } from "react";
import {Card, CardGroup, Container, Row, Col } from 'react-bootstrap';
import { Redirect, NavLink} from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";
const baseURL = "http://localhost:8080/api/rest/user/UploadList";

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

        <Row xs={1} md={4} className="g-4">
        {this.state.videos.map(
        (video)=>
                <Col xs={3}>
                <Card style={{ width: '15rem' }} key={video.id}>
                    <NavLink to={`/player/${video.id}/${video.title}`}>
                    <Card.Img variant="top" src={"data:image/png;base64," + video.thumbnail} />
                    <Card.Body>
                        <Card.Title>{video.title}
                        </Card.Title>
                        <Card.Text style={{width: '15rem', overflow: 'hidden'}}>{video.category}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">{video.filename}</small>
                    </Card.Footer>
                    </NavLink>
                 </Card>
                 </Col>
            )}
            </Row>
            </div>
            )
        
    }
}
export default UploadList;