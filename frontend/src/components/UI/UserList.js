import React from "react";
import  { NavLink } from "react-router-dom";

import "./UserList.css"
function UserList() {
    return (
        <div className="List">
            <h1></h1>
            <ul>             
                <li><NavLink to="/upload">Upload Video</NavLink></li>
                <li><NavLink to="/getById">Searched Item</NavLink></li>              
                <li><NavLink to="/myList">My List</NavLink></li>
                
            </ul>
        </div>
    )
}

export default UserList;