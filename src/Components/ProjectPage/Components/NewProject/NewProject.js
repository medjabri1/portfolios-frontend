import React from 'react'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'

import "./NewProject.css";

function NewProject({ loggedUserId }) {

	// CONST

	const EMPTY_AVATAR_URL = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg';
	const API_BASE_URL = 'http://localhost:8081/api';
	let navigate = useNavigate();

	// USE EFFECT HOOK

	useEffect(() => {
		document.title = "Portfolios - New Project"
	}, []);

	// USE STATE HOOK

	let [projectName, setProjectName] = useState("");
	let [projectDescription, setProjectDescription] = useState("");

	// HANDLE FORM SUBMIT

	let handleFormSubmit = (e) => {
		e.preventDefault();
		let form_data = {
			name: projectName,
			description: projectDescription,
			owner: {
				id: loggedUserId
			}
		}

		requestAddNewProject(form_data);
	}

	// REQUEST ADD NEW PROJECT

	let requestAddNewProject = (form_data) => {

		axios.post(`${API_BASE_URL}/project/new`, form_data, { withCredentials: true })
			.then(res => {

				let status = res.data.status;
				console.log(loggedUserId);

				if (status == "1") {
					let project = res.data.project;
					navigate("/project/" + project.id);
				} else {
					console.log(res.data.error);
				}
			});

	};

	return (
		<div className="new-project-container">

			<div className="new-project-content">

				<form className="new-project-form" onSubmit={(e) => { handleFormSubmit(e) }}>

					<h2 className="form-title">Add new Project</h2>

					<div className="form-box">
						<p className="form-label">Project Name</p>
						<input type="text" value={projectName} onChange={(e) => { setProjectName(e.target.value) }} className="form-input" required />
					</div>

					<div className="form-box">
						<p className="form-label">Project Description</p>
						<textarea className="form-input" rows={10} value={projectDescription} onChange={(e) => { setProjectDescription(e.target.value) }} required />
					</div>

					<div className="form-box">
						<input type="submit" className="form-input" value="Add project" />
					</div>

				</form>

			</div>

		</div>
	)
}

export default NewProject