import React from 'react'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import "./FavoritesList.css";

function FavoritesList({ fetchId, closeModal }) {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';

    // USE EFFECT HOOK

    useEffect(() => {
        requestFavoritesData();
    }, [fetchId]);

    // USE STATE HOOK

    let [favoritesList, setFavoritesList] = useState([]);

    // REQUEST FOLLOWERS DATA

    let requestFavoritesData = () => {
        getFavoritesData(fetchId);
    }

    // GET FAVORITES DATA

    let getFavoritesData = (id) => {
        axios.get(`${API_BASE_URL}/favorite/user/?user_id=${id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setFavoritesList(res.data.result);
                } else {
                    console.log(res.data.error);
                }

            });
    }

    return (
        <div className="modal">

            <span className="modal-close-button" onClick={() => { closeModal() }}>+</span>

            <div className="favorite-modal-content">
                <div className="modal-header">
                    <FontAwesomeIcon icon={faUser} className="header-icon" />
                    <h2 className="header-title">Favorites List</h2>
                </div>
                <div className="modal-list">
                    {
                        favoritesList.length == 0 ?
                            <div className="no-favorites-message">
                                <p>No Favorites</p>
                            </div>
                            :
                            favoritesList.map((favorite, key) => (
                                <Link to={"/project/" + favorite.project.id} target="_blank" className="list-item" key={key}>
                                    <div className="item-avatar">
                                        {/* <img className="avatar-img" src={
                                            favorite.user.photo != null ?
                                                `${API_BASE_URL}/user/photo/?filename=${favorite.user.photo}` : EMPTY_AVATAR_URL
                                        } alt="User Avatar" /> */}
                                        <img className="avatar-img" src="https://images.pexels.com/photos/69432/pexels-photo-69432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User Avatar" />
                                    </div>
                                    <div className="item-content">
                                        <p className="item-name">{favorite.project.name}</p>
                                        <Link className="item-author" to={"/profile/" + favorite.project.owner.id} target="_blank">
                                            By: {favorite.project.owner.firstName + ' ' + favorite.project.owner.lastName}
                                        </Link>
                                        <p className="item-date">Added at: {favorite.createdAt.slice(0, favorite.createdAt.length - 8)}</p>
                                    </div>
                                </Link>
                            ))
                    }
                </div>
            </div>

        </div>
    )
}

export default FavoritesList