"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/users";
import { getBooks } from "@/lib/books";
import { getToken } from "@/lib/auth";
import { User, Book } from "@/types";
import { FaBook, FaBookOpen, FaBookmark, FaStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface BookWithDetails extends Book {
  shelfStatus?: "haveRead" | "currentlyReading" | "wantToRead";
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "haveRead" | "currentlyReading" | "wantToRead" | "rated"
  >("all");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUserData() {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);

        // Fetch all books to get full book details
        const allBooks = await getBooks();

        // Map shelf items to books with their status
        const userBooksWithDetails: BookWithDetails[] = userData.shelf
          .map((shelfItem) => {
            const book = allBooks.find((b) => b.id === shelfItem.bookId);
            if (book) {
              return {
                ...book,
                shelfStatus: shelfItem.status,
              } as BookWithDetails;
            }
            return null;
          })
          .filter((book): book is BookWithDetails => book !== null);

        setBooks(userBooksWithDetails);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const filteredBooks = books.filter((book) => {
    if (activeTab === "all") return true;
    if (activeTab === "rated") return book.userRating && book.userRating > 0;
    return book.shelfStatus === activeTab;
  });

  const counts = {
    all: books.length,
    haveRead: books.filter((b) => b.shelfStatus === "haveRead").length,
    currentlyReading: books.filter((b) => b.shelfStatus === "currentlyReading")
      .length,
    wantToRead: books.filter((b) => b.shelfStatus === "wantToRead").length,
    rated: books.filter((b) => b.userRating && b.userRating > 0).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl text-gray-800 font-bold mb-2 capitalize-first">
                {user.username}
              </h1>
              <p className="text-gray-600">
                {books.length} {books.length === 1 ? "book" : "books"} in your
                shelf
              </p>
            </div>
          </div>
          <hr className="mt-3" />
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-[#5ec3d3] text-[#5ec3d3]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab("wantToRead")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "wantToRead"
                  ? "border-b-2 border-[#5ec3d3] text-[#5ec3d3]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaBookmark style={{ color: "#f3b0c3" }} />
              Want to Read ({counts.wantToRead})
            </button>
            <button
              onClick={() => setActiveTab("currentlyReading")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "currentlyReading"
                  ? "border-b-2 border-[#5ec3d3] text-[#5ec3d3]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaBookOpen style={{ color: "#cce2cb" }} />
              Currently Reading ({counts.currentlyReading})
            </button>
            <button
              onClick={() => setActiveTab("haveRead")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "haveRead"
                  ? "border-b-2 border-[#5ec3d3] text-[#5ec3d3]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaBook style={{ color: "#abdee6" }} />
              Have Read ({counts.haveRead})
            </button>
            <button
              onClick={() => setActiveTab("rated")}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "rated"
                  ? "border-b-2 border-[#5ec3d3] text-[#5ec3d3]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaStar style={{ color: "#ffffb5" }} />
              Rated ({counts.rated})
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-[#f8f8f8] p-12 text-center">
            <p className="text-xl mb-4">No books in this category yet.</p>
            <Link
              href="/"
              className="text-[#5ec3d3] hover:text-[#2a8fbd] font-medium"
            >
              Browse books →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative h-64 w-full bg-gray-200">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 overflow-hidden">
                      {book.name}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-600 mt-auto">
                      <div className="flex items-center gap-1">
                        <FaStar style={{ color: "#ffffb5" }} />
                        <span className="font-medium">
                          {book.averageRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>

                      {book.shelfStatus && (
                        <div className="flex items-center gap-1">
                          {book.shelfStatus === "haveRead" && (
                            <FaBook style={{ color: "#abdee6" }} />
                          )}
                          {book.shelfStatus === "currentlyReading" && (
                            <FaBookOpen style={{ color: "#cce2cb" }} />
                          )}
                          {book.shelfStatus === "wantToRead" && (
                            <FaBookmark style={{ color: "#f3b0c3" }} />
                          )}
                        </div>
                      )}

                      {book.userRating && book.userRating > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <span>Your rating: {book.userRating}</span>
                          <FaStar style={{ color: "#ffffb5" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
