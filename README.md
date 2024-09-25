# Recruitment Web Application (FYP)

## Overview

This is a MERN-based Recruitment Web Application for our Final Year Project designed to streamline the hiring process by connecting companies with potential candidates. The platform offers various features for both companies and candidates to facilitate job postings, applications, interviews, and assessments.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Group Members](#group-members)

## Features

- **Company Account Creation and Management**: Companies can create accounts to manage their recruitment process.
- **Candidate Registration and Profile Creation**: Candidates can register and build profiles to showcase their qualifications.
- **CV Creation**: Candidates can create and manage their CVs through the platform.
- **Job Posting and Management**: Companies can post jobs and manage them effectively.
- **Job Searching**: Candidates can search for jobs based on their preferences.
- **Test Creation and Management**: Companies can create coding assessments for candidates.
- **Report Generation**: Generate reports on specific candidates tests.
- **Interview Scheduling**: Schedule interviews with candidates through the platform.
- **Video Interviewing**: Conduct video interviews directly within the application.
- **Communication System**: Facilitate communication between companies and candidates.
- **User Feedback and Ratings**: Users can provide feedback and ratings on their experiences.
- **Payment Gateway**: Manage payments for services rendered through the platform.

## Technologies Used

- **Frontend**: HTML, CSS, JS, React.js
- **Backend**: Node.js, Express.js, MongoDB
- **Others**: WebRTC

## Folder Structure

```
client
├── public
├── src
│ ├── assets
│ ├── components
│ ├── scripts
│ └── pages
│     ├── Candidate Pages
│     └── Company Pages
server
├── controllers
├── middleware
├── models
├── routes
└── uploads
```

## Installation

This project uses Vite. Follow these steps to set up the project locally:

### Prerequisites

- Node.js (latest)
- MongoDB (set up locally, preferbally with MongoDBCompass)
- VS Code (Or any other editor of choice)

### Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/asadali29/fyp-recruitment-web-app.git
    cd fyp-recruitment-web-app
    ```
2.  **Navigate to the server directory and install dependencies**:
    ```bash
    cd server
    npm install
    ```
3.  **Set up environment variables**:
    Create a `.env` file in the `server` folder with the following content:

    ```bash
    JWT_SECRET=your-jwt-secret
    ```

4.  **Navigate to the client directory and install dependencies**:
    ```bash
    cd client
    npm install
    ```
5.  **Start the server**:
    ```bash
    cd server
    npm start
    ```
6.  **Start the client**:
    ```bash
    cd client
    npm run dev
    ```

## API Endpoints

### Authentication

- **POST** `/register`  
  Registers a new user (Company or Candidate) with the required details.

- **POST** `/login`  
  Authenticates a user and returns a JWT token.

### Contact

- **POST** `/contact`  
  Sends a contact email with the provided details.

### Dashboard

- **GET** `/dashboard`  
  Retrieves user information.

- **PUT** `/dashboard`  
  Updates user data including profile picture.

- **GET** `/user-profile`  
  Fetches the updated user profile information.

### CV Management

- **POST** `/create-cv`  
  Creates a new CV for the user.

- **GET** `/check-cv`  
  Checks if the user has a CV.

- **GET** `/cv/:userId`  
  Fetches CV data by user ID.

### Job Management

- **POST** `/create-job-posts`  
  Creates a new job post.

- **GET** `/job-posts`  
  Retrieves all jobs posted by the logged-in company user.

- **DELETE** `/job-posts/:id`  
  Deletes a job post by ID.

- **PUT** `/job-posts/:id`  
  Updates a job post.

- **GET** `/job-details/:id`  
  Fetches job details by ID.

- **POST** `/job-details/apply`  
  Handles job applications.

### Interview Management

- **POST** `/schedule-interview`  
  Schedules a new interview.

- **PATCH** `/update-interview`  
  Updates interview details.

- **PATCH** `/reschedule-interview`  
  Reschedules an existing interview.

- **GET** `/candidate-interviews`  
  Fetches interviews for the logged-in candidate.

- **GET** `/interview-details/:jobId/:userId`  
  Fetches specific interview details.

- **GET** `/company-interviews`  
  Retrieves interviews scheduled for the logged-in company.

### Test Management

- **POST** `/create-test`  
  Creates a new test.

- **DELETE** `/tests/:id`  
  Deletes a test by ID.

- **POST** `/assign-test`  
  Assigns a test to candidates.

- **GET** `/candidate-test/:candidateId`  
  Retrieves tests assigned to a specific candidate.

- **GET** `/candidate-test-details/:candidateId`  
  Fetches details of a specific test for a candidate.

- **POST** `/evaluate-test`  
  Evaluates a candidate's test submission.

- **GET** `/tests`  
  Retrieves all tests available.

### Reporting

- **GET** `/generate-report/:candidateId/:testId`  
  Generates a report for a specific candidate's test.

## Group Members

- Asad Ali
- Obaid Ul Haq Khan

### University

- SZABIST University Karachi (Final Year Project 2024)
