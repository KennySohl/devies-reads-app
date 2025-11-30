"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getBookById, rateBook } from "@/lib/books";
import { addToShelf, updateShelfItem, getBookShelfStatus } from "@/lib/users";
import { getToken } from "@/lib/auth";
import { Book } from "@/types";
import { FaStar, FaBook, FaBookOpen, FaBookmark } from "react-icons/fa";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Shelf status
  const [shelfStatus, setShelfStatus] = useState<
    "haveRead" | "currentlyReading" | "wantToRead" | null
  >(null);
  const [updatingShelf, setUpdatingShelf] = useState(false);

  // Rating
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [updatingRating, setUpdatingRating] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);

    async function fetchBookData() {
      try {
        setLoading(true);
        const bookData = await getBookById(bookId);
        setBook(bookData);
        setUserRating(bookData.userRating || 0);

        // Get shelf status if logged in
        if (token) {
          const status = await getBookShelfStatus(bookId);
          setShelfStatus(status);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setLoading(false);
      }
    }

    fetchBookData();
  }, [bookId]);

  const handleShelfStatusChange = async (
    status: "haveRead" | "currentlyReading" | "wantToRead"
  ) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      setUpdatingShelf(true);

      if (shelfStatus) {
        // Update existing shelf item
        await updateShelfItem(bookId, { status });
      } else {
        // Add new shelf item
        await addToShelf({ bookId, status });
      }

      setShelfStatus(status);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update shelf");
    } finally {
      setUpdatingShelf(false);
    }
  };

  const handleRatingClick = async (rating: number) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      setUpdatingRating(true);
      const updatedBook = await rateBook(bookId, rating);
      setBook(updatedBook);
      setUserRating(rating);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to rate book");
    } finally {
      setUpdatingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading book...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Error: {error || "Book not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-[#5ec3d3] hover:text-[#2a8fbd] font-medium"
        >
          ← Back to Books
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-6">
              <div>
                <h1 className="text-4xl  text-[#202528] font-bold mb-2 capitalize">
                  {book.name}
                </h1>
                <p className="text-lg ">{book.genre}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaStar className="text-xl text-yellow-500" />
                  <span className="text-1xl font-semibold text-gray-600 pt-1">
                    {book.averageRating?.toFixed(1) || "N/A"}
                  </span>
                </div>
                <div className="text-1xl font-semibold text-gray-600 pt-1">
                  <span>Average Rating</span>
                </div>
              </div>

              <div className="flex gap-6 text-sm text-[#202528]">
                <div className="flex items-center gap-2">
                  <FaBook style={{ color: "#abdee6" }} />
                  <span>
                    <strong>{book.haveRead}</strong> have read
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBookOpen style={{ color: "#cce2cb" }} />
                  <span>
                    <strong>{book.currentlyReading}</strong> currently reading
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBookmark style={{ color: "#f3b0c3" }} />
                  <span>
                    <strong>{book.wantToRead}</strong> want to read
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 text-[#202528]">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
