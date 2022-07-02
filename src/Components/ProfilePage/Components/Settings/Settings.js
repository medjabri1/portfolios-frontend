import React from 'react'

import { useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, faCamera } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

import "./Settings.css";

function Settings({ loggedUserId }) {

    // CONSTS
    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';

    // USE STATE HOOK

    // TEMPLATE STATES
    let [displayChangeInfos, setDisplayChangeInfos] = useState(true);
    let [displayChangePassword, setDisplayChangePassword] = useState(true);
    let [displayChangeAvatar, setDisplayChangeAvatar] = useState(true);

    // USER DATA STATES

    // FORM STATES
    let [formLastName, setFormLastName] = useState("");
    let [formFirstName, setFormFirstName] = useState("");
    let [formEmail, setFormEmail] = useState("");
    let [formBirthDate, setFormBirthDate] = useState("");
    let [formPictureURL, setFormPictureURL] = useState("");

    let [formCurrentPassword, setFormCurrentPassword] = useState("");
    let [formNewPassword, setFormNewPassword] = useState("");
    let [formConfirmPassword, setFormConfirmPassword] = useState("");

    let [formAvatarResponse, setFormAvatarResponse] = useState("");
    let [formInfosResponse, setFormInfosResponse] = useState("");
    let [formPasswordResponse, setFormPasswordResponse] = useState("");

    let [tmpAvatar, setTmpAvatar] = useState(null);

    // REFs
    const avatarInput = useRef(null);

    // USE EFFECT HOOK
    useEffect(() => {
        document.title = "Profile - Settings"
    }, []);

    useEffect(() => {
        getProfileData(loggedUserId);
    }, [loggedUserId]);

    // GET PROFILE DATA

    let getProfileData = (loggedUserId) => {
        axios.get(`${API_BASE_URL}/user/id/?id=${loggedUserId}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                let user = res.data.user;

                if (status == "1") {
                    setFormLastName(user.lastName);
                    setFormFirstName(user.firstName);
                    setFormEmail(user.email);
                    setFormBirthDate(user.birthDate);
                    if (user.photo != null) {
                        setFormPictureURL(`${API_BASE_URL}/user/photo/?filename=${user.photo}`)
                    } else {
                        setFormPictureURL("");
                    }
                    console.clear();
                } else {
                    console.log(res.data.error);
                }
            });
    }

    // CHANGE AVATAR CLICK

    let changeAvatarClick = (e) => {
        avatarInput.current.click();
    }

    // Handle forms submit

    let changeAvatarSubmit = (e) => {

        e.preventDefault();

        let formData = new FormData();
        formData.append("image", avatarInput.current.files[0]);

        requestUpdatedAvatar(formData);
    }

    let changeInfosSubmit = (e) => {
        e.preventDefault();

        let new_user_data = {
            id: loggedUserId,
            firstName: formFirstName,
            lastName: formLastName,
            email: formEmail,
            birthDate: formBirthDate
        }

        requestUpdateInfos(new_user_data);
    }

    let changePasswordSubmit = (e) => {
        e.preventDefault();

        if (formNewPassword == formConfirmPassword) {

            let request_data = {
                id: loggedUserId,
                currentPassword: formCurrentPassword,
                newPassword: formNewPassword
            }

            requestUpdatePassword(request_data);

        } else {
            setFormPasswordResponse("CONFIRMATION DOESN'T MATCH WITH NEW PASSWORD")
        }

    };

    // Request update avatar

    let requestUpdatedAvatar = (formData) => {

        axios.post(
            `${API_BASE_URL}/user/update/photo/?id=${loggedUserId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        )
            .then(res => {

                let status = res.data.status;

                console.log(res.data);

                if (status == "1") {
                    setFormAvatarResponse("USER AVATAR UPDATED");
                } else {
                    setFormAvatarResponse(res.data.error);
                }
            });

    }

    // Request update user infos

    let requestUpdateInfos = (user_data) => {

        axios.put(`${API_BASE_URL}/user/update`, { ...user_data, withCredentials: true })
            .then(res => {

                let status = res.data.status;
                let user = res.data.user;

                if (status == "1") {
                    setFormInfosResponse("USER DATA UPDATED");
                    getProfileData(loggedUserId);
                } else {
                    setFormInfosResponse(res.data.error);
                }
            });
    };

    // Request update user password

    let requestUpdatePassword = (request_data) => {

        axios.put(`${API_BASE_URL}/user/update/password`, { ...request_data, withCredentials: true })
            .then(res => {

                let status = res.data.status;
                let user = res.data.user;

                if (status == "1") {
                    setFormPasswordResponse("USER PASSWORD UPDATED");
                    setFormCurrentPassword("");
                    setFormNewPassword("");
                    setFormConfirmPassword("");
                } else {
                    setFormPasswordResponse(res.data.error);
                }
            });
    };

    return (
        <div className="settings-container">
            <div className="settings-content">

                {/* Page title */}
                <h2 className="settings-title">Profile settings</h2>

                {/* Personal infos section */}
                <div className="settings-section avatar">
                    <h2 className="section-title">Update avatar</h2>
                    <span className="drop-down" onClick={() => { setDisplayChangeAvatar(!displayChangeAvatar) }}>
                        <FontAwesomeIcon
                            icon={displayChangeAvatar ? faCaretDown : faCaretRight}
                            className="icon"
                        />
                    </span>

                    {
                        displayChangeAvatar ?

                            <form className="form" onSubmit={changeAvatarSubmit}>

                                <input
                                    type="file"
                                    name="user_avatar"
                                    accept="image/png, image/jpg, image/jpeg"
                                    ref={avatarInput}
                                    onChange={(e) => {
                                        // setFormPictureURL(window.URL.createObjectURL(e.files[0]));
                                        setFormPictureURL(window.URL.createObjectURL(e.target.files[0]))
                                    }}
                                    hidden
                                />

                                <div className="avatar-box">
                                    <img className="user-avatar" src={formPictureURL != "" ? formPictureURL : EMPTY_AVATAR_URL} alt="Profile avatar" />
                                    <div className="overlay" onClick={changeAvatarClick}>
                                        <FontAwesomeIcon
                                            icon={faCamera}
                                            className="icon"
                                        />
                                    </div>
                                </div>

                                <div className="form-item">
                                    <input
                                        type="submit"
                                        className="form-input submit"
                                        value="Update"
                                    />
                                </div>

                                <p className="request-response">
                                    {formAvatarResponse}
                                </p>

                            </form>
                            : null
                    }

                </div>

                {/* Personal infos section */}
                <div className="settings-section personal-infos">
                    <h2 className="section-title">Update personal Infos</h2>
                    <span className="drop-down" onClick={() => { setDisplayChangeInfos(!displayChangeInfos) }}>
                        <FontAwesomeIcon
                            icon={displayChangeInfos ? faCaretDown : faCaretRight}
                            className="icon"
                        />
                    </span>

                    {
                        displayChangeInfos ?

                            <form className="form" onSubmit={changeInfosSubmit}>
                                <div className="form-box">
                                    <div className="form-item">
                                        <label htmlFor="settings_form_last_name" className="form-label">Last name</label>
                                        <input
                                            id="settings_form_last_name"
                                            type="text"
                                            value={formLastName}
                                            onChange={(e) => { setFormLastName(e.target.value) }}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-item">
                                        <label htmlFor="settings_form_first_name" className="form-label">First name</label>
                                        <input
                                            id="settings_form_first_name"
                                            type="text"
                                            value={formFirstName}
                                            onChange={(e) => { setFormFirstName(e.target.value) }}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>


                                <div className="form-box">
                                    <div className="form-item">
                                        <label htmlFor="settings_form_email" className="form-label">Email</label>
                                        <input
                                            id="settings_form_email"
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => { setFormEmail(e.target.value) }}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-item">
                                        <label htmlFor="settings_form_birth_date" className="form-label">Birth date</label>
                                        <input
                                            id="settings_form_birth_date"
                                            type="Date"
                                            value={formBirthDate}
                                            onChange={(e) => { setFormBirthDate(e.target.value) }}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-box">
                                    <div className="form-item">
                                        <input
                                            type="reset"
                                            className="form-input submit reset"
                                            value="Reset"
                                            onClick={() => { getProfileData(loggedUserId) }}
                                        />
                                    </div>

                                    <div className="form-item">
                                        <input
                                            type="submit"
                                            className="form-input submit"
                                            value="Update"
                                        />
                                    </div>
                                </div>

                                <p className="request-response">
                                    {formInfosResponse}
                                </p>

                            </form>
                            : null
                    }
                </div>

                {/* Password section */}
                <div className="settings-section password">
                    <h2 className="section-title">Update password</h2>
                    <span className="drop-down" onClick={() => { setDisplayChangePassword(!displayChangePassword) }}>
                        <FontAwesomeIcon
                            icon={displayChangePassword ? faCaretDown : faCaretRight}
                            className="icon"
                        />
                    </span>

                    {
                        displayChangePassword ?

                            <form className="form" onSubmit={changePasswordSubmit}>
                                <div className="form-item">
                                    <label htmlFor="settings_form_current_password" className="form-label">Current password</label>
                                    <input
                                        id="settings_form_current_password"
                                        type="password"
                                        value={formCurrentPassword}
                                        onChange={(e) => { setFormCurrentPassword(e.target.value) }}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-box">
                                    <div className="form-item">
                                        <label htmlFor="settings_form_new_password" className="form-label">New password</label>
                                        <input
                                            id="settings_form_new_password"
                                            type="password"
                                            value={formNewPassword}
                                            onChange={(e) => { setFormNewPassword(e.target.value) }}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-item">
                                        <label htmlFor="settings_form_confirm_password" className="form-label">Confirm new password</label>
                                        <input
                                            id="settings_form_confirm_password"
                                            type="password"
                                            value={formConfirmPassword}
                                            onChange={(e) => { setFormConfirmPassword(e.target.value) }}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-item">
                                    <input
                                        type="submit"
                                        className="form-input submit"
                                        value="Update"
                                    />
                                </div>

                                <p className="request-response">
                                    {formPasswordResponse}
                                </p>

                            </form>
                            : null
                    }
                </div>

            </div>
        </div>
    )
}

export default Settings
