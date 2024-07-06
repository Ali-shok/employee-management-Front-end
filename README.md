# Leave Management System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction
The Leave Management System is a web application that allows employees to submit leave requests and view their leave balance. The admin can view all leave requests and their statuses.

## Features
- Employees can submit leave requests.
- View available leave balance.
- Display a table of leave requests with the status of each request.
- Requests are ordered from newest to oldest.
- Color-coded status (approved in green, rejected in red).

## Installation

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/leave-management-system.git
    ```
2. Navigate to the project directory:
    ```sh
    cd leave-management-system
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Set up your database and configure the connection in your application.

## Usage
1. Start the server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

### Frontend Code
The frontend is located in the `public` directory and uses HTML, CSS, native JavaScript, and jQuery for dynamic interactions.

### API Endpoints
- **GET /leave/requests/:employeeId**: Fetches leave requests for a specific employee by their ID.
- **POST /leave/requests/:employeeId**: Submits a new leave request for a specific employee.

## Technologies Used
- Node.js
- Express.js
- jQuery
- Bootstrap
- MySQL (or any SQL database)

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
