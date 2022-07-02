import React from 'react'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'

import "./NewProjectDetails.css";

function NewProjectDetails({ project_id, closeModal }) {

    // CONST

    const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
    const API_BASE_URL = 'http://localhost:8081/api';
    let navigate = useNavigate();

    // USE EFFECT HOOK

    useEffect(() => {
    }, []);

    // USE STATE HOOK

    let [projectRequirements, setProjectRequirements] = useState("");
    let [projectContributers, setProjectContributers] = useState("");
    let [projectGoals, setProjectGoals] = useState("");
    let [projectTags, setProjectTags] = useState("");

    // HANDLE FORM SUBMIT

    let handleFormSubmit = (e) => {
        e.preventDefault();

        let form_data = {
            project: {
                id: project_id
            },
            requirementsList: projectRequirements.split(";"),
            goalsList: projectGoals.split(";"),
            tagsList: projectTags.split(";"),
            contributersList: projectContributers.split(";"),
        };

        console.log(form_data);

        requestAddNewProjectDetails(form_data);
    }

    // REQUEST ADD NEW PROJECT

    let requestAddNewProjectDetails = (form_data) => {

        axios.post(`${API_BASE_URL}/project-details/new`, form_data, { withCredentials: true })
            .then(res => {

                let status = res.data.status;

                if (status == "1") {
                    let project = res.data.details.project;
                    navigate("/project/" + project.id);
                    window.location.reload(false);
                } else {
                    console.log(res.data.error);
                }
            });

    };

    return (
        <div className="new-details-container">

            <span className="modal-close-button" onClick={closeModal}>+</span>

            <div className="new-details-content">

                <form className="new-details-form" onSubmit={(e) => { handleFormSubmit(e) }}>

                    <h2 className="form-title">Add Project Details</h2>

                    <div className="form-box">
                        <p className="form-label">Project requirements</p>
                        <input type="text" value={projectRequirements} onChange={(e) => { setProjectRequirements(e.target.value) }} className="form-input" required />
                    </div>

                    <div className="form-box">
                        <p className="form-label">Project goals</p>
                        <input type="text" value={projectGoals} onChange={(e) => { setProjectGoals(e.target.value) }} className="form-input" required />
                    </div>

                    <div className="form-box">
                        <p className="form-label">Project contributers</p>
                        <input type="text" value={projectContributers} onChange={(e) => { setProjectContributers(e.target.value) }} className="form-input" required />
                    </div>

                    <div className="form-box">
                        <p className="form-label">Project tags</p>
                        <input type="text" value={projectTags} onChange={(e) => { setProjectTags(e.target.value) }} className="form-input" required />
                    </div>

                    <div className="form-box">
                        <input type="submit" className="form-input" value="Add project details" />
                    </div>

                </form>

            </div>

        </div>
    )
}

export default NewProjectDetails