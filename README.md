<div align="center">

GCG - GLA Coding Group Website
A full-stack web application built to serve as a central hub for the coding community at GLA University, providing resources, a competitive leaderboard, and project showcases.

Live Site: https://gcg-frontend.vercel.app/ <!-- Replace with your actual live URL -->

</div>

✨ Features
Centralized Resource Hub: A curated collection of resources for Competitive Programming (CP), Data Structures & Algorithms (DSA), and student projects, organized into clear, interactive cards.

Live Leaderboard: A real-time leaderboard where students can submit their LeetCode and CodeChef profiles. The backend automatically scrapes their current contest ratings to calculate a total score and rank them.

Dynamic Content: A modal-based interface for viewing detailed information, creating a smooth and seamless user experience without page reloads.

Community Contribution: Students can submit their own projects to be featured on the site via a Google Form, fostering a collaborative environment.

Modern UI: A sleek, responsive design built with Tailwind CSS, ensuring the website looks great on all devices.

🛠️ Tech Stack
This project is a monorepo containing a separate frontend and backend, built with the MERN stack and other modern technologies.

Category

Technologies

Frontend

React, Vite, Tailwind CSS, React Router DOM

Backend

Node.js, Express, Mongoose, Axios, Cheerio

Deployment

Vercel (Frontend), Render (Backend)

🚀 Getting Started
To run this project on your local machine, follow these steps.

Prerequisites
Node.js (v18 or later recommended)

npm

A MongoDB Atlas account for the database.

1. Clone the Repository
git clone [https://github.com/AyuSharma176/GCG.git](https://github.com/AyuSharma176/GCG.git)
cd GCG

2. Set Up the Backend
The backend server connects to the database and provides the API for the leaderboard.

# Navigate to the backend folder
cd backend_gcg

# Install dependencies
npm install

# Create a .env file in the root of the backend_gcg folder
# and add your MongoDB connection string
echo "MONGO_URI=your_mongodb_connection_string" > .env

# Start the backend server
npm start

The backend server will be running on http://localhost:5000.

3. Set Up the Frontend
The frontend is the React application that users interact with.

# Open a new terminal and navigate to the frontend folder
cd GCG_frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev

The frontend will be running on http://localhost:5173 (or another port if it is busy).

🤝 How to Contribute
We welcome contributions from the community!

Add a Project: If you have a project you'd like to showcase, please fill out our Project Submission Form.

Take the Website Forward: If you are a student at GLA and are interested in maintaining or adding features to this website, please get in touch. See the "Contribute" section on the About page for contact details.
