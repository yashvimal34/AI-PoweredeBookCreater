import { useState, useRef, useEffect } from "react";
import {
    Plus,
    Sparkles,
    Trash2,
    ArrowLeft,
    BookOpen,
    Hash,
    LightBulb,
    Palette,
} from "lucide-react";

import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {

    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [bookTitle, setBookTitle] = useState("");
    const [numChapters, setNumChatpers] = useState(5);
    const [aiTopic, setAiTopic] = useState("");
    const [aiStyle, setAiStyle] = useState("Informative");
    const [chapters, setChapters] = useState([]);
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
    const [isFinalizingBook, setIsFinalizingBook] = useState(false);
    const chaptersContainerRef = useRef(null);

    const resetModal = () => {
        setStep(1);
        setBookTitle("");
        setNumChatpers(5);
        setAiTopic("");
        setAiStyle("Informative");
        setChapters([]);
        setIsGeneratingOutline(false);
        setIsFinalizingBook(false);
    };

    const handleGenerativeOutline = async () => { };

    const handleChaptersChange = (index, field, value) => {
        const updatedChpaters = [...chapters];
        updatedChpaters[index][field] = value;
        setChapters(updatedChpaters);
    };

    const handleDeleteChapter = (index) => {
        if (chapters.length <= 1) return;
        setChapters(chapters.filter((_, i) => i !== index));
    };

    const handleAddChapter = () => {
        setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, description: "" },]);
    };

    const handleFinalizingBook = async () => { };

    useEffect(() => {
        if (step === 2 && chaptersContainerRef.current) {
            const scrollableDiv = chaptersContainerRef.current;
            scrollableDiv.scrollTo({
                top: scrollableDiv.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [chapters.length, step]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                resetModal();
            }}
            title="Create New Modal"
        >
            Content Here
        </Modal>
    )
}
export default CreateBookModal