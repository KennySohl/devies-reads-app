export interface Book {
  id: string;
  name: string;
  genre: string;
  coverUrl: string;
  description: string;
  averageRating: number;
  haveRead: number;
  currentlyReading: number;
  wantToRead: number;
  userRating?: number;
}

export interface AddBookRequest {
  name: string;
  genre: string;
  coverUrl: string;
  description: string;
}

export interface RateBookRequest {
  bookId: string;
  rating: number;
}

export interface User {
  id: string;
  username: string;
  shelf: ShelfItem[];
}

export interface ShelfItem {
  bookId: string;
  status: "haveRead" | "currentlyReading" | "wantToRead";
}

export interface AddShelfItemRequest {
  bookId: string;
  status: "haveRead" | "currentlyReading" | "wantToRead";
}

export interface UpdateShelfItemRequest {
  status: "haveRead" | "currentlyReading" | "wantToRead";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}

// UI Types
export type SortOption = "name" | "rating" | "mostRead";
