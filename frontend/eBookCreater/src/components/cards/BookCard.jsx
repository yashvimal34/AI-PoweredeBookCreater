import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

const BookCard = ({ book, onDelete }) => {
    const navigate = useNavigate();

    const coverImage = book.coverImage || ""; // Cloudinary direct URL

    return (
        <div
            className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/view-book/${book._id}`)}
        >
            <div className="relative overflow-hidden bg-gray-50">
                <img
                    src={coverImage}
                    alt={book.title}
                    className="w-full aspect-[16/25] object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = ""; }}
                />

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editor/${book._id}`);
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow hover:bg-white"
                    >
                        <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(book._id);
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow hover:bg-white"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="relative">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-gray-300 text-xs">{book.author}</p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default BookCard;
