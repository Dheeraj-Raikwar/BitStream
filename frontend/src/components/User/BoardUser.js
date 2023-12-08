import React, { useState, useEffect } from "react";
import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";

import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import UserList from "../UI/UserList";

import uploadVideo from "../UI/UploadVideo";
import getById from "../UI/GetById";
import myList from "../UI/MyList";
import player from "../UI/Player";

const BoardUser = ({history}) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getUserBoard();
        setContent(response.data);
      } catch (error) {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(errorMessage);

        if (error.response && error.response.status === 401) {
          // Assuming EventBus is a global event bus
          // Update this part according to your actual implementation
          EventBus.dispatch("logout");
          history.push('/error');
        }
      }
    };
    console.log("UseEffect called..")
    fetchData();
  }, [history]); // Empty dependency array means this effect runs once on mount
  return (
    <div className="container">
      <header className="jumbotron">
      </header>
      <HashRouter>
        <UserList></UserList>
        <div className="content">
          <Switch>
            <Route path="/upload" component={uploadVideo} />
            <Route path="/getById" component={getById} />
            <Route path="/myList" component={myList} />
            <Route path="/player/:id/:name" component={player} />
          </Switch>
        </div>
      </HashRouter>
    </div>
  );
}
export default BoardUser;