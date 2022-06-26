import React from "react";
import  { NavLink } from "react-router-dom";

import "./List.css"
function List() {
    return (
        <div className="List">
            <h1></h1>
            <ul>
               
                <li><NavLink to="/MyVideos">MyVideos</NavLink></li>
                <li><NavLink to="/FavouriteList">FavouriteList</NavLink></li>
            </ul>
        </div>
    )
}

export default List;