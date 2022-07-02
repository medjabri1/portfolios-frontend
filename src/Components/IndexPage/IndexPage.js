import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Artwork_1 } from '../../Assets/undraw_art_1.svg';

import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';

import axios from 'axios';

import "./IndexPage.css";

function IndexPage() {

    // CONSTS & VARS 

    const API_BASE_URL = 'http://localhost:8081/api';

    let navigate = useNavigate();

    // USE STATE HOOK

    let [displayLogin, setDisplayLogin] = useState(false);
    let [displaySignup, setDisplaySignup] = useState(false);
    let [displayLoader, setDisplayLoader] = useState(true);
    let [userLogged, setUserLogged] = useState(false);
    let [userId, setUserId] = useState(false);

    // USE EFFECT HOOK

    // Change page title when toggling between login / sign up / index

    useEffect(() => {
        if (displayLogin) {
            document.title = "Portfolios - Login";
        } else if (displaySignup) {
            document.title = "Portfolios - Signup";
        } else {
            document.title = "Portfolios - Index";
        }
    }, [displayLogin, displaySignup]);

    useEffect(() => {
        checkLoginStatus();
        // request_logout();
    }, []);

    useEffect(() => {
        checkLoginStatus();
    }, [userLogged, userId]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setDisplayLoader(false);
    //     }, 1500);
    // }, []);

    // HELPER FUNCTIONS

    // Switch login and signup modals

    let gotoSignupIndex = () => {
        setDisplayLogin(false);
        setDisplaySignup(true);
    };

    let gotoLoginIndex = () => {
        setDisplaySignup(false);
        setDisplayLogin(true);
    };

    // Check log status

    let checkLoginStatus = () => {
        axios.get(`${API_BASE_URL}/user/log-status`, { withCredentials: true })
            .then(res => {
                let user_id = res.data.session_user_id;
                if (user_id != "null") {
                    setUserId(user_id);
                    setUserLogged(true);
                    navigate("/home");
                } else {
                    setUserLogged(false);
                }
                setTimeout(() => {
                    setDisplayLoader(false);
                }, 1500);
            });
    }

    // LOG OUT REQUEST

    let request_logout = () => {

        axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true })
            .then(res => {
                console.log(res.data);
            });

    };

    return (
        <div className="index-page">

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

            {/* HEADER */}

            <div className="header">
                <div className="header-container">
                    <div className="header-logo">Portfolios</div>
                    <ul className="header-nav">
                        <li className="header-nav-link" onClick={() => setDisplaySignup(true)} >Sign Up</li>
                        <li className="header-nav-link" onClick={() => setDisplayLogin(true)} >Log In</li>
                    </ul>
                </div>
            </div>

            {/* SHOWCASE */}

            <div className="showcase">
                <div className="showcase-section center">
                    <Artwork_1 className="showcase-artwork" />
                </div>
                <div className="showcase-section">
                    <h1 className="showcase-slogan">
                        Show your <span>projects</span> to<br /> the world
                    </h1>
                    <p className="showcase-description">
                        Join us now in <span>Portfolios</span> and show your talents to the world by adding your projects here.
                    </p>
                    <div className="showcase-buttons">
                        <span className="showcase-signup-button" onClick={() => setDisplaySignup(true)}>
                            Join Now
                        </span>
                    </div>
                </div>
            </div>

            {/* LOGIN MODAL */}

            {
                displayLogin ?
                    <Login
                        API_BASE_URL={API_BASE_URL}
                        gotoSignup={gotoSignupIndex}
                        closeModal={() => setDisplayLogin(false)}
                        setUserId={(id) => setUserId(id)}
                    />
                    : null
            }

            {/* SIGN UP MODAL */}

            {
                displaySignup ?
                    <Signup
                        API_BASE_URL={API_BASE_URL}
                        gotoLogin={gotoLoginIndex}
                        closeModal={() => setDisplaySignup(false)}
                    /> : null
            }


        </div>
    )
}

export default IndexPage