import React from 'react'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import "./FollowingsList.css";

function FollowingsList({ fetchId, closeModal }) {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';

    // USE EFFECT HOOK

    useEffect(() => {
        requestFollowingsData();
    }, [fetchId]);

    // USE STATE HOOK

    let [followingsList, setFollowingsList] = useState([]);

    // REQUEST FOLLOWERS DATA

    let requestFollowingsData = () => {
        getFollowingsData(fetchId);
    }

    // GET FOLLOWERS DATA

    let getFollowingsData = (id) => {
        axios.get(`${API_BASE_URL}/follow/user/all-followings/?user_id=${id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setFollowingsList(res.data.result);
                    console.log(res.data);
                } else {
                    console.log(res.data.error);
                }

            });
    }

    return (
        <div className="modal">

            <span className="modal-close-button" onClick={() => { closeModal() }}>+</span>

            <div className="followings-modal-content">
                <div className="modal-header">
                    <FontAwesomeIcon icon={faUser} className="header-icon" />
                    <h2 className="header-title">Followings List</h2>
                </div>
                <div className="modal-list">
                    {
                        followingsList.length == 0 ?
                            <div className="no-followers-message">
                                <p>No Followings</p>
                            </div>
                            :
                            followingsList.map((follower, key) => (
                                <Link to={"/profile/" + follower.followed.id} className="list-item" key={key}>
                                    <div className="item-avatar">
                                        <img className="avatar-img" src={
                                            follower.followed.photo != null ?
                                                `${API_BASE_URL}/user/photo/?filename=${follower.followed.photo}` : EMPTY_AVATAR_URL
                                        } alt="User Avatar" />
                                    </div>
                                    <div className="item-content">
                                        <p className="item-name">{follower.followed.firstName + ' ' + follower.followed.lastName}</p>
                                        <p className="item-date">Followed at: {follower.createdAt.slice(0, follower.createdAt.length - 8)}</p>
                                    </div>
                                </Link>
                            ))
                    }
                </div>
            </div>

        </div>
    )
}

export default FollowingsList