import React, { Component } from "react";
import  { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";

import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import UserList from "../UI/UserList";

import uploadVideo from "../UI/UploadVideo";
import getById from "../UI/GetById";
import myList from "../UI/MyList";
import player from "../UI/Player";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
        </header>
        <HashRouter>
        <UserList></UserList>
            <div className="content">
            <Switch>
                        <Route path="/upload" component={uploadVideo}/>
                        <Route path="/getById" component={getById}/>
                        <Route path="/myList" component={myList}/>                        
                        <Route path="/player/:id" component={player}/>                        
             </Switch>
                            
              </div>
            </HashRouter>    
      </div>
    );
  }
}
