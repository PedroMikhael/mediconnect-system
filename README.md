# Mediconnect System - Frontend

This repository contains the **frontend** implementation of the Mediconnect System, a platform designed to manage medical consultations between doctors and patients. This project was developed as part of an academic assignment and is tightly integrated with a RESTful backend service.

## Overview

The application provides a user-friendly interface for both doctors and patients. It enables scheduling, managing, and reviewing consultations. The interface dynamically interacts with the backend using HTTP requests and renders updated information based on user actions.

> ⚠️ **Note:** This project requires the backend to be running. Make sure the [Medical Clinic Backend](https://github.com/PedroMikhael/medical-clinic-spring-api) is properly configured and running before using the frontend.

## Features

- Patient and doctor login.
- Medical consultation scheduling with support for waiting lists.
- Viewing upcoming and past appointments.
- Doctors can complete consultations with notes and prescriptions.
- Patients can rate and review doctors after consultations.
- Filter doctors by specialty, name, and accepted health plans.
- Responsive and modern UI.

## Technology Stack

- **Framework:** React
- **Language:** TypeScript (with some JavaScript)
- **API Communication:** REST via fetch/axios

## Installation and Setup

1. **Install dependencies** (only required once)
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   ```text
   http://localhost:3000
   ```

> Make sure your backend API is running on the expected base URL (http://localhost:8080). Adjust the environment variables if needed.

## Backend

The backend is required for full functionality. You can find it at:  
**[Medical Clinic System - Backend](https://github.com/PedroMikhael/medical-clinic-spring-api)**

## Contributors

This project was developed and maintained by:

- **Pedro Mikhael**  
- **Victor Araujo**
