import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";

// Skeleton Loader for Book Card
const BookCartSkeleton = () => {
    <div className="animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="w-full aspect-[16/25] bg-slate-200 rounded-t-lg"></div>
        <div className="p-4">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
    </div>
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-block/50 bg-opacity-25 transition-opacity" onClick={onClose}></div>
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
                    <p className="text-slate-600 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {

    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
                setBooks(response.data);
            } catch (error) {
                toast.error("Failed to fetch your ebooks");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleDeleteBook = async () => {
        if (!bookToDelete) return;
        try {
            await axiosInstance.delete(
                `${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`
            );
            setBooks(books.filter((book) => book._id !== bookToDelete));
            toast.success("eBook Deleted Successfully.");
        } catch (error) {
            toast.error(error.message?.response?.data?.message || "Failied to Delete eBook");
        } finally {
            setBookToDelete(null);
        }
    };

    const handleCreateBookClick = () => {
        setIsCreatedModalOpen(true);
    };

    const handleBookCreated = (bookId) => {
        setIsCreatedModalOpen(false);
        navigate(`/editor/${bookId}`);
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">All Books</h1>
                        <p className="text-[13px] text-slate-600 mt-1">
                            Create, edit, and manage all your AI-genereated eBooks.
                        </p>
                    </div>

                    <Button
                        className="whitespace-nowwrap"
                        onClick={handleCreateBookClick}
                        icon={Plus}
                    >
                        Create New eBook
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <BookCartSkeleton key={i} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Book className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No eBook Found
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md">
                            You haven't created any eBooks yet. Get Started by creating your first one.
                        </p>
                        <Button onClick={handleCreateBookClick} icon={Plus}>
                            Create Your First eBook
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard
                                key={book._id}
                                book={book}
                                onDelete={() => setBookToDelete(book._id)}
                            />
                        ))}
                    </div>
                )}

                <ConfirmationModal
                    isOpen={!!bookToDelete}
                    onClose={() => setBookToDelete(null)}
                    onConfirm={handleDeleteBook}
                    title="Delete Book"
                    message="Are sure you want to delete this book. This action cannot not be undone." />
                <CreateBookModal
                    isOpen={isCreatedModalOpen}
                    onClose={() => setIsCreatedModalOpen(false)}
                    onBookCreated={handleBookCreated} />
            </div>
        </DashboardLayout>
    )
}
export default DashboardPage