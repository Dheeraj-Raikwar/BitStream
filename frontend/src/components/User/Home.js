import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "../UI/Player";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, Input, Pagination } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
const { Meta } = Card;
const baseURL = "http://localhost:8080/api/rest/all";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState();

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 3; // Number of items per page
  const totalItems = videos.length; // Total number of items

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the data array to display only the items for the current page
  const currentPageData = videos.slice(startIndex, Math.min(endIndex, videos.length));
  const filteredPageData = filteredCards?.slice(startIndex, Math.min(endIndex, videos.length));

  useEffect(() => {
    fetchData();
  }, []);

  // API to get all videos --need to implement pagination..
  const fetchData = async () => {
    try {
      const response = await axios({
        url: baseURL,
        method: 'get',
        timeout: 8000
      });

      if (response.status === 200) {
        const data = response.data;
        setVideos(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Update the filtered cards based on the search query
  const handleSearch = async (query) => {
    try {
      const response = await axios({
        url: "http://localhost:8080/search",
        method: 'get',
        timeout: 8000,
        params: {
          q: query // Assuming the parameter name is "query"
        }
      });

      if (response.status === 200) {
        const data = response.data;
        setVideos(data);
      }
    } catch (error) {
      console.error(error);
    }
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
        <div className="content pt-3">
          <Routes>
            <Route path="/player/:id/:name" element={<Player />} />
          </Routes>
          {console.log("filteredPageData", filteredPageData)}
          <div className="d-flex flex-column pt-2">
            <Row gutter={[16, 16]}>
              {filteredPageData ? filteredPageData?.map((video) => (
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
              )) :

                <>{currentPageData?.map((video) => (
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
                ))}
                </>
              }
            </Row>
            <div className="d-flex justify-content-end">
              <Pagination
                style={{ textAlign: 'center', marginTop: '20px' }}
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;