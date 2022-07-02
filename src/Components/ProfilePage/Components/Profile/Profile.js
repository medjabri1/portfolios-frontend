import React from 'react'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faCog, faFile, faHeart, faBookmark, faUser, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import "./Profile.css";

import FollowersList from "./Components/FollowersList/FollowersList";
import FollowingsList from "./Components/FollowingsList/FollowingsList";
import FavoritesList from "./Components/FavoritesList/FavoritesList";
import LikesList from "./Components/LikesList/LikesList";

function Profile({ loggedUserId }) {

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';
    let profile_id = useParams().id;
    let navigate = useNavigate();

    // Change page title

    useEffect(() => {
        if (profile_id == undefined) {
            setFetchId(loggedUserId);
        } else {
            setFetchId(profile_id);
        }
    }, []);

    useEffect(() => {

        requestProfileData();
        requestProfileStats();
        requestUserProjects();
        closeModal();

    }, [useParams().id]);

    useEffect(() => {
        if (profile_id != undefined) {
            checkUserFollowed();
        }
    }, [loggedUserId, profile_id]);

    useEffect(() => {
        document.title = "Portfolios - Profile Page"
        requestProfileData();
        requestProfileStats();
        requestUserProjects();
    }, [, loggedUserId]);

    // Use State Hook

    let [currentUser, setCurrentUser] = useState(true);
    let [currentUserName, setCurrentUserName] = useState("Full name");
    let [currentUserEmail, setCurrentUserEmail] = useState("Email address");
    let [currentUserPhone, setCurrentUserPhone] = useState("Phone number");
    let [currentUserAge, setCurrentUserAge] = useState(0);
    let [currentUserPictureURL, setCurrentUserPictureURL] = useState("");
    let [currentUserCreatedAt, setCurrentUserCreatedAt] = useState("");

    let [fetchId, setFetchId] = useState(loggedUserId);

    let [userProjects, setUserProjects] = useState([]);
    let [userStats, setUserStats] = useState({ followers: 0, followings: 0, likes: 0, favorites: 0, projects: 0 });

    let [displayFollowersList, setDisplayFollowersList] = useState(false);
    let [displayFollowingsList, setDisplayFollowingsList] = useState(false);
    let [displayFavoritesList, setDisplayFavoritesList] = useState(false);
    let [displayLikesList, setDisplayLikesList] = useState(false);
    let [displayProjectsList, setDisplayProjectsList] = useState(false);

    let [userFollowed, setUserFollowed] = useState(false);

    // Get user profile data 

    let requestProfileData = () => {

        profile_id != undefined && setFetchId(profile_id);

        if (profile_id == undefined || profile_id == loggedUserId) {
            // Profile for logged user
            setCurrentUser(true);
            getProfileData(loggedUserId);
        } else {
            // Profile for another user
            setCurrentUser(false);
            getProfileData(profile_id);
        }
    }

    let getProfileData = (id) => {
        axios.get(`${API_BASE_URL}/user/id/?id=${id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                let user = res.data.user;

                if (status == "1") {
                    setCurrentUserName(user.firstName + " " + user.lastName);
                    setCurrentUserEmail(user.email);
                    setCurrentUserPhone(user.phone);
                    setCurrentUserAge(getAge(user.birthDate));
                    if (user.photo != null) {
                        setCurrentUserPictureURL(`${API_BASE_URL}/user/photo/?filename=${user.photo}`)
                    } else {
                        setCurrentUserPictureURL("");
                    }
                    setCurrentUserCreatedAt(user.createdAt);
                } else {
                    console.log(res.data.error);
                }
            });
    }

    let requestProfileStats = () => {
        profile_id != undefined && setFetchId(profile_id);

        if (profile_id == undefined || profile_id == loggedUserId) {
            // Profile for logged user
            setCurrentUser(true);
            getProfileStats(loggedUserId);
        } else {
            // Profile for another user
            setCurrentUser(false);
            getProfileStats(profile_id);
        }
    }

    let getProfileStats = (id) => {
        axios.get(`${API_BASE_URL}/user/stats/?id=${id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setUserStats(res.data);
                } else {
                    console.log(res.data.error);
                }

            });
    }

    let requestUserProjects = () => {

        if (profile_id == undefined || profile_id == loggedUserId) {
            // Profile for logged user
            setCurrentUser(true);
            getUserProjects(loggedUserId);
        } else {
            // Profile for another user
            setCurrentUser(false);
            getUserProjects(profile_id);
        }

    };

    let getUserProjects = (id) => {

        axios.get(`${API_BASE_URL}/project/user/?user_id=${id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setUserProjects(res.data.result);
                } else {
                    console.log(res.data.error);
                }

            });

    }

    // Request log out

    let request_logout = () => {

        axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true })
            .then(res => {
                console.log(res.data);
            });

        setTimeout(() => {
            navigate("/");
        }, 1000);

    };

    // CHECK USER FOLLOWED

    let checkUserFollowed = () => {
        axios.get(`${API_BASE_URL}/follow/exist/?follower_id=${loggedUserId}&followed_id=${profile_id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setUserFollowed(true);
                } else {
                    setUserFollowed(false);
                }

            });
    };

    let handleFollowUnfollowClick = () => {
        if (userFollowed) {
            requestUnfollowUser();
        } else {
            requestFollowUser();
        }
    }

    // REQUEST FOLLOW

    let requestFollowUser = () => {

        let new_request_data = {
            follower: {
                id: loggedUserId
            },
            followed: {
                id: profile_id
            }
        }

        axios.post(`${API_BASE_URL}/follow/new/`, new_request_data, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setUserFollowed(true);
                } else {
                    setUserFollowed(false);
                }

            });
    }

    // REQUEST UNFOLLOW

    let requestUnfollowUser = () => {

        axios.delete(`${API_BASE_URL}/follow/delete-follower-followed/?follower_id=${loggedUserId}&followed_id=${profile_id}`, { withCredentials: true })
            .then(res => {

                setUserFollowed(false);
                console.clear();

            }).finally(() => {
                setUserFollowed(false);
                console.clear();
            });
        console.clear();

    }

    // Calculate age by birth date

    let getAge = (birth_date_string) => {
        var today = new Date();
        var birthDate = new Date(birth_date_string);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // CLOSE MODAL

    let closeModal = () => {
        setDisplayFollowersList(false);
        setDisplayFollowingsList(false);
        setDisplayFavoritesList(false);
        setDisplayLikesList(false);
        setDisplayProjectsList(false);
    }

    // Get Fetch ID

    let getFetchId = () => {
        return fetchId != 0 ? fetchId : loggedUserId;
    }

    return (
        <div className="profile-container">
            <div className="profile-content">

                {/* MODAL COMPONENTS */}
                {
                    displayFollowersList ?
                        <FollowersList
                            fetchId={getFetchId()} closeModal={() => { closeModal() }} /> : null
                }
                {
                    displayFollowingsList ?
                        <FollowingsList
                            fetchId={getFetchId()} closeModal={() => { closeModal() }} /> : null
                }
                {
                    displayFavoritesList ?
                        <FavoritesList
                            fetchId={getFetchId()} closeModal={() => { closeModal() }} /> : null
                }
                {
                    displayLikesList ?
                        <LikesList
                            fetchId={getFetchId()} closeModal={() => { closeModal() }} /> : null
                }

                {
                    currentUser ?
                        <div className="profile-settings">
                            {/* Profile Link */}
                            <Link className="profile-settings-action" to="/profile/settings">
                                <FontAwesomeIcon icon={faCog} className="action-icon" />
                                <span>Settings</span>
                            </Link>

                            {/* Log Out Link */}
                            <div className="profile-settings-action danger" onClick={request_logout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="action-icon" />
                                <span>Log out</span>
                            </div>
                        </div>
                        :
                        <div className="follow-user">
                            <div className={userFollowed ? "follow-action reverse" : "follow-action"} onClick={() => { handleFollowUnfollowClick() }}>
                                <FontAwesomeIcon icon={userFollowed ? faUserMinus : faUserPlus} className="action-icon" />
                                <span>{userFollowed ? "Unfollow User" : "Follow User"}</span>
                            </div>
                        </div>
                }

                {/* ABOUT SECTION */}

                <h2 className="profile-title about-title">About</h2>

                <div className="profile-header">
                    <div className="avatar-box">
                        <img className="user-avatar" src={currentUserPictureURL != "" ? currentUserPictureURL : EMPTY_AVATAR_URL} alt="Profile avatar" />
                    </div>
                    <div className="infos-box">
                        <div className="info-item">
                            <p className="infos-label">Full name</p>
                            <h2 className="infos-data user-full-name">{currentUserName}</h2>
                        </div>
                        <div className="info-item">
                            <p className="infos-label">Email</p>
                            <p className="infos-data">
                                <a href={"mailto:" + currentUserEmail}>{currentUserEmail}</a>
                            </p>
                        </div>
                        <div className="info-item">
                            <p className="infos-label">Age</p>
                            <p className="infos-data">
                                {currentUserAge}
                            </p>
                        </div>
                        <div className="info-item">
                            <p className="infos-label">Joined At</p>
                            <p className="infos-data">
                                {currentUserCreatedAt.slice(0, currentUserCreatedAt.length - 9)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATS SECTION */}

                <h2 className="profile-title stats-title">Profile Stats</h2>

                <div className="profile-stats">

                    <div className="stats-section">

                        <div className="stats-item" onClick={() => { setDisplayFollowersList(true) }}>
                            <div className="item-header">
                                <FontAwesomeIcon icon={faUser} className="item-icon" />
                            </div>
                            <span className="item-content">
                                <span className="item-name">Followers</span>
                                <span className="item-value">{userStats.followers}</span>
                            </span>
                        </div>

                        <div className="stats-item" onClick={() => { setDisplayFollowingsList(true) }}>
                            <div className="item-header">
                                <FontAwesomeIcon icon={faUser} className="item-icon" />
                            </div>
                            <span className="item-content">
                                <span className="item-name">Followings</span>
                                <span className="item-value">{userStats.followings}</span>
                            </span>
                        </div>

                    </div>

                    <div className="stats-section">

                        <div className="stats-item">
                            <div className="item-header">
                                <FontAwesomeIcon icon={faFile} className="item-icon" />
                            </div>
                            <span className="item-content">
                                <span className="item-name">Projects</span>
                                <span className="item-value">{userStats.projects}</span>
                            </span>
                        </div>

                        <div className="stats-item" onClick={() => { setDisplayFavoritesList(true) }}>
                            <div className="item-header">
                                <FontAwesomeIcon icon={faBookmark} className="item-icon" />
                            </div>
                            <span className="item-content">
                                <span className="item-name">Favorites</span>
                                <span className="item-value">{userStats.favorites}</span>
                            </span>
                        </div>

                        <div className="stats-item" onClick={() => { setDisplayLikesList(true) }}>
                            <div className="item-header">
                                <FontAwesomeIcon icon={faHeart} className="item-icon" />
                            </div>
                            <span className="item-content">
                                <span className="item-name">Liked</span>
                                <span className="item-value">{userStats.likes}</span>
                            </span>
                        </div>

                    </div>

                </div>

                {/* PROJECT SECTION */}

                <h2 className="profile-title projects-title">Projects List</h2>

                <div className="profile-projects">

                    {
                        userProjects.length == 0 ?
                            <div className="no-offers-message">
                                <p>No projects</p>
                            </div>
                            :
                            userProjects.map((project, project_index) => (

                                <Link className="project-item" to={"/project/" + project.id} target="_blank" key={project_index}>
                                    <div className="project-cover">
                                        <img className="image" src="https://images.pexels.com/photos/69432/pexels-photo-69432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Project cover" />
                                    </div>
                                    <div className="project-infos">
                                        <h2 className="project-title">{project.name}</h2>
                                        <p className="project-description">
                                            {project.description.slice(0, 50)}..
                                        </p>
                                        <span className="project-created-at">{project.createdAt.slice(0, project.createdAt.length - 8)}</span>
                                    </div>
                                </Link>

                            ))
                    }

                </div>

            </div>
        </div >
    )
}

export default Profile
