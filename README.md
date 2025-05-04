# Financial Management System

A comprehensive financial management system built with Next.js, featuring loan distribution, savings tracking, bill management, and transaction history.

## Tech Stack

- **Framework**: Next.js 15.3.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Form Handling**: React Hook Form with Zod
- **State Management**: React Context
- **Charts**: Recharts

## Project Structure

```
src/
├── app/                    # Application routes and pages
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── dashboard/    # Dashboard data endpoints
│   │   ├── loans/        # Loan-related endpoints
│   │   ├── savings/      # Savings-related endpoints
│   │   ├── bills/        # Bill-related endpoints
│   │   └── transactions/ # Transaction-related endpoints
│   ├── dashboard/         # Protected dashboard routes
│   └── unauthorized/      # Unauthorized access pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── admin/            # Admin-specific components
│   ├── loan-distributor/ # Loan distribution components
│   ├── bills/            # Bill management components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── loans/            # Loan-related components
│   ├── savings/          # Savings-related components
│   └── transactions/     # Transaction components
├── contexts/             # React context providers
├── lib/                  # Utility functions
├── models/               # Database models
├── services/            # Business logic and API services
└── types/               # TypeScript type definitions
```

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access control
  - JWT-based authentication

- **Loan Management**
  - Loan application and approval
  - Loan distribution system
  - Loan tracking and history

- **Savings Management**
  - Savings account creation
  - Deposit and withdrawal tracking
  - Interest calculation

- **Bill Management**
  - Bill creation and tracking
  - Payment scheduling
  - Bill history

- **Transaction Management**
  - Transaction recording
  - Transaction history
  - Transaction categorization

- **Dashboard**
  - Financial overview
  - Quick access to features
  - Data visualization

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- The project uses Turbopack for faster development builds
- ESLint is configured for code quality
- TypeScript for type safety
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
