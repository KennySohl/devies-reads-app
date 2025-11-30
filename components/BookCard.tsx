import { Book } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { FaBook, FaBookOpen, FaBookmark, FaStar } from "react-icons/fa";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-64 w-full bg-gray-200">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-600 text-lg mb-2 line-clamp-1 overflow-hidden capitalize">
            {book.name}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-600 mt-auto">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              <span className="font-medium">
                {book.averageRating?.toFixed(1) || "N/A"}
              </span>
            </div>

            <div className="flex gap-3">
              <span title="Have Read" className="flex items-center gap-1">
                <FaBook style={{ color: "#abdee6" }} /> {book.haveRead}
              </span>
              <span
                title="Currently Reading"
                className="flex items-center gap-1"
              >
                <FaBookOpen style={{ color: "#cce2cb" }} />{" "}
                {book.currentlyReading}
              </span>
              <span title="Want to Read" className="flex items-center gap-1">
                <FaBookmark style={{ color: "#f3b0c3" }} /> {book.wantToRead}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
