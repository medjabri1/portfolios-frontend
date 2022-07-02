import React from 'react'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import "./Home.css";

function Home({ loggedUserId }) {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';

    // USE EFFECT HOOK

    useEffect(() => {
        document.title = "Portfolios - Home Page"
        getAllProjects(loggedUserId);
    }, []);

    let [projectsList, setProjectsList] = useState([]);

    // USE STATE HOOK

    // HANDLE FILTER CLICK

    let requestFilterData = (e) => {

        let optionsDom = document.querySelectorAll(".browse-section .filter-option-item");
        optionsDom.forEach(option => {
            option.classList.remove("active");
        });

        e.target.classList.add("active");
        let filter = e.target.dataset.filter;

        if (filter.toLowerCase() == "all") {
            getAllProjects(loggedUserId);
        } else if (filter.toLowerCase() == "following") {
            getFollowingsProjects(loggedUserId);
        }

    };

    // GET PROJECTS FROM ALL 

    let getAllProjects = (id) => {

        axios.get(`${API_BASE_URL}/project/all-projects/`, { withCredentials: true })
            .then(res => {
                setProjectsList(res.data.reverse());
            });
    };

    // GET PROJECTS FROM FOLLOWINGS ONLY

    let getFollowingsProjects = (id) => {

        axios.get(`${API_BASE_URL}/project/user/following/?user_id=${loggedUserId}`, { withCredentials: true })
            .then(res => {

                let status = res.data.status;

                if (status == "1") {
                    setProjectsList(res.data.result);
                } else {
                    console.log(res.data.error);
                }

            });

    };

    return (
        <div className="home-container">
            <div className="home-content">

                {/* NEW PROJECT SECTION */}

                {/* <h2 className="home-title"></h2> */}

                <div className="home-actions">
                    <Link className="action-item" to="/project/new">
                        <FontAwesomeIcon icon={faPlus} className="action-icon" />
                        <span className="action-title">Post new project</span>
                    </Link>
                </div>


                {/* BROWSE SECTION */}

                <h2 className="home-title">Browse Projects</h2>

                <div className="browse-section">

                    <div className="filter-section">
                        <div className="filter-options">
                            <span className="filter-option-item active" data-filter="all" onClick={(e) => { requestFilterData(e) }}>All</span>
                            <span className="filter-option-item" data-filter="following" onClick={(e) => { requestFilterData(e) }}>Only Followings</span>
                        </div>
                    </div>

                    <div className="projects-list">

                        {
                            projectsList.length == 0 ?
                                <div className="no-projects-message">
                                    <p>No projects</p>
                                </div>
                                :
                                projectsList.map((project, key) => (

                                    <Link className="project-item" to={"/project/" + project.id} target="_blank" key={key}>
                                        <div className="project-cover">
                                            <img className="image" src="https://images.pexels.com/photos/69432/pexels-photo-69432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Project cover" />
                                        </div>
                                        <div className="project-infos">
                                            <h2 className="project-title">{project.name}</h2>
                                            <h4 className="project-author">By: {project.owner.firstName + ' ' + project.owner.lastName}</h4>
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

            </div>
        </div>
    )
}

export default Home