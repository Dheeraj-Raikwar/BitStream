import React,{ Component,useRef, useState, } from "react";
import { Redirect } from "react-router-dom";

const baseURL = "http://localhost:8080/api/test/user";

class getUploadList extends Component {

    constructor(props) {
        super(props);
        this.state = {clients: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('${baseURL}/uploadlist')
            .then(response => response.json())
            .then(data => this.setState({clients: data}));
    }
}
export default getUploadList;