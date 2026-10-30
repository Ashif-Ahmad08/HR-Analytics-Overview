# Khana Khazana – HR Analytics Dashboard

**A Smart, Interactive Human Resource Management & Analytics System**

## 1. Project Overview

The **Khana Khazana HR Analytics Dashboard** is a browser-based Human Resource Management (HRM) prototype developed for Khana Khazana, a vegetarian restaurant located in Phagwara, Punjab. The application provides a centralized platform for monitoring workforce information, managing recruitment activities, tracking employee training, reviewing performance, and analyzing attendance.

The dashboard is designed to simplify HR operations by presenting essential workforce information through interactive visualizations, analytical reports, and user-friendly management tools.

Developed using **HTML5, CSS3, and JavaScript**, the application offers a responsive interface that operates directly in modern web browsers without requiring a complex installation or build process.

## 2. Dashboard Overview

The dashboard provides a consolidated overview of the organization's sample workforce data and key HR performance indicators.

**Key Performance Indicators (KPIs):**

- **Total Employees:** 24
- **Departments:** 6
- **Planned Recruitment:** 2 additional employees
- **Staff Efficiency:** 78%
- **Training Compliance:** 92%
- **Attendance Rate:** 94%
- **HR Challenges:** 3 requiring attention

Interactive charts and graphical representations help users understand workforce distribution, employee categories, staffing requirements, and organizational performance.

*Note: All figures and employee records are illustrative demonstration data and do not represent actual business information.*

## 3. Core Modules and Features

### 3.1 Overview Dashboard
Provides a centralized summary of important HR metrics through KPI cards, analytical charts, and visual reports.

Key features:
- Total employee statistics.
- Department-wise workforce distribution.
- Recruitment requirements.
- Employee efficiency indicators.
- Training compliance monitoring.
- Attendance summaries.
- HR challenges overview.

### 3.2 Workforce Planning
Helps HR managers evaluate workforce requirements and identify potential staffing gaps across departments.

Key features:
- Current versus required employee strength.
- Department-wise workforce analysis.
- Staffing gap identification.
- Workforce distribution visualization.
- Future recruitment planning.

### 3.3 Recruitment Management
Provides a structured interface for monitoring recruitment activities and managing potential candidates.

Key features:
- Candidate tracking system.
- Recruitment analytics.
- Candidate information management.
- Interactive candidate registration form.
- Hiring progress monitoring.

### 3.4 Employee Training Tracker
Monitors employee training activities and evaluates training completion status.

Key features:
- Training program overview.
- Employee training progress.
- Training completion monitoring.
- Training compliance analytics.
- Interactive form for adding training records.

### 3.5 Performance Management
Provides sample employee performance indicators and department-level performance analysis.

Key features:
- Department-wise performance analysis.
- Employee rating visualization.
- Performance distribution charts.
- Performance monitoring indicators.
- Visual representation of organizational efficiency.

### 3.6 Attendance and Leave Management
Provides an overview of employee attendance patterns and leave-related information.

Key features:
- Attendance rate monitoring.
- Leave statistics.
- Attendance visualization.
- Leave request submission form.
- Leave management demonstration workflow.

### 3.7 HR Challenges and Recommendations
Highlights common human resource management challenges and suggests possible approaches to address them.

Key features:
- Identification of HR challenges.
- Workforce-related issue analysis.
- Suggested improvement strategies.
- HR chatbot for answering frequently asked questions.

### 3.8 Profile and User Preferences
Provides a personalized interface where users can manage their account information and dashboard preferences.

Key features:
- View and update profile information.
- Change account password.
- Theme customization.
- Accent color selection.
- Compact layout option.
- Browser-based preference storage.

## 4. Integrated HR Chatbot

The application includes an integrated chatbot designed to answer basic questions related to the sample HR dataset.

The chatbot can provide information about:

- Total employee strength.
- Department distribution.
- Recruitment requirements.
- Training compliance.
- Attendance statistics.
- Employee performance.
- Common HR challenges.

This feature demonstrates how conversational interfaces can improve access to organizational HR information.

## 5. Technology Stack

The application uses standard frontend technologies and external resources to provide an interactive dashboard experience.

| Technology | Purpose |
|---|---|
| HTML5 | Application structure and content |
| CSS3 | Styling, responsive design, and themes |
| JavaScript | Application logic and interactive functionality |
| Chart.js 4.4.0 | Interactive charts and data visualization |
| Google Fonts | Typography using Inter and Playfair Display |
| Local Storage | Browser-based account and preference storage |

## 6. Application Architecture

The application follows a lightweight frontend architecture consisting of three primary components:

**Presentation Layer – HTML**
- Login and registration interfaces.
- Dashboard navigation.
- HR management modules.
- Forms and chart containers.

**Design Layer – CSS**
- Responsive dashboard layout.
- Sidebar and navigation styling.
- KPI cards and data visualization layouts.
- Theme and appearance customization.

**Application Logic Layer – JavaScript**
- Navigation and page interactions.
- Demonstration authentication.
- Profile and preference management.
- Chart rendering.
- Recruitment, training, and leave form interactions.
- Chatbot functionality.

## 7. Installation and Execution

The application does not require any package installation, backend configuration, or build process.

**Step 1:** Download or clone the project repository.

**Step 2:** Extract the project files into a local directory.

**Step 3:** Open the project directory in Visual Studio Code or another code editor.

**Step 4:** Run the application using either of the following methods.

**Method 1: Direct Browser Execution**

Open `index.html` in a modern web browser.

**Method 2: Localhost Execution (Recommended)**

Open the terminal inside the project directory and execute:

```bash
python -m http.server 8000
```

Open the following address in your browser:

```text
http://localhost:8000
```

Using localhost or HTTPS is recommended for compatibility with browser cryptography APIs used during account registration.

## 8. Demo Login Credentials

The application includes predefined demonstration accounts for testing different user roles.

| User Role | Username | Password |
|---|---|---|
| HR Manager | admin | admin123 |
| HR Analyst | ashif | staff2026 |

Users can also create a new account through the registration interface. Newly created accounts are stored locally in the browser.

*Security Notice: These credentials are public demonstration credentials and must not be used for real accounts or sensitive information.*

## 9. Project Directory Structure

The project consists of the following essential files:

| File Name | Description |
|---|---|
| `index.html` | Login interface, dashboard structure, navigation, forms, and chart containers |
| `style.css` | Dashboard styling, responsive layouts, themes, and visual components |
| `app.js` | Authentication, navigation, chart rendering, forms, profile management, and chatbot logic |
| `logo.png` | Application logo and branding asset |

## 10. Data Storage and Security

The current application is designed as a frontend demonstration rather than a production-ready HR management platform.

Its implementation has the following characteristics:

- No backend server or centralized database is integrated.
- Authentication is handled through client-side JavaScript.
- Demo credentials are accessible within the frontend source code.
- Newly registered accounts are stored in browser Local Storage.
- Newly created passwords are hashed in the browser.
- Employee, recruitment, training, performance, and attendance records are illustrative.
- Browser storage is limited to the current browser profile and may be cleared.

**Important:** Client-side authentication and browser storage are not sufficient for protecting real employee information. A production-ready implementation would require secure server-side authentication, database integration, role-based access control, encrypted data handling, audit logs, and appropriate privacy safeguards.

## 11. Future Enhancements

The following improvements could transform the prototype into a more comprehensive HR management solution:

1. **Backend Integration:** Implement Node.js and Express.js for server-side application logic.
2. **Database Management:** Integrate MongoDB or MySQL for centralized employee records.
3. **Secure Authentication:** Introduce JWT-based authentication and role-based access control.
4. **Advanced Analytics:** Add real-time workforce analytics and automated HR reports.
5. **Payroll Management:** Introduce employee salary and payroll processing.
6. **Automated Notifications:** Implement email notifications for recruitment, attendance, and training updates.
7. **Advanced Chatbot:** Integrate an AI-powered assistant for more advanced HR queries.
8. **Data Export:** Enable downloading HR reports in PDF and Excel formats.

## 12. Conclusion

The **Khana Khazana HR Analytics Dashboard** demonstrates how modern web technologies can be used to simplify and improve human resource management activities.

By integrating workforce planning, recruitment, employee training, performance monitoring, attendance tracking, and HR analytics into a single interface, the project provides a practical demonstration of a centralized HR management solution.

The project also establishes a foundation for future development through backend integration, database connectivity, secure authentication, and advanced analytics.

**Project Category:** Human Resource Management System (HRM)

**Application Type:** Web-Based Dashboard Prototype

**Development Technologies:** HTML5, CSS3, JavaScript

**Target Organization:** Khana Khazana, Phagwara, Punjab