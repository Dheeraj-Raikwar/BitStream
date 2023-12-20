import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "../UI/Player";
import HomeList from "../UI/HomeList";
import { NavLink } from "react-router-dom";
import { Row, Col, Card } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
const { Meta } = Card;
const baseURL = "http://localhost:8080/api/rest/all";

const Home = () => {
  const [videos, setVideos] = useState([]);

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
    <div className="col-12 pt-4 mb-15">
      <div className="container">
          <div className="content">
            <Routes>
              <Route path="/player/:id/:name" element={<Player />}/>
            </Routes>
          </div>
          <Row gutter={[16, 16]}>
            {videos.map((video) => (
              <Col xs={24} sm={12} md={8} lg={6} key={video.id}>
                <NavLink to={`/player/${video.id}/${video.title}`}>
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={"data:image/png;base64," + video.thumbnail} />}
                  >
                    <Meta title={video.title} description={video.category} />
                  </Card>
                </NavLink>
              </Col>
            ))}
          </Row>
      </div>
    </div>
  );
};

export default Home;