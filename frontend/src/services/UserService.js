import { useEffect } from 'react';
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

const UserService = () => {
  const getPublicContent = () => {
    return axios.get(API_URL + 'all');
  };

  const getUserBoard = () => {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  };

  const getModeratorBoard = () => {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  };

  const getAdminBoard = () => {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  };

  useEffect(() => {
    // You can include any setup logic or cleanup logic here if needed
    // This effect runs once when the component is mounted
    return () => {
      // Cleanup logic (if any) when the component is unmounted
    };
  }, []); // The empty dependency array [] ensures that this effect runs only once

  return {
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
  };
};

export default UserService;