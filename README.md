# Gym Membership Management Web Application
A web application built with Vue.js (frontend), Bootstrap (styling), Express.js (backend), and SQLite (database).

##  Overview
This assignment project is a gym membership management system created as part of the Final Assignment.  
The application is dynamic, data-driven, fully validated, and demonstrates full CRUD capabilities.

##  Project folder Structure

Jim Xiao Wang Final Assignment/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── gymdb.sqlite
├── frontend/
│   ├── index.html
│   ├── app.js
├── docs/
│   └── database screenshot files
└── README.md


# Features
- Add, view, edit, and delete member records
- Bulk delete using checkboxes
- Purple-themed UI with Bootstrap
- Full validation (email, phone, required fields)
- SQLite database persistence
- Vue.js dynamic rendering
- Express.js REST API backend

## User Stories
- As an admin, I can create new membership applications  
- As an admin, I can view all members  
- As an admin, I can edit existing records  
- As an admin, I can delete members  
- As an admin, I can bulk-delete selected members  
- As an admin, I can receive validation messages for errors  

##  Running Locally

### Backend

cd into backend folder 
run npm install
run npm start


### Frontend
User can open index.html using Live Server in VS Code.

##  API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/members | Fetch all members |
| POST | /api/members | Add a new member |
| PUT | /api/members/:id | Update existing member |
| DELETE | /api/members/:id | Delete member |

##  Database Screenshot
Check the Docs folder for DB screenshots.

Frameworks and technologies used
- Vue.js  
- Bootstrap  
- Axios  
- Express.js  
- SQLite3  
- Git & GitHub  


 
- Framework usage → Vue + Bootstrap  
- Source control → Multiple commits  
- Functional URL → GitHub repo folder link: https://github.com/gsd1214/jim-xiao-wang-final-assignment/
- Backend deployed URL link: https://jim-xiao-wang-final-assignment.onrender.com (this is the backend main link, use this link to start the service)
- Backend URL for members table: https://jim-xiao-wang-final-assignment.onrender.com/api/members (this is the link to the members table)
(Service will reboot/sleep after 15min because I am using render free tier, but it auto - trigger the service once link is clicked and everything should work.)
- Frontend deployed URL link: lambent-gecko-9c26e1.netlify.app (Use this link to run the app, click to start the backend first.)
- CRUD functionality → Fully implemented  
- User experience → Colored UI, validation, polished styles.


