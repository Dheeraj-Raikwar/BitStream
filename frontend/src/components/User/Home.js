import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "../UI/Player";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
const { Meta } = Card;
const baseURL = "http://localhost:8080/api/rest/all";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          url: baseURL,
          method: 'get',
          timeout: 8000
        });

        if (response.status === 200) {
          const data = response.data;
          // const ddata = Array.from({ length: 10 }, (_, index) => data[index % data.length]);
          setVideos([...data]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Update the filtered cards based on the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = videos.filter((videos) =>
      videos.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCards(filtered);
  };


  return (
    <div className="col-12 pt-4 mb-15">
      <div className="container">
        <div className="d-flex justify-content-end">
        <Input
          placeholder="Search"
          value={searchQuery}
          className="search-input"
          onChange={(e) => handleSearch(e.target.value)}
        />
        </div>
        <div className="content">
          <Routes>
            <Route path="/player/:id/:name" element={<Player />} />
          </Routes>
        </div>
        <Row gutter={[16, 16]}>
          { filteredCards ? filteredCards?.map((video) => (
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
          )):

          videos.map((video) => (
            <Col xs={24} sm={12} md={8} lg={8} key={video.id}>
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
          ))
          
          }
        </Row>
      </div>
    </div>
  );
};

export default Home;