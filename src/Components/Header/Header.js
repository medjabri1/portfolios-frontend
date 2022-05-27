import React from 'react'

import { Link, Navigate, useNavigate } from "react-router-dom";

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faSearch, faUser, faSignOutAlt } from '@fortawesome/fontawesome-svg-core/import.macro'

import axios from 'axios'

import "./Header.css";

function Navbar() {

    let navigate = useNavigate();
    let API_BASE_URL = 'http://localhost:8081/api';

    let request_logout = () => {

        // axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true })
        //     .then(res => {
        //         console.log(res.data);
        //     });

        // setTimeout(() => {
        //     navigate("/");
        // }, 1000);

    };

    return (
        <div className="header">
            <div className="header-container">
                <div className="header-logo">Portfolios</div>
                <ul className="header-nav">

                    {/* Home Link */}
                    <Link className="header-nav-link" to="/home/">
                        <FontAwesomeIcon icon={faHome} className="link-icon" />
                        <span>Home</span>
                    </Link>

                    {/* Search Link */}
                    <Link className="header-nav-link" to="/home/search">
                        <FontAwesomeIcon icon={faSearch} className="link-icon" />
                        <span>Search</span>
                    </Link>

                    {/* Profile Link */}
                    <Link className="header-nav-link" to="/profile/">
                        <FontAwesomeIcon icon={faUser} className="link-icon" />
                        {/* <span>Profile</span> */}
                    </Link>

                    {/* Log Out Link */}
                    <li className="header-nav-link" onClick={request_logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="link-icon" />
                        {/* <span>Log out</span> */}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar
