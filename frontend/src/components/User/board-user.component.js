import React, { Component } from "react";
import  { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";

import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import List from "../UI/List";

import uploadFile from "../UI/UploadFileCom";
import getById from "../UI/GetById";
import uploadList from "../UI/UploadList";
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
        <List></List>
            <div className="content">
            <Switch>
                        <Route path="/upload" component={uploadFile}/>
                        <Route path="/getById" component={getById}/>
                        <Route path="/uploadList" component={uploadList}/>
                        
             </Switch>
                            
              </div>
            </HashRouter>

            <BrowserRouter>
            <Switch>
              <Route path="/player/:id" component={player}></Route>
                </Switch>
              </BrowserRouter>    
      </div>
    );
  }
}
