import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = 'http://localhost:8080/api/auth/';

const AuthService = () => {
  const navigate = useNavigate();
  const login = async (username, password) => {
    const response = await axios
      .post(API_URL + 'signin', {
        username,
        password,
      });
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const register = (username, email, password) => {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password,
    });
  };

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
  };

  return {
    login,
    logout,
    register,
    getCurrentUser,
  };
};

export default AuthService;
