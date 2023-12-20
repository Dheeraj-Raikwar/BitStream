import React, { useEffect, useState } from "react";
import { Navigate  } from "react-router-dom";
import AuthService from "../../services/AuthService";

const Profile = () => {
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "" });
  const authService = AuthService();

  useEffect(() => {
      const user = authService.getCurrentUser();
      if (!user) {
        setRedirect("/home");
      } else {
        setCurrentUser(user);
        setUserReady(true);
      }

  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="container">
      Profile.
      {userReady && (
        <div>
          <header className="jumbotron">
            <h3>
              <strong>DashBoard</strong>
            </h3>
          </header>
        </div>
      )}
    </div>
  );
};

export default Profile;
