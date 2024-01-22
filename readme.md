# Equitrack - Stock Market Monitoring Web Service
## Introduction

Equitrack is a web service designed to provide users with real-time stock market quotes and the ability to monitor their selected stocks effortlessly. This Git repository contains the source code and documentation for the Equitrack project.

## Features
- Real-Time Stock Quotes: Stay updated with current stock market prices.
- Stock Monitoring: Select and monitor your favorite stocks with ease.
- User-Friendly Interface: Intuitive design for a seamless user experience.
- Responsive Design: Access Equitrack from various devices.

## Getting Started

To get started with EquiTrack, follow these steps:

1. Clone the Repository:
```sh
 git clone https://github.com/kodditor/equitrack.git
```

2. Navigate to the Backend Directory:
```sh
cd backend
```

3. Install Backend Dependencies:
```sh
go get .
```

4. Run the Backend Service:
```sh
go run .
```

5. Navigate to root directory:
```sh
cd ..
```

6. Navigate to the Frontend Directory:
```sh
cd frontend
```

7. Install Frontend Dependencies:
```sh
npm install
```

8. Run the Frontend Service:
```sh
npm run dev 
```

9. Open in Browser:<br>
Open your web browser and go to http://localhost:3000

## Backend Dependencies
- Gin: Web framework written in Go.
- Finnhub: API for real-time stock market data.

## Frontend Dependencies
- Next.js: React framework for building web applications.
- Tailwind CSS: Utility-first CSS framework.