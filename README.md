# SaveUp

SaveUp is a web application designed to help users track expenses and learn how to save money. The project leverages a **modern tech stack** with a feature-rich frontend and scalable backend.

## Project Overview

### Frontend:
- **Angular 18**: The frontend is built using Angular 18 for a dynamic and responsive user interface.
- **PrimeNG**: Advanced UI components are integrated using PrimeNG.
- **PrimeFlex**: The layout is implemented using PrimeFlex's grid system.
- **Theme Switching & Dark Mode**: Users can toggle between light and dark themes for a personalized experience.

### Backend:
- **Node.js with TypeScript**: The backend API is developed using Node.js and TypeScript for type safety and scalability.
- **Express.js**: Handles API routes and middleware.
- **Passport Authentication**: Secure user authentication with Passport.js.
- **Email Confirmation**: Email verification implemented using Nodemailer.
- **MongoDB Atlas**: A cloud-hosted NoSQL database for data storage.

## Key Features

- **Expense Tracking**: Add, edit, and track your daily expenses.
- **Savings Insights**: Get personalized suggestions on how to save money based on spending habits.
- **Interactive Dashboard**: Visualize expenses with charts and graphs.
- **Secure Authentication**: Includes registration, login, and email confirmation for account activation.
- **Theme Customization**: Switch between light and dark modes.

## Frontend Structure

```plaintext
src
├── app
│   ├── components           # Reusable UI components
│   ├── entities             # TypeScript interfaces and models
│   ├── guards               # Route guards for authentication
│   ├── pages                # Main pages of the application
│   │   ├── auth             # Authentication pages
│   │   │   ├── check-email        # Page to verify email
│   │   │   ├── email-confirmed    # Email confirmation page
│   │   │   ├── login              # Login page
│   │   │   └── register           # Registration page
│   │   ├── dashboard         # Dashboard for expense overview
│   │   ├── not-found         # 404 error page
│   │   ├── profile           # User profile page
│   │   └── settings          # Settings page (theme and preferences)
│   ├── pipes                # Custom pipes for data transformation
│   ├── services             # Services for API communication
│   ├── utils                # General utilities and helpers
│   └── validators           # Validators for form fields
├── app-routing.module.ts    # Application route configuration
├── app.component.html       # Root component template
├── app.component.scss       # Root component styles
├── app.component.spec.ts    # Root component tests
├── app.component.ts         # Root component logic
├── app.module.ts            # Main module of the application
├── index.html               # Main HTML file
├── main.ts                  # Main TypeScript file to bootstrap the app
├── styles.scss              # Global styles
├── variables.scss           # SCSS variables for themes
