import { apiClient } from "./api";
import { Book, AddBookRequest, RateBookRequest } from "@/types";
import { getToken } from "./auth";

// Get all books
export async function getBooks(): Promise<Book[]> {
  const token = getToken();
  return apiClient.get<Book[]>("/books", { token: token || undefined });
}

// Get book by ID
export async function getBookById(id: string): Promise<Book> {
  const token = getToken();
  return apiClient.get<Book>(`/books/${id}`, { token: token || undefined });
}

// Add a new book
export async function addBook(bookData: AddBookRequest): Promise<Book> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required to add a book");
  }

  return apiClient.post<Book>("/books", bookData, { token });
}

// Rate a book
export async function rateBook(bookId: string, rating: number): Promise<Book> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required to rate a book");
  }

  const rateData: RateBookRequest = {
    bookId,
    rating,
  };

  return apiClient.post<Book>(`/books/${bookId}/rate`, rateData, { token });
}
