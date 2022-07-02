import React from "react";
import  { NavLink } from "react-router-dom";

import "./List.css"
function List() {
    return (
        <div className="List">
            <h1></h1>
            <ul>             
                <li><NavLink to="/upload">Upload Video</NavLink></li>
                <li><NavLink to="/getById">Searched Item</NavLink></li>
                <li><NavLink to="/uploadList">Upload List</NavLink></li>
            </ul>
        </div>
    )
}

export default List;