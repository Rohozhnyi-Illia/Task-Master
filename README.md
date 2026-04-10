# TaskMaster Frontend

Frontend for **TaskMaster** — a production-like task management application with real-world authentication flows, state management, and user-centric testing.
Built to simulate a real SaaS product, including JWT auth, notifications, analytics, and integration-tested user flows.

![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-Jest%20%2B%20RTL-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Yes-blue)

## Live Demo

You can try the application using a demo account:

- Email: demo@taskmaster.app
- Password: Demo1234

_No email verification required for this account._
<a href="https://taskmaster.ink/" target="_blank"> <img src="https://img.shields.io/badge/demo-online-brightgreen" alt="Demo"> </a>

---

## Preview

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

## Links

[![API for UI](https://img.shields.io/badge/API-backend-blue)](https://github.com/Rohozhnyi-Illia/TaskMaster-backend)

---

## Key Features

- **Authentication & Security:** JWT login, refresh tokens, protected routes, email verification (except demo account)
- **Task Management:** create, update, delete, complete tasks; drag-and-drop ordering; filtering, sorting, pagination
- **Notifications:** deadlines, reminders, read/unread management
- **Analytics Dashboard:** task completion statistics with **Chart.js**
- **UX/UI:** dark/light mode, responsive, global loaders, toast notifications, form validation

---

## Technologies

- **Frontend:** React, TypeScript, Redux Toolkit, React Router, SCSS, Chart.js
- **Backend:** Node.js, Express, JWT Authentication, REST API
- **HTTP / API:** Axios with interceptors
- **Testing:** Jest + React Testing Library
- **Drag & Drop:** react-beautiful-dnd
- **Validation:** Yup
- **Code Quality:** ESLint, Prettier

---

## Testing & Quality

> Tests are written from a user perspective, focusing on behavior rather than implementation details.

- Unit and component testing with **Jest** and **React Testing Library**
- Integration testing focused on **real user flows**
- Tests simulate real user behavior (clicks, typing, navigation)

### User Flow Testing

Covered end-to-end-like scenarios:

- Authentication flow (login → redirect → protected routes)
- Task management (create → update → complete → delete)
- Notifications (fetch → mark as read → delete)

### Test Coverage

```bash
Statements   : 85.63%
Branches     : 76.10%
Functions    : 84.03%
Lines        : 85.10%
```

### Highlights

- Integration tests cover **critical business flows**
- Acts as lightweight **end-to-end testing without full E2E setup**
- High coverage across UI, pages, and validation logic

---

## Architecture Notes

- All components, pages, and services have been migrated to TypeScript.
- Organized by feature: each page has its own folder with components and styles, plus shared components for cross-page reuse
- API logic isolated in services layer
- Centralized UI feedback system (loaders, error modals, success toasts)
- JWT authentication with automatic token refresh
- UI state separated from business data in Redux
- ESLint + Prettier ensure consistent and clean code

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
  - update `src/services/api.ts`

## Scripts

```bash
npm start             # start dev server
npm run build         # build for production
npm run analyze       # analyze bundle size
npm run lint          # run ESLint
npm run lint:fix      # fix lint issues
npm run format        # format code with Prettier
npm test              # run tests
npm run test:coverage # generate coverage report
```

---

## Pages

- **Login** — user authentication
- **SignUp** — create a new account
- **VerifyEmail** — enter verification code sent to email after registration
- **UpdatePassword** — request password reset (only email required)
- **VerifyPassword** — confirm code and set a new password
- **Application** — main dashboard with tasks and notifications
- **StatsPage** — overview of completed tasks
- **NotificationsPage** — shows messages about upcoming deadlines and overdue tasks
- **NotFound** — 404 Not Found page for invalid routes

## API Services

Frontend communicates with the backend via Axios services.

### AuthService

- register({ email, password, name }) — register a new user
- login({ email, password }) — login
- logout() — logout
- updatePassword({ email }) — request password reset (sends verification code)
- verifyEmail({ email, verifyCode }) — verify email after registration
- reVerifyEmail(email) — resend verification email
- verifyPassword({ email, newPassword, repeatPassword, verifyCode }) — confirm new password with code

### TaskService

- getAllTasks() — get all tasks
- createTask({ task, status, category, deadline, remainingTime }) — create a new task
- completeTask(id) — complete the task
- deleteTasks(id) — delete a task
- updateStatus(id, status) — update task status
- updateCategory(id, category) — update task category
- reorderTasks(orderedIds) — persist new task order after drag & drop

### NotificationService

- getUserNotifications() — get user notifications
- markAsRead(id) — mark a notification as read
- deleteNotification(id) — delete a notification
- deleteReadNotifications() — delete read notifications
- deleteAllNotifications() — delete all notifications

---

## Full Features Details

- **Authentication & Security:** JWT (access + refresh), protected routes, email verification
- **Task Management:** full CRUD, drag & drop ordering, filtering, sorting, pagination
- **Notifications:** reminders, deadlines, and overdue alerts, read, delete

### UX & UI

- Global loaders and error modals
- **Global success notifications (toast system)**
- Optimistic UI updates
- Dark / light theme toggle
- Responsive design for mobile and desktop
- Consistent layout with shared Header component for all main pages (excluding auth pages)
- Validation of forms, deadlines, and data
- 404 Not Found page
- Custom favicon, app branding, and custom domain setup
- Drag & drop provides intuitive task organization

### Code Quality

- ESLint + Prettier setup for consistent code style and formatting
- Linting and formatting integrated in development workflow

## Notes

- Project migrated from JavaScript to **TypeScript** for type safety and maintainability
- Added email verification for registration and password recovery
- Backend must be running for frontend to function correctly
- Pagination improves performance on task-heavy dashboards
- Success toasts provide user feedback for completed actions

## Author

Illia Rohozhnyi
