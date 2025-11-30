import { apiClient } from "./api";
import { User, AddShelfItemRequest, UpdateShelfItemRequest } from "@/types";
import { getToken, getUserId } from "./auth";

// Get user data by ID
export async function getUser(userId?: string): Promise<User> {
  const token = getToken();
  const id = userId || getUserId();

  if (!token) {
    throw new Error("Authentication required to get user data");
  }

  if (!id) {
    throw new Error("User ID is required");
  }

  return apiClient.get<User>(`/users/${id}`, { token });
}

// Get current authenticated user
export async function getCurrentUser(): Promise<User> {
  return getUser();
}

// Add a book to user's shelf
export async function addToShelf(
  shelfItem: AddShelfItemRequest
): Promise<User> {
  const token = getToken();
  const userId = getUserId();

  if (!token) {
    throw new Error("Authentication required to add to shelf");
  }

  if (!userId) {
    throw new Error("User ID not found");
  }

  return apiClient.post<User>(`/users/${userId}/shelf`, shelfItem, { token });
}

// Update a shelf item
export async function updateShelfItem(
  bookId: string,
  update: UpdateShelfItemRequest
): Promise<User> {
  const token = getToken();
  const userId = getUserId();

  if (!token) {
    throw new Error("Authentication required to update shelf");
  }

  if (!userId) {
    throw new Error("User ID not found");
  }

  const updateData = {
    bookId,
    ...update,
  };

  return apiClient.put<User>(`/users/${userId}/shelf`, updateData, { token });
}

// Check if a book is in user's shelf
export async function isBookInShelf(bookId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user.shelf.some((item) => item.bookId === bookId);
  } catch {
    return false;
  }
}

// Get shelf status of a specific book
export async function getBookShelfStatus(
  bookId: string
): Promise<"haveRead" | "currentlyReading" | "wantToRead" | null> {
  try {
    const user = await getCurrentUser();
    const shelfItem = user.shelf.find((item) => item.bookId === bookId);
    return shelfItem?.status || null;
  } catch {
    return null;
  }
}
