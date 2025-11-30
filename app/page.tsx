"use client";

import { useState, useEffect } from "react";
import { getBooks } from "@/lib/books";
import { Book, SortOption } from "@/types";
import BookCard from "@/components/BookCard";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);
        setSortedBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  useEffect(() => {
    const sorted = [...books].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "mostRead":
          return b.haveRead - a.haveRead;
        default:
          return 0;
      }
    });
    setSortedBooks(sorted);
  }, [sortBy, books]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl font-bold pt-1">Books</h1>

          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name" className="bg-white text-gray-900">
                Name
              </option>
              <option value="rating" className="bg-white text-gray-900">
                Highest Rating
              </option>
              <option value="mostRead" className="bg-white text-gray-900">
                Most Read
              </option>
            </select>
          </div>
        </div>

        {sortedBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No books available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBooks.map((book, index) => (
              <BookCard key={book.id || `book-${index}`} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
