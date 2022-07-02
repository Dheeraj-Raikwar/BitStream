import React, { Component } from 'react'
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

let id='baeldung.jpeg'

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: this.props.match.params.id,
            videoData: ""
        };
    }
    async componentDidMount() {
        try {

        console.log(this.state.videoId);
       let res = await axios({
            url: api_url+'/'+ this.state.videoId,
            method: 'get',
            timeout: 8000,
            headers: { Authorization: 'Bearer ' + api_token}
        })

        if(res.status === 200){
            console.log(res.status);
        }
        console.log(this.state.videoData);

        let data=res.data;

        this.setState({ videoData: data });

        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <header>
                    <img
                        src={"data:image/jpeg;base64," + this.state.videoData} alt="Fetching Image..." height={200} width={200}/>
                    <h1>{ this.state.videoData.name }</h1>
                </header>
            </div>
        )
    }
}