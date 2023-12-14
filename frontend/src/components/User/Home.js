import React, { useState, useEffect } from "react";
import axios from 'axios';
import { HashRouter, Switch, Route } from "react-router-dom";
import player from "../UI/Player";
import HomeList from "../UI/HomeList";

const baseURL = "http://localhost:8080/api/rest/all";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: baseURL,
          method: 'get',
          timeout: 8000
        });

        if (response.status === 200) {
          console.log("Inside UploadList");
        }

        const data = response.data;
        setVideos([...data]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-12 mb-15">
      <div className="container">
        <HashRouter>
          <HomeList videos={videos} />
          <div className="content">
            <Switch>
              <Route path="/player/:id/:name" component={player} />
            </Switch>
          </div>
        </HashRouter>
      </div>
    </div>
  );
};

export default Home;