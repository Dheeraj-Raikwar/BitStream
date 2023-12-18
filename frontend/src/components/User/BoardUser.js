import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Form, Row, Col } from 'react-bootstrap';
import { Select } from 'antd';

import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import UserList from "../UI/UserList";

import uploadVideo from "../UI/UploadFile";
import getById from "../UI/GetById";
import myList from "../UI/UploadList";
import player from "../UI/Player";
import UploadList from "../UI/UploadList";

import { Button, Modal, message, Spac, Input } from 'antd';

const { TextArea } = Input;

const BoardUser = ({ history }) => {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [videoData, setVideoData] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState([]);
  const [successMessage, setSuccessMessage] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  let api_token;
  if (user && user.accessToken) {
    api_token = user.accessToken;
  } else {
    api_token = "";

  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getUserBoard();
        setContent(response.data);
      } catch (error) {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setContent(errorMessage);
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
          history.push('/error');
        }
      }
    };
    fetchData();

  }, [history]);

  // Method to upload file
  const handleOk = () => {
    setConfirmLoading(true);
    var errors = [];

    if (!videoData?.title) {
      errors.push('Please enter video title.');
      document.getElementById('title').classList.add('error');
    }
    if (!videoData?.category) {
      errors.push(' Please enter video category.');
      document.getElementsByClassName('ant-select')[0].classList.add('error');
    }
    if (!videoData?.file) {
      errors.push(' Please select video file.');
      document.getElementById('selectBox').classList.add('error');
    }

    if (errors) {
      console.log(errors)
      openMessage('warning', errors);
      setConfirmLoading(false);
    }

    else {
      const formData = new FormData();
      formData.append('title', videoData.title);
      formData.append('category', videoData.category);
      formData.append('file', videoData.file);
      const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080/api/rest/user/upload";
      const requestOptions = {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + api_token },
        body: formData
      };
      fetch(FILE_UPLOAD_BASE_ENDPOINT, requestOptions)
        .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          // check for error response
          if (!response.ok) {
            // get error message
            const error = (data && data.responseMessage) || response.status;
            // setFileUploadResponse(data.responseMessage);
            openMessage('error', 'Unable to process the request, try again later.');
            return Promise.reject(error);
          }
          console.log(data.responseMessage);
          // setFileUploadResponse(data.responseMessage);
          openMessage('success', data.responseMessage);
        })
        .catch(error => {
          openMessage('error', 'Failed to fetch, contact to admin.');
        }).finally(() => {
          setConfirmLoading(false);
          setOpen(false);
        });
    }
  };

  const handleCancel = () => {
    document.getElementById('file').value = '';
    document.getElementById('title').classList.remove('error');
    document.getElementsByClassName('ant-select')[0].classList.remove('error');
    document.getElementById('selectBox').classList.remove('error');
    setOpen(false);
  };

  const handleAll = (e, options) => {
    setSuccessMessage([]);
    setError([]);
    if (!options) {
      let id = e.target.id;
      let value = e.target.value;

      if (e.target.id === "file" && e.target.files) {
        let inputElement = document.getElementById('selectBox');
        e.persist();
        let file = e.target.files[0];
        if (file.size > 1024 * 1024 * 1024) {
          openMessage('error', 'The file size limit exceeded, Max: 500 MB allowed');
          inputElement.classList.add('error');
        }
        else {
          if (file) {
            inputElement.classList.remove('error');
            setVideoData({
              ...videoData,
              [id]: file
            });
          }
          else {
            inputElement.classList.add('error');
          }
        }

      }
      else {
        const inputElement = document.getElementById(id);
        var elementValue = inputElement.value.trim();
        if (elementValue === '') {
          inputElement.classList.add('error');
        } else {
          inputElement.classList.remove('error');
        }
        setVideoData({
          ...videoData,
          [id]: value
        });
      }
    }
    else {
      const inputElement = document.getElementById('category');
      const elementValue = inputElement.value.trim();
      if (elementValue === '') {
        document.getElementsByClassName('ant-select')[0].classList.add('error');
      } else {
        document.getElementsByClassName('ant-select')[0].classList.remove('error');
      }
      setVideoData({
        ...videoData,
        ['category']: options.value
      });
    }
  }

  const CustomMessageContent = ({ content, onClose }) => (
    <div className="d-flex align-items-baseline">
      <p>{content}</p>
      <Button className="ml-5" type="text" onClick={onClose}>
        Close
      </Button>
    </div>
  );

  const openMessage = (type, content) => {
    const key = `custom_message_${Date.now()}`;
    message.open({
      key,
      type: type,
      content: <CustomMessageContent content={content} onClose={() => message.destroy(key)} />,
      duration: 3,
      onClose: () => message.destroy(key),
    });
  };

  return (
    <div>
      {contextHolder}
      <div className="col-12 pt-3 mb-3">
        <div className="container">
          <BrowserRouter>
            <Button type="primary" onClick={() => { setOpen(true); setVideoData(); }}>Upload</Button>
            <div className="content">
              <Switch>
                <Route path="/upload" component={uploadVideo} />
                <Route path="/getById" component={getById} />
                <Route path="/myList" component={myList} />
                <Route path="/player/:id/:name" component={player} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </div>

      {/* <!-- Upload Video Modal -->*/}
      <div id="uploadVideoModal">
        <Modal
          title="Upload New Video"
          open={open}
          onOk={handleOk}
          okText="Upload"
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div className="row">
            <div className="form-group">
              <div className="col-md-12 pl-10">
                <label>Title<span className="text-danger">*</span></label>
                <input type='text' className="form-control" autoComplete='off' value={videoData?.title || ""}
                  id='title' onChange={(e) => { handleAll(e) }}>
                </input>
              </div>
              <div className="col-md-6 pl-10">
                <label>Category<span className="text-danger">*</span></label>
                <Select className="form-control" id='category' onChange={(value, options) => { handleAll(value, options); }} value={videoData?.category || ""}
                  bordered={false} placement={'bottomLeft'}
                  options={[
                    {
                      key: 'Movie',
                      value: 'Movie',
                      label: 'Movie',
                    },
                    {
                      key: 'Music',
                      value: 'Music',
                      label: 'Music',
                    },
                    {
                      key: 'Game',
                      value: 'Game',
                      label: 'Game',
                    },
                    {
                      key: 'Funny',
                      value: 'Funny',
                      label: 'Funny',
                    },
                    {
                      key: 'Tutorial',
                      value: 'Tutorial',
                      label: 'Tutorial',
                    },
                    {
                      key: 'Other',
                      value: 'Other',
                      label: 'Other',
                    },
                  ]} />
              </div>

              <div className="col-md-12">
                <label>Choose File<span className="text-danger">*</span></label>
                <div className="form-group d-flex justify-content-start align-items-end">
                  <span hidden>
                    <input type="file" accept="video/mp4,video/mkv, video/x-m4v,video/*" onChange={(e) => { handleAll(e); }} id="file" name="file" />
                  </span>
                  <div className="form-control w-50 d-flex flex-column" id="selectBox">
                    <label htmlFor="file" className="btn btn-primary">Select</label>
                    <span className='mx-2'>(.mp4, .mkv, .m4v)</span>
                  </div>
                  {videoData?.file && <TextArea value={(videoData?.file.name).length < 69 ? videoData?.file.name : (videoData?.file.name).substring(0,65).concat('...')} disabled/>}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
export default BoardUser;