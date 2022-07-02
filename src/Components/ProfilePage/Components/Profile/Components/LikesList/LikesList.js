import React from 'react'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import "./LikesList.css";

function LikesList({ fetchId, closeModal }) {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';

    // USE EFFECT HOOK

    useEffect(() => {
        requestLikesData();
    }, [fetchId]);

    // USE STATE HOOK

    let [likesList, setLikesList] = useState([]);

    // REQUEST FOLLOWERS DATA

    let requestLikesData = () => {
        getLikesData(fetchId);
    }

    // GET FAVORITES DATA

    let getLikesData = (id) => {
        axios.get(`${API_BASE_URL}/like/user/?user_id=${id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setLikesList(res.data.result);
                } else {
                    console.log(res.data.error);
                }

            });
    }

    return (
        <div className="modal">

            <span className="modal-close-button" onClick={() => { closeModal() }}>+</span>

            <div className="likes-modal-content">
                <div className="modal-header">
                    <FontAwesomeIcon icon={faUser} className="header-icon" />
                    <h2 className="header-title">Likes List</h2>
                </div>
                <div className="modal-list">
                    {
                        likesList.length == 0 ?
                            <div className="no-favorites-message">
                                <p>No Favorites</p>
                            </div>
                            :
                            likesList.map((like, key) => (
                                <Link to={"/project/" + like.project.id} target="_blank" className="list-item" key={key}>
                                    <div className="item-avatar">
                                        {/* <img className="avatar-img" src={
                                            like.user.photo != null ?
                                                `${API_BASE_URL}/user/photo/?filename=${like.user.photo}` : EMPTY_AVATAR_URL
                                        } alt="User Avatar" /> */}
                                        <img className="avatar-img" src="https://images.pexels.com/photos/69432/pexels-photo-69432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User Avatar" />
                                    </div>
                                    <div className="item-content">
                                        <p className="item-name">{like.project.name}</p>
                                        <Link className="item-author" to={"/profile/" + like.project.owner.id} target="_blank">
                                            By: {like.project.owner.firstName + ' ' + like.project.owner.lastName}
                                        </Link>
                                        <p className="item-date">Added at: {like.createdAt.slice(0, like.createdAt.length - 3)}</p>
                                    </div>
                                </Link>
                            ))
                    }
                    {
                        likesList.length == 0 ?
                            <div className="no-favorites-message">
                                <p>No Favorites</p>
                            </div>
                            :
                            likesList.map((like, key) => (
                                <Link to={"/project/" + like.project.id} target="_blank" className="list-item" key={key}>
                                    <div className="item-avatar">
                                        {/* <img className="avatar-img" src={
                                            like.user.photo != null ?
                                                `${API_BASE_URL}/user/photo/?filename=${like.user.photo}` : EMPTY_AVATAR_URL
                                        } alt="User Avatar" /> */}
                                        <img className="avatar-img" src="https://images.pexels.com/photos/69432/pexels-photo-69432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User Avatar" />
                                    </div>
                                    <div className="item-content">
                                        <p className="item-name">{like.project.name}</p>
                                        <Link className="item-author" to={"/profile/" + like.project.owner.id} target="_blank">
                                            By: {like.project.owner.firstName + ' ' + like.project.owner.lastName}
                                        </Link>
                                        <p className="item-date">Added at: {like.createdAt.slice(0, like.createdAt.length - 3)}</p>
                                    </div>
                                </Link>
                            ))
                    }
                </div>
            </div>

        </div>
    )
}

export default LikesList