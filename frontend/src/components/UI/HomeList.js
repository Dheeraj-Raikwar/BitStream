import React, { useState, useEffect } from "react";
import { Card, CardGroup, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";

const baseURL = "http://localhost:8080/api/rest/all";

const AllList = () => {
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
        <div>
            <Row xs={1} md={4} className="g-4">
                {videos.map((video) =>
                    <Col xs={3} key={video.id}>
                        <Card style={{ "width": '15rem' }}>
                            <NavLink to={`/player/${video.id}/${video.title}`}>
                                <Card.Img variant="top" src={"data:image/png;base64," + video.thumbnail} />
                                <Card.Body>
                                    <Card.Title>{video.title}</Card.Title>
                                    <Card.Text style={{"width": '15rem', "overflow": 'hidden'}}>{video.category}</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{video.filename}</small>
                                </Card.Footer>
                            </NavLink>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default AllList;
