import React, { useState, useEffect } from "react";
import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
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

import { Button, Modal, message, Spac } from 'antd';

const BoardUser = ({ history }) => {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [videoData, setVideoData] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState([]);
  const [successMessage, setSuccessMessage] = useState([]);

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

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    document.getElementById('file').value = '';
    setOpen(false);
  };

  const handleAll = (e, options) => {
    setSuccessMessage([]);
    setError([]);
    if (!options) {
      let id = e.target.id;
      let value = e.target.value;
      
      if (e.target.id === "file" && e.target.files) {
        let inputElement = document.getElementById('select-btn');
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
        inputElement.classList.add('error');
      } else {
        inputElement.classList.remove('error');
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

  const openMessage = (type, content, duration = 100) => {
    const key = `custom_message_${Date.now()}`;

    message.open({
      key,
      type: type,
      content: <CustomMessageContent content={content} onClose={() => message.destroy(key)} />,
      duration,
      onClose: () => message.destroy(key),
    });
  };

  return (
    <div>
      {contextHolder}
      <div className="col-12 pt-3 mb-3">
        <div className="container">
          <HashRouter>
            <Button type="primary" onClick={() => { setOpen(true); setVideoData(); }}>Upload</Button>
            <div className="content">
              <Switch>
                <Route path="/upload" component={uploadVideo} />
                <Route path="/getById" component={getById} />
                <Route path="/myList" component={myList} />
                <Route path="/player/:id/:name" component={player} />
              </Switch>
            </div>
          </HashRouter>
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
                <label>Title</label>
                <input type='text' className="form-control" autoComplete='off' value={videoData?.title || ""}
                  id='title' onChange={(e) => { handleAll(e) }}>
                </input>
              </div>
              <div className="col-md-6 pl-10">
                <label>Category</label>
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
              <label>Choose File</label>
                <div className="form-group d-flex justify-content-start align-items-end">
                  <span hidden>
                    <input type="file" accept="video/mp4,video/mkv, video/x-m4v,video/*" onChange={(e) => { handleAll(e); }} id="file" name="file" />
                  </span>
                  <div className="form-control w-50 d-flex flex-column">
                    <label htmlFor="file" className="btn btn-primary" id="select-btn">Select</label>
                    <span className='mx-2'>(.mp4, .mkv, .m4v)</span>
                  </div>
                  {videoData?.file && <span>{videoData?.file.name}</span>}
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