import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import AuthService from "./services/AuthService";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Home from "./components/User/Home";
import Profile from "./components/User/Profile";
import BoardUser from "./components/User/User";
// import BoardModerator from "./components/User/board-moderator.component";
import BoardAdmin from "./components/User/Admin";
import Error from "./components/UI/Error";
import { useNavigate } from 'react-router-dom'; // Import useNavigate 
// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Flex, Menu, theme, Button } from 'antd';
import { useLocation } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FireOutlined,
  ToTopOutlined,
  FolderOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const App = () => {
  const authService = AuthService();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  // Retrieve the last selected menu item from localStorage
  const storedSelectedItem = localStorage.getItem('selectedMenuItem');
  // Initialize state with the stored value or the default value
  const [currentSelectedItem, setCurrentSelectedItem] = useState(storedSelectedItem || '2');

  const [collapsed, setCollapsed] = useState(false);

  // check url path
  const location = useLocation();
  const currentPath = location.pathname;

  var headerItems = [
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

  const [sidebarItems, setSidebarItems] = useState([]);


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
    console.log(currentSelectedItem);

    if (currentSelectedItem === '2') {
      setSidebarItems([{
        key: '1',
        icon: <HomeOutlined />,
        label: 'All Video',
        path: '/all'
      },

      {
        key: '2',
        icon: <FireOutlined />,
        label: 'Popular',
        path: '/nowplaying'
      }
      ])
    }
    else if (currentSelectedItem === '4') {
      setSidebarItems([{
        key: '1',
        icon: <ToTopOutlined />,
        label: 'Upload',
        path: '/user'
      },

      {
        key: '2',
        icon: <FolderOutlined />,
        label: 'My Videos',
        path: '/myvideos'
      },

      {
        key: '3',
        icon: <StarOutlined />,
        label: 'Favourite',
        path: '/favourite'
      }

      ])

    }
    else if (currentSelectedItem === '5') {
      setSidebarItems([{
        key: '1',
        icon: <UserOutlined />,
        label: 'Profile',
        path: '/profile'
      }
      ])
    }
    else {
      setSidebarItems([{
        key: '1',
        icon: <HomeOutlined />,
        label: 'All Video',
        path: '/all'
      }])
    }

    return () => {
      EventBus.remove('logout', handleLogout);
    };

  }, [currentSelectedItem]); // Empty dependency array to mimic componentDidMount


  const logOut = () => {
    authService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  console.log(sidebarItems)

  return (
    <div>
      <div>
        <Layout>
          {/* Ant design header */}
          <Header style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
            <div className="demo-logo">
              <Link to="/">
                <div className="demo-logo" style={{ width: '30px', height: '30px', background: `url(${process.env.PUBLIC_URL}/logo192.png) no-repeat`, backgroundSize: 'cover' }} />
              </Link>
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[currentSelectedItem]}
              onClick={({ key }) => setCurrentSelectedItem(key)}
              items={headerItems.map(item => ({
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

          {/* Ant design side bar*/}

          <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <div className="demo-logo-vertical" />
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={sidebarItems.map(item => ({
                  key: item.key,
                  icon: item.icon,
                  label:
                    <Link key={item.key} to={item.path}>
                      {item.label}
                    </Link>
                }))}
              />
            </Sider>

            <Layout>
              <Header
                style={{
                  padding: 0,
                  background: colorBgContainer,
                }}
              >
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
              </Header>

              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >

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

              </Content>
            </Layout>

          </Layout>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2024 Created by &
          </Footer>
        </Layout>
      </div>
    </div>
  );
};

export default App;