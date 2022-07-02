import React from 'react'
import { useState } from 'react'

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

import { ReactComponent as ArtworkLogin } from '../../../../Assets/undraw_login.svg';

import './Login.css';

function Login({ API_BASE_URL, gotoSignup, closeModal, setUserId }) {

    // USE STATE HOOK

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    let [requestLoading, setRequestLoading] = useState(false);
    let [requestResponse, setRequestResponse] = useState("");

    // HELPER FUNCTIONS

    // Login Submit Handler

    let handleLoginSubmit = (e) => {
        e.preventDefault();
        request_login();
    }

    // Login Request Handler

    let request_login = () => {

        setRequestLoading(true);

        let user_auth = {
            email,
            password
        };

        axios.post(`${API_BASE_URL}/user/login`, user_auth, { withCredentials: true })
            .then(res => {

                setRequestLoading(false);
                let { data } = res;

                if (data.error != "" && data.error != null) {
                    // SOME ERROR OCCURED
                    setRequestResponse(data.error);
                } else if (data.action != "" && data.action != null) {
                    // LOGIN SUCCESSFULL
                    setRequestResponse(data.action);
                    setUserId(data.user_id);
                } else {
                    // SOMETHING ELSE HAPPENED HAHA
                }
            });

    };

    return (
        <div className="login-modal modal">

            <span className="modal-close-button" onClick={closeModal}>+</span>
            <div className="form-container">
                <form onSubmit={handleLoginSubmit}>
                    <div className="form-title">
                        {/* <FontAwesomeIcon icon={faSignInAlt} className="icon" /> */}
                        <ArtworkLogin className="artwork" />
                        <h2 className="title">Log in</h2>
                    </div>
                    <label htmlFor="login_email_input" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder='Type your email here..'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="login_password_input" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder='Type your password here..'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <input type="submit" className="form-input form-submit" value={!requestLoading ? "Log in" : "--"} disabled={requestLoading} />

                    <p className="login-response">
                        {
                            requestLoading
                                ? "Loading.."
                                : requestResponse != ""
                                    ? requestResponse
                                    : ""
                        }
                    </p>
                    <p className="new-account" onClick={gotoSignup}>Create new account here</p>
                </form>
            </div>

        </div>
    )
}

export default Login