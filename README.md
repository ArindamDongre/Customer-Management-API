# Basic NodeJS API Project

This project demonstrates basic NodeJS APIs with MongoDB integration, including endpoints for saving and searching customer data.

## Prerequisites

- Node.js (LTS version)
- MongoDB (Atlas)
- VS Code
- Postman

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ArindamDongre/Project_1.git
   cd Project_1
   ```
2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up MongoDB:**

   * Get your MongoDB connection string from MongoDB Atlas.
   * Update the connection string in server.js.

4. **Run the server:**

   ```sh
    node server.js
   ```

## API Endpoints

1. **/db-save**

   * POST http://localhost:3000/db-save

   * Saves customer data with validations.

   * Request Body:

     ```json
     {
      "customer_name": "arthmate1",
      "dob": "2001-09-19",
      "monthly_income": "1200"
     }
     ```
   * Validations:

         - All parameters required.
         - Age must be above 15.

2. **/time-based-api**

   * POST http://localhost:3000/time-based-api

   * Saves customer data with time-based restrictions.

   * Request Body:

     ```json

     {
      "customer_name": "arthmate2",
      "dob": "2001-09-19",
      "monthly_income": "1200"
     }
     ```
   * Restrictions:

         - Not available on Monday.
         - Not available between 08:00 and 15:00.

3. **/db-search**

   * GET http://localhost:3000/db-search

   * Finds customer names aged between 10 and 25.

   * Response:

         Customer names and API response time.

## Rate Limiting on all API Endpoints

    - Max 1 request per 2 minutes per customer.
    - Max 2 requests per 5 minutes.

## Tools Used

- Node.js
- Express.js
- MongoDB
- Moment.js

## License

    This project is licensed under the MIT License.
