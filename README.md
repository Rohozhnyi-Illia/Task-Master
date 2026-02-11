# TaskMaster Frontend

_Login Page_
![Login](./src/assets/preview/Login.jpg)

_Main Dashboard_
![Application](./src/assets/preview/Application.jpg)

_Dark Theme_
![Application Dark](./src/assets/preview/Application-dark.jpg)

_Statistics Page_
![Statistics](./src/assets/preview/Statistics.jpg)

_Notifications Page_
![Notifications](./src/assets/preview/Notifications.jpg)

Frontend application for **TaskMaster** — a task management platform with deadlines, notifications, and user authentication.  
Designed and implemented with a focus on real-world authentication flows, state management, and user experience.

## Links

[![Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://taskmaster.ink/)  
[![API for UI](https://img.shields.io/badge/API-backend-blue)](https://github.com/Rohozhnyi-Illia/TaskMaster-backend)

## Features

### Authentication & Security

- User registration and login with JWT authentication
- **Email verification after registration**
- **Password recovery with email verification**
- JWT-based access and refresh tokens
- Automatic token refresh via Axios interceptors
- **Protected routes:** private pages are guarded via `ProtectPath` component; non-authenticated users are redirected to login

### Tasks & Dashboard

- Task management: create, update, complete, and delete tasks
- Task sorting and filtering by category and keywords
- Pagination for large task lists
- Statistics page with completed tasks overview

### Notifications

- Task reminders, deadlines, and overdue alerts
- **Notifications page with user messages**
- Mark notifications as read or delete them

### UX & UI

- Global loaders and error modals
- **Global success notifications (toast system)**
- Optimistic UI updates
- Dark / light theme toggle
- Responsive design for mobile and desktop
- Consistent layout with shared Header component for all main pages (excluding auth pages)
- Validation of forms, deadlines, and data
- Custom favicon, app branding, and custom domain setup

---

## Technologies

- **Frontend:** React 18, Redux Toolkit, React Router, SCSS, Webpack
- **HTTP / API:** Axios with interceptors
- **Validation:** Yup

---

## Architecture Notes

- Organized by feature: each page has its own folder with components and styles, plus shared components for cross-page reuse
- API logic isolated in services layer
- Centralized UI feedback system (loaders, error modals, success toasts)
- JWT authentication with automatic token refresh
- UI state separated from business data in Redux

---

## Installation

```bash
git clone https://github.com/Rohozhnyi-Illia/Task-Master.git
cd Task-Master
npm install
```

## Running

```bash
npm start # development mode
npm run build # production build
```

- Default frontend URL: `http://localhost:3000`
- By default, the frontend uses the deployed backend: `https://taskmaster-backend-e940.onrender.com/api`
- To use a local backend:
  - run it on `http://localhost:9000`
  - update `src/services/api.js`

## Pages

- **Login** — user authentication
- **SignUp** — create a new account
- **VerifyEmail** — enter verification code sent to email after registration
- **UpdatePassword** — request password reset (only email required)
- **VerifyPassword** — confirm code and set a new password
- **Application** — main dashboard with tasks and notifications
- **StatsPage** — overview of completed tasks
- **NotificationsPage** — shows messages about upcoming deadlines and overdue tasks

## API Services

Frontend communicates with TaskMaster-Backend through Axios services:

## AuthService

- register({ email, password, name }) — register a new user
- login({ email, password }) — login
- logout() — logout
- updatePassword({ email }) — request password reset (sends verification code)
- verifyEmail({ email, verifyCode }) — verify email after registration
- reVerifyEmail(email) — resend verification email
- verifyPassword({ email, newPassword, repeatPassword, verifyCode }) — confirm new password with code

## TaskService

- getAllTasks() — get all tasks
- createTask({ task, status, category, deadline, remainingTime }) — create a new task
- completeTask(id) - complete the task
- deleteTasks(id) — delete a task
- updateStatus(id, status) — update task status

## NotificationService

- getUserNotifications() — get user notifications
- markAsRead(id) — mark a notification as read
- deleteNotification(id) — delete a notification
- deleteReadNotifications() - delete read notifications
- deleteAllNotifications() - delete all notifications

## Notes

- Added email verification for registration and password recovery
- Backend must be running for frontend to function correctly
- Pagination improves performance on task-heavy dashboards
- Success toasts provide user feedback for completed actions

## Author

Illia Rohozhnyi
