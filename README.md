# FinWise

## Project Overview
FinWise is a comprehensive personal finance management web application designed to simplify financial operations and provide actionable insights. Developed as part of the **Web Development Project** course, FinWise addresses common challenges faced by users, banks, and financial service providers such as scattered financial data, manual processes, and lack of financial insights.

## Features
- **User Authentication**: Secure login and registration system
- **Transaction Management**: Track and categorize financial transactions
- **Budget Planning**: Create and monitor budgets for different categories
- **Savings Goals**: Set and track progress towards financial goals
- **Bill Management**: Organize and track recurring bills
- **Loan Applications**: Streamlined loan application process
- **Financial Reports**: Generate comprehensive financial reports and insights
- **Dashboard**: Overview of financial health and key metrics

## Tech Stack
### Frontend
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: Next.js App Router
- **UI Components**: Custom components with modern design

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **API**: RESTful API architecture

## Requirements
To run this project, ensure you have the following installed:
1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher)
3. **npm** (v6 or higher)

## Project Structure
```
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── services/     # API service layer
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   └── lib/          # Utility functions
│   │   └── public/           # Static assets
│   └── backend/              # Express.js backend application
│       ├── models/          # MongoDB models
│       ├── routes/          # API routes
│       ├── middleware/      # Express middleware
│       └── app.js           # Main application file
```

## How to Run
Follow these steps to set up and run the project:

1. **Backend Setup**:
   ```sh
   cd backend
   npm install
   node app.js
   ```
   The backend server will run on `http://localhost:5001`

2. **Frontend Setup**:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
   The frontend application will run on `http://localhost:3000`

## Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/finwise
PORT=5001
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## API Documentation
The backend provides the following API endpoints:
- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/transactions` - Financial transactions
- `/api/budgets` - Budget management
- `/api/savings` - Savings goals
- `/api/bills` - Bill management
- `/api/loan-applications` - Loan applications
- `/api/reports` - Financial reports

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.