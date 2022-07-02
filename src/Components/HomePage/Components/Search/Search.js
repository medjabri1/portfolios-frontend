import React from 'react'

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'

import "./Search.css";

function Search() {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';

    // USE STATE HOOK

    let [searchProjectName, setSearchProjectName] = useState("");
    let [projectsList, setProjectsList] = useState([]);

    // USE EFFECT HOOK

    useEffect(() => {
        // getProjects();
    }, []);

    // useEffect(() => {

    // }, [projectsList]);

    // LET HANDLE SUBMIT

    let handleSubmit = (e) => {
        e.preventDefault();
        getProjects();
    };

    // GET PROJECTS

    let getProjects = () => {

        axios.get(`${API_BASE_URL}/project/all-projects/`, { withCredentials: true })
            .then(res => {
                setProjectsList(res.data);
                let filtered = res.data.filter((project) => {
                    if (project.name.toLowerCase().includes(searchProjectName.toLowerCase())) {
                        return project;
                    }
                });
                setProjectsList(filtered);
            });

    };

    return (
        <div>
            <div className="search-container">

                <div className="search-content">

                    <div className="search-header">
                        <form className="search-form" onSubmit={(e) => { handleSubmit(e) }}>
                            <div className="form-box">
                                <p className="form-label">Project name</p>
                                <input className="form-input" type="text" value={searchProjectName} onChange={(e) => { setSearchProjectName(e.target.value) }} required />
                            </div>

                            <div className="form-box">
                                <input className="form-input" type="submit" value="Search" />
                            </div>
                        </form>
                    </div>

                    <div className="search-result">

                        <span className="result-count">{projectsList.length} projects</span>

                        <div className="result-list">
                            {
                                projectsList.map((project, key) => (

                                    < Link to={"/project/" + project.id} className="project-item" target="_blank" key={key}>
                                        <div className="project-name">{project.name}</div>
                                        <Link to={"/profile/" + project.owner.id} target="_blank" className="project-author">By: {project.owner.firstName + ' ' + project.owner.lastName}</Link>
                                        <div className="project-description">{project.description.slice(0, 20)}..</div>
                                        <div className="project-date">Added at: {project.createdAt.slice(0, project.createdAt.length - 8)}</div>
                                    </Link>

                                ))
                            }
                        </div>

                    </div>

                </div>

            </div>
        </div >
    )
}

export default Search