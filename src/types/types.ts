// Define the User interface
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

// Define the Goal interface
export interface Goal {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
}

// Define the Progress interface
export interface Progress {
  id: string;
  goalId: string;
  date: string;
  value: number;
}


// Define the AuthResponse interface
export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

// Define the ApiError interface
export interface ApiError {
  message: string;
  statusCode: number;
}


// Type alias for the parameters of the login function in AuthContext
export type LoginCredentials = {
    username: string;
    password: string;
};

// Type alias for the parameters of a function that adds or updates a goal
export type GoalData = {
  name: string;
  target: number;
  progress: number;
}

// Type alias for the parameters of a function that adds new progress to a goal
export type ProgressData = {
  date: string;
  value: number;
}