import React, { useState, useEffect } from "react";
// import { Card, CardGroup, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import AuthHeader from "../../services/auth-header";
import { Row, Col, Card } from 'antd';
const { Meta } = Card;
// import 'antd/dist/antd.css'; // Import Ant Design styles
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
    );
};

export default AllList;
