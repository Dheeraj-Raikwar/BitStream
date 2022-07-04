import React,{ Component,useRef, useState, } from "react";
import {Card, CardGroup} from 'react-bootstrap';
import { Redirect, NavLink} from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";


import  { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import player from "../UI/Player";
import HomeList from "../UI/HomeList";
import Public from "../UI/Public";

const baseURL = "http://localhost:8080/api/rest/all";
export default class Home extends Component {


    constructor(props) {
        super(props);
        this.state = {videos: [],content:""};
    }

    async componentDidMount() {

        try 
        {

       let res = await axios({
            url: baseURL,
            method: 'get',
            timeout: 8000
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
  

  render() {

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>         
        </header>
        
        <HashRouter>
        <HomeList></HomeList>
            <div className="content">
            <Switch>
                        
                        <Route path="/all" component={Public}/>                      
                        <Route path="/player/:id/:name" component={player}/>                        
             </Switch>
                            
              </div>
            </HashRouter>  

      </div>
    );
  }
}
