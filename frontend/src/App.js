import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import AuthService from "./services/AuthService";
import Login from "./components/User/Login";
import Register from "./components/User/register.component";
import Home from "./components/User/Home";
import Profile from "./components/User/Profile";
import BoardUser from "./components/User/BoardUser";
// import BoardModerator from "./components/User/board-moderator.component";
import BoardAdmin from "./components/User/board-admin.component";
import Error from "./components/UI/Error";
import { useNavigate } from 'react-router-dom'; // Import useNavigate 
// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;
const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  // Retrieve the last selected menu item from localStorage
  const storedSelectedItem = localStorage.getItem('selectedMenuItem');
  // Initialize state with the stored value or the default value
  const [currentSelectedItem, setCurrentSelectedItem] = useState(storedSelectedItem || '2');

  const authService = AuthService();
  useEffect(() => {

    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
      }
    } catch (error) {
      console.error('Login failed', error);
    }

    const handleLogout = () => {
      logOut();
    };

    EventBus.on('logout', handleLogout);

    localStorage.setItem('selectedMenuItem', currentSelectedItem);

    return () => {
      EventBus.remove('logout', handleLogout);
    };

  }, [currentSelectedItem]); // Empty dependency array to mimic componentDidMount

  var menuItems = [
    // {
    //   key: '1',
    //   label: 'Bitstream',
    //   path: '/',
    // },
    {
      key: '2',
      label: 'Home',
      path: '/home',
    },

    showAdminBoard && {
      key: '3',
      label: 'Admin Board',
      path: '/admin',
    },

    currentUser && {
      key: '4',
      label: 'User',
      path: '/user',
    },

    ...(currentUser
      ? [
        {
          key: '5',
          label: 'Profile',
          path: '/profile',
        },
        {
          key: '6',
          label: 'Logout',
          path: '/login',
        },
      ]
      : [
        {
          key: '7',
          label: 'Login',
          path: '/login',
        },
        {
          key: '8',
          label: 'Sign Up',
          path: '/register',
        },
      ]),

  ].filter(Boolean);

  const navigate = useNavigate();
  const logOut = () => {
    authService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <div>
        <Layout className="layout">
          <Header style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
            <div className="demo-logo"></div>
            {/* <Link to="/">
              <div className="demo-logo" style={{ width: '50px', height: '50px', background: 'url(https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?w=740&t=st=1701947726~exp=1701948326~hmac=60636e74737582b51f7585925cd63988c5e8f6117a169a5060c182e9c8d9615f.png) no-repeat', backgroundSize: 'cover' }} />
            </Link> */}
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[currentSelectedItem]}
              onClick={({ key }) => setCurrentSelectedItem(key)}
              items={menuItems.map(item => ({
                key: item.key,
                label: item.key === '6' ? (
                  <a key={item.key} onClick={logOut}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.key} to={item.path}>
                    {item.label}
                  </Link>
                ),
              }))}
              className="custom-menu"
            />
          </Header>
          <div>
            <Routes>
              <Route exact path="/*" element={<Home />} />
              <Route exact path="/home/*" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route path="/user/*" element={<BoardUser />} />
              <Route path="/admin" element={<BoardAdmin />} />
              <Route path="/error" element={<Error />} />
            </Routes>
          </div>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2024 Created by &
          </Footer>
        </Layout>
      </div>
    </div>
  );
};

export default App;