import React from 'react'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faHeart, faBookmark } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import "./Project.css";

import NewProjectDetails from '../NewProjectDetails/NewProjectDetails';

function Project({ loggedUserId }) {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';
    let project_id = useParams().id;
    let navigate = useNavigate();

    // USE EFFECT HOOK

    useEffect(() => {

        document.title = "Portfolios - Project Page"
        getProjectData();
        getProjectDetails();

        if (loggedUserId != 0) {
            checkLikeProject();
            checkFavoriteProject();
        }

        getProjectStats();

    }, [, project_id]);

    useEffect(() => {

        checkLikeProject();
        checkFavoriteProject();

    }, [, loggedUserId]);

    // USE STATE HOOK

    let [projectData, setProjectData] = useState({
        name: '',
        owner: { firstName: '', lastName: '', id: 0 },
        description: '',
        createdAt: ''
    });
    let [projectDetails, setProjectDetails] = useState({
        contributersList: [],
        tagsList: [],
        requirementsList: [],
        goalsList: []
    });

    let [projectHasDetails, setProjectHasDetails] = useState(false);
    let [displayDetailsForm, setDisplayDetailsForm] = useState(false);

    let [projectLiked, setProjectLiked] = useState(false);
    let [projectFavorited, setProjectFavorited] = useState(false);

    let [likeCount, setLikeCount] = useState(0);
    let [favoriteCount, setFavoriteCount] = useState(0);

    // GET PROJECT DATA

    let getProjectData = () => {

        axios.get(`${API_BASE_URL}/project/id/?id=${project_id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;

                if (status == "1") {
                    setProjectData(res.data.project);
                } else {
                    console.log(res.data.error);
                }
            });

    };

    // GET PROJECT DETAILS

    let getProjectDetails = () => {

        axios.get(`${API_BASE_URL}/project-details/project/?project_id=${project_id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;

                if (status == "1") {
                    setProjectDetails(res.data.details);
                    setProjectHasDetails(true);
                } else {
                    console.log(res.data.error);
                    setProjectHasDetails(false);
                }
            });

    };

    let closeModal = () => {
        setDisplayDetailsForm(false);
    };

    // GET PROJECT STATS

    let getProjectStats = () => {

        axios.get(`${API_BASE_URL}/project/stats/?id=${project_id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setLikeCount(res.data.likes);
                    setFavoriteCount(res.data.favorites);
                } else {
                    console.log(res.data.error);
                }
            });

    };

    // CHECK USER LIKE PROJECT

    let checkLikeProject = () => {

        axios.get(`${API_BASE_URL}/like/exist/?project_id=${project_id}&user_id=${loggedUserId}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setProjectLiked(true);
                } else {
                    setProjectLiked(false);
                }
            });

    };

    // CHECK USER FAVORITE PROJECT

    let checkFavoriteProject = () => {

        axios.get(`${API_BASE_URL}/favorite/exist/?project_id=${project_id}&user_id=${loggedUserId}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setProjectFavorited(true);
                } else {
                    setProjectFavorited(false);
                }
            });

    };

    // HANDLE LIKE CLICK

    let handleLikeClick = () => {
        if (projectLiked) {
            requestUnlikeProject();
        } else {
            requestLikeProject();
        }
    };

    // REQUEST LIKE PROJECT

    let requestLikeProject = () => {

        let new_request_data = {
            project: {
                id: project_id
            },
            user: {
                id: loggedUserId
            }
        }

        axios.post(`${API_BASE_URL}/like/new/`, new_request_data, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setProjectLiked(true);
                } else {
                    setProjectLiked(false);
                }

                getProjectStats();

            });

    };

    // REQUEST UNLIKE PROJECT

    let requestUnlikeProject = () => {

        axios.delete(`${API_BASE_URL}/like/delete-user-like/?user_id=${loggedUserId}&project_id=${project_id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setProjectLiked(false);
                } else {
                    setProjectLiked(true);
                }

                getProjectStats();

            });

    };

    // HANDLE FAVORITE CLICK

    let handleFavoriteClick = () => {
        if (projectFavorited) {
            requestUnfavoriteProject();
        } else {
            requestFavoriteProject();
        }
    };

    // REQUEST FAVORITE PROJECT

    let requestFavoriteProject = () => {

        let new_request_data = {
            project: {
                id: project_id
            },
            user: {
                id: loggedUserId
            }
        }

        axios.post(`${API_BASE_URL}/favorite/new/`, new_request_data, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setProjectFavorited(true);
                } else {
                    setProjectFavorited(false);
                }

                getProjectStats();

            });

    };

    // REQUEST UNFAVORITE PROJECT

    let requestUnfavoriteProject = () => {

        axios.delete(`${API_BASE_URL}/favorite/delete-user-favorite/?user_id=${loggedUserId}&project_id=${project_id}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;
                if (status == "1") {
                    setProjectFavorited(false);
                } else {
                    setProjectFavorited(true);
                }

                getProjectStats();

            });

    };

    return (
        <div className="project-container">

            {/* DETAILS FORM MODAL */}

            {
                displayDetailsForm && projectData.owner.id == loggedUserId ?
                    <NewProjectDetails project_id={project_id} closeModal={closeModal} />
                    : null
            }

            <div className="project-content">

                <div className="project-header">
                    <div className="header-cover">
                        <img className="cover-img" src="https://images.pexels.com/photos/69432/pexels-photo-69432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Project cover" />
                        <div className="cover-overlay"></div>
                    </div>
                    <div className="header-content">
                        <h1 className="project-title">{projectData.name}</h1>
                        <p className="project-date">Added at: {projectData.createdAt.slice(0, projectData.createdAt.length - 8)}</p>
                        <Link to={"/profile/" + projectData.owner.id} target="_blank" className="project-author">By: {projectData.owner.firstName + ' ' + projectData.owner.lastName}</Link>
                        <p className="project-description">{projectData.description}</p>
                    </div>

                    <div className="like-count">
                        <FontAwesomeIcon
                            onClick={() => { handleLikeClick() }}
                            icon={faHeart} className={projectLiked ? "like-icon liked" : "like-icon"} />
                        <span className="count-value">{likeCount}</span>
                    </div>

                    <div className="favorite-count">
                        <FontAwesomeIcon
                            onClick={() => { handleFavoriteClick() }}
                            icon={faBookmark} className={projectFavorited ? "favorite-icon favorited" : "favorite-icon"} />
                        <span className="count-value">{favoriteCount}</span>
                    </div>

                </div>

                {/* ADD PROJECT DETAILS */}

                {
                    !projectHasDetails ?
                        <div className="project-actions">
                            <div className="action-item" onClick={() => { setDisplayDetailsForm(true) }}>
                                <FontAwesomeIcon icon={faPlus} className="action-icon" />
                                <span className="action-title">Add Project Details</span>
                            </div>
                        </div>
                        : null
                }

                <div className="project-body">

                    <div className="body-section">
                        <span className="section-title">Requierements ({projectDetails.requirementsList.length})</span>
                        <ul className="section-content">
                            {
                                projectDetails.requirementsList.map((req, key) => (
                                    <li key={key}>{req}</li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className="body-section">
                        <span className="section-title">Goals ({projectDetails.goalsList.length})</span>
                        <ul className="section-content">
                            {
                                projectDetails.goalsList.map((goal, key) => (
                                    <li key={key}>{goal}</li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className="body-section">
                        <span className="section-title">Contributers ({projectDetails.contributersList.length})</span>
                        <ul className="section-content">
                            {
                                projectDetails.contributersList.map((contri, key) => (
                                    <li key={key}>{contri}</li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className="body-section">
                        <span className="section-title">Tags ({projectDetails.tagsList.length})</span>
                        <ul className="section-content">
                            {
                                projectDetails.tagsList.map((tag, key) => (
                                    <li key={key}>{tag}</li>
                                ))
                            }
                        </ul>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Project