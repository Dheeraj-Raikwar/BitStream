import React from "react";
import  { NavLink } from "react-router-dom";

import "./UserList.css"
function HomeList() {
    return (
        <div className="List">
            <h1></h1>
            <ul>                           
                <li><NavLink to="/all">Home</NavLink></li>
            </ul>
        </div>
    )
}

export default HomeList;