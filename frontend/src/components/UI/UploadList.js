import React, { useState, useEffect } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import AuthHeader from "../../services/auth-header";
import { Avatar, List, Space } from 'antd';

const baseURL = "http://localhost:8080/api/rest/user/mylist";

const UploadList = () => {
  const [videos, setVideos] = useState([]);
  const [data, setData] = useState([{
    href: 'https://ant.design',
    title: `ant design part 1`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=1`,
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',

  }])

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

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
          const data = res.data;
          setVideos([...data]);
        }
        else {
          console.log("res", res)
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once (on mount)

  return (
    <div>
      
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={videos}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            ]}
            extra={
              <img
                width={272}
                alt="logo"
                src={"data:image/png;base64," + item.thumbnail}
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={data[0].avatar} />}
              title={<NavLink to={`/player/${item.id}/${item.title}`}>
                {item.title}
              </NavLink>}
              description={data[0].description}
            />
            {item.category}
          </List.Item>
        )}
      />


      {/* <Row xs={1} md={4} className="g-4">
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
      </Row> */}
    </div>
  );
};

export default UploadList;