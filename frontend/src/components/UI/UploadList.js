import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import AuthHeader from "../../services/auth-header";

const baseURL = "http://localhost:8080/api/rest/user/UploadList";

const UploadList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const api_token = user && user.accessToken ? user.accessToken : "";

        const res = await axios({
          url: baseURL,
          method: "get",
          timeout: 8000,
          headers: { Authorization: "Bearer " + api_token },
        });

        if (res.status === 200) {
          console.log("Inside UploadList");
        }

        const data = res.data;
        setVideos([...data]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once (on mount)

  return (
    <div>
      <Row xs={1} md={4} className="g-4">
        {videos.map((video) => (
          <Col xs={3} key={video.id}>
            <Card style={{ width: "15rem" }}>
              <NavLink to={`/player/${video.id}/${video.title}`}>
                <Card.Img
                  variant="top"
                  src={"data:image/png;base64," + video.thumbnail}
                />
                <Card.Body>
                  <Card.Title>{video.title}</Card.Title>
                  <Card.Text style={{ width: "15rem", overflow: "hidden" }}>
                    {video.category}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">{video.filename}</small>
                </Card.Footer>
              </NavLink>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UploadList;