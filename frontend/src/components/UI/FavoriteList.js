import React, { useState, useEffect } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import AuthHeader from "../../services/auth-header";
import { Avatar, List, Space } from 'antd';

const baseURL = "http://localhost:8080/api/rest/user/mylist";

const FavoriteList = () => {
    
  useEffect(() => {
    
  }, []); // The empty dependency array ensures this effect runs only once (on mount)

  return (
    <div>
      <p>This is favorite list will populate later..</p>
    </div>
  );
};

export default FavoriteList;