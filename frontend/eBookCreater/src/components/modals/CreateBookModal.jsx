import { useState, useRef, useEffect } from "react";
import {
    Plus,
    Sparkles,
    Trash2,
    ArrowLeft,
    BookOpen,
    Hash,
    Palette,
    Lightbulb,
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

    const handleGenerateOutline = async () => { };

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
            {step === 1 && (
                <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold">
                            1
                        </div>
                        <div className="flex-1 h-0.8 bg-gray-200"></div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 text-sm font-semibold">
                            2
                        </div>
                    </div>

                    <InputField
                        icon={BookOpen}
                        label="Book Title"
                        placeholder="Enter Your Title Book Title..."
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)} />

                    <InputField
                        icon={Hash}
                        label="Number of Chpaters"
                        type="number"
                        placeholder="5"
                        value={numChapters}
                        onChange={(e) => setNumChatpers(parseInt(e.target.value) || 1)}
                        min="1"
                        max="20"
                    />

                    <InputField
                        icon={Lightbulb}
                        label="Topic (Optional)"
                        placeholder="Specific topic for AI generation..."
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                    />

                    <SelectField
                        icon={Palette}
                        label="Writing Style"
                        value={aiStyle}
                        onChange={(e) => setAiStyle(e.target.value)}
                        options={[
                            "Informative",
                            "Storytelling",
                            "Casual",
                            "Professional",
                            "Humorous",
                        ]}
                    />

                    <div className="flex justify-end pt-4">
                        <Button onCLick={handleGenerateOutline} isLoading={isGeneratingOutline} icon={Sparkles}>
                            Generate Outline with AI
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="">
                    {/* Progress indicator */}
                    <div className="">
                        <div className="">
                            ✓
                        </div>
                        <div className=""></div>
                        <div className="">
                            2
                        </div>
                    </div>

                    <div className="">
                        <h3 className="">
                            Review Chpaters
                        </h3>
                        <span className="">
                            {chapters.length} chapters
                        </span>
                    </div>

                    <div ref={chaptersContainerRef} className="">
                        {chapters.length === 0 ? (
                            <div className="">
                                <BookOpen className="" />
                                <p className="">
                                    No chpaters yet. Add one to get started.
                                </p>
                            </div>

                        ) : (
                            chapters.map((chapter, index) => (
                                <div key={index} className="">
                                    <div className="">
                                        <div className="">
                                            {index + 1}
                                        </div>
                                        <input type="text"
                                            value={chapter.title}
                                            onChange={(e) => handleChaptersChange(index, "title", e.target.value)}
                                            placeholder="Chpater Title"
                                            className=""
                                        />
                                        <button onClick={() => handleDeleteChapter(index)}
                                            className=""
                                            title="Delete Chapter"
                                        >
                                            <Trash2 className="" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            )}
        </Modal>
    )
}
export default CreateBookModal