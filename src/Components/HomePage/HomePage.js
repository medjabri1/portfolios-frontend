import React from 'react'

import { Routes, Route, useNavigate } from "react-router-dom";

import { useState, useEffect } from 'react'

import axios from 'axios';

import Header from "../Header/Header";
import Home from "./Components/Home/Home";
import Search from "./Components/Search/Search";

import "./HomePage.css";

function HomePage() {

    const API_BASE_URL = 'http://localhost:8081/api';
    let navigate = useNavigate();

    let [displayLoader, setDisplayLoader] = useState(true);
    let [loggedUserId, setLoggedUserId] = useState(0);

    useEffect(() => {
        checkLoginStatus();
    }, [])

    // Check login status

    let checkLoginStatus = () => {
        axios.get(`${API_BASE_URL}/user/log-status`, { withCredentials: true })
            .then(res => {
                let user_id = res.data.session_user_id;

                if (user_id != "null") {
                    // USER LOGGED IN
                    setTimeout(() => {
                        setDisplayLoader(false);
                        setLoggedUserId(user_id);
                    }, 1000);
                } else {
                    navigate("/");
                }
            });
    }

    return (
        <div className="home-page">

            {/* LOADING */}
            {
                displayLoader ?
                    <div className="loader">
                        <span className="loader-square">
                            <span className="dot-1"></span>
                            <span className="dot-2"></span>
                        </span>
                    </div>
                    : null
            }

            <Header />
            <Routes>
                <Route path="/" element={<Home loggedUserId={loggedUserId} />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </div>
    )
}

export default HomePage
