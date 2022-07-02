import React from 'react'

import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";

import axios from 'axios'

import Header from "../Header/Header";
import Profile from "./Components/Profile/Profile";
import Settings from "./Components/Settings/Settings";
// import Settings from "./Components/Settings/Settings";

import "./ProfilePage.css";

function ProfilePage() {

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
        <div className="profile-page">

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
                <Route path="/" element={<Profile loggedUserId={loggedUserId} />} />
                <Route path="/:id" element={<Profile loggedUserId={loggedUserId} />} />
                <Route path="/settings" element={<Settings loggedUserId={loggedUserId} />} />
                <Route path="/*" element={<h2>Default route for Profile Page</h2>} />
            </Routes>
        </div>
    )
}

export default ProfilePage
