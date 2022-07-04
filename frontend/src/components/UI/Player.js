import React, { Component } from 'react'
import axios from 'axios';
import AuthHeader from "../../services/auth-header";
import {Ratio} from 'react-bootstrap';

const api_url = 'http://localhost:8080/api/rest/get';


export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: this.props.match.params.id,
            videoData: {}
        };
    }
    async componentDidMount() {
        try {

       let res = await axios({
            url: api_url+'/'+ this.state.videoId +'.mp4',
            method: 'get',
            timeout: 8000
        })

        if(res.status === 200){
            console.log("Inside Player");
            let data=res.data;
            this.setState({ videoData: data });

        }
        
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <div style={{ width: 660, height: 'auto' }}>
                    <Ratio aspectRatio="16x9">
                    <video controls muted autoPlay
                    src={"data:video/mp4;base64," + this.state.videoData}/>
                    
                    </Ratio>
                </div>
                <h1>{ this.state.videoId }</h1>
            </div>
        )
    }
}