import React from 'react'
import { useState } from 'react'

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

import { ReactComponent as ArtworkSignup } from '../../../../Assets/undraw_add_user.svg';

import './Signup.css';

function Signup({ API_BASE_URL, gotoLogin, closeModal }) {

    // USE STATE HOOK

    let [lastName, setLastName] = useState("");
    let [firstName, setFirstName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [birthDate, setBirthDate] = useState("");

    let [requestLoading, setRequestLoading] = useState(false);
    let [requestResponse, setRequestResponse] = useState("");

    // HELPER FUNCTIONS

    // Signup Submit Handler

    let handleSignupSubmit = (e) => {
        e.preventDefault();
        request_signup();
    }

    // Signup Request Handler

    let request_signup = () => {

        setRequestLoading(true);

        let user_data = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "birthDate": birthDate
        };

        axios.post(`${API_BASE_URL}/user/signup`, user_data, { withCredentials: true })
            .then(res => {

                let { data } = res;

                console.log(data);

                if (data.error != "" && data.error != null) {
                    // SOME ERROR OCCURED
                    setRequestLoading(false);
                    setRequestResponse(data.error);
                } else if (data.action != "" && data.action != null) {
                    // Signup SUCCESSFULL
                    // setRequestLoading(false);
                    setRequestResponse(data.action);
                } else {
                    // SOMETHING ELSE HAPPENED HAHA
                }
            });

    };

    return (
        <div className="signup-modal modal">
            <span className="modal-close-button" onClick={closeModal}>+</span>
            <div className="form-container">
                <form onSubmit={handleSignupSubmit}>
                    <div className="form-title">
                        <ArtworkSignup className="artwork" />
                        <h2 className="title">Sign up</h2>
                    </div>

                    <div className="form-input-box">
                        <div className="form-input-box-item">
                            <label htmlFor="signup_l_name_input" className="form-label">Last name</label>
                            <input
                                id="signup_l_name_input"
                                type="text"
                                className="form-input"
                                placeholder='Last name'
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-input-box-item">
                            <label htmlFor="signup_f_name_input" className="form-label">First name</label>
                            <input
                                id="signup_f_name_input"
                                type="text"
                                className="form-input"
                                placeholder='First name'
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor="signup_email_input" className="form-label">Email</label>
                    <input
                        id="signup_email_input"
                        type="email"
                        className="form-input"
                        placeholder='Type your email here..'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="signup_password_input" className="form-label">Password</label>
                    <input
                        id="signup_password_input"
                        type="password"
                        className="form-input"
                        placeholder='Type your password here..'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <label htmlFor="signup_birth_date_input" className="form-label">Birth Date</label>
                    <input
                        id="signup_birth_date_input"
                        type="date"
                        className="form-input"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                        required
                    />

                    <input type="submit" className="form-input form-submit" value={!requestLoading ? "Sign up" : "--"} disabled={requestLoading} />

                    <p className="signup-response">
                        {
                            requestLoading
                                ? "Loading.."
                                : requestResponse != ""
                                    ? requestResponse
                                    : ""
                        }
                    </p>
                    <p className="have-account" onClick={gotoLogin}>Have an account ? Log in here</p>
                </form>
            </div >
        </div >
    )
}

export default Signup
