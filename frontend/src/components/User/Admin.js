import React, { useEffect, useState } from "react";

import UserService from "../../services/UserService";
import EventBus from "../../common/EventBus";

const BoardAdmin = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getAdminBoard();
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
        }
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once (on mount)

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardAdmin;