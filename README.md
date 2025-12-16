AI Content Creation Platform

An AI-powered web application designed to help users plan, generate, edit, and manage content efficiently. The platform provides project-based content creation, an in-browser editor, authentication, and a personalized dashboard for managing AI-generated content.

🚀 Features

🔐 User Authentication (Login & Signup)

📊 Dashboard to manage content projects

📁 Project-based Content Organization

✍️ AI Content Editor for creating and editing content

🔒 Protected Routes for secure access

⚙️ User Settings Management

🌐 Responsive and user-friendly UI

🛠️ Tech Stack

Frontend: React + TypeScript

Build Tool: Vite 

index

Routing: React Router DOM 

App

State Management: React Context API

Styling: Tailwind CSS (or custom CSS)

Authentication: Context-based session handling

📂 Project Structure
src/
├── components/
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Project.tsx
│   ├── Editor.tsx
│   └── Settings.tsx
├── App.tsx
├── main.tsx

⚙️ Installation & Setup
Prerequisites

Node.js (v16+ recommended)

npm or yarn

Steps
# Clone the repository

# Navigate to the project folder
cd ai-content-creation

# Install dependencies
npm install

# Start development server
npm run dev


The app will run at:

http://localhost:5173

🔐 Authentication Flow

Unauthenticated users are redirected to the Auth page

Authenticated users can access:

Dashboard

Projects

Editor

Settings

Routes are protected using a custom ProtectedRoute component

🧠 How It Works

User logs in or registers

Dashboard displays all projects

Each project contains AI-generated content

Editor allows creation and modification of content

Settings page lets users manage preferences

📈 Future Enhancements

🤖 Integration with AI APIs (OpenAI, Gemini, etc.)

📤 Export content as PDF / DOCX

🗂️ Content templates

🌓 Dark mode support

👥 Collaboration features

📜 License

This project is licensed under the MIT License.

👩‍💻 Author

Ravikiran C
BE Student | Aspiring Web Developer
Bangalore, India

check it on--" https://6940404f7a649900c7c68a54--aicontentcreation.netlify.app/ "
