import { Lightbulb, BookOpen, Download, Library } from "lucide-react";

export const FEATURES = [
    {
        title: "AI-Powered Writing",
        description:
            "Overcome writer's block with our smart assistant that helps you generate ideas, oulines, and content.",
        icon: Lightbulb,
        gradient: "from-violet-500 to-purple-600",
    },
    {
        title: "Immersive Reader",
        description: "Preview you ebook in a clean, read-only format. Adjust font sizes for a comfortable reading experince before you export",
        icon: BookOpen,
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        title: "One-Click-Export",
        description: "Export your ebook to PDF, and DOCX formats instantly, ready for publishing",
        icon: Download,
    },
    {
        title: "eBook Management",
        description: "Organise all your ebook projects in a pesonal dashboard. Easily track progress, edit drafts, and manage your library.",
        icon: Library,
        gradient: "from-pink-500 to-rose-600",
    },
];

export const TESTIMONIALS = [
    {
        quote: "This platform made it to easy to write and publish my first ebook. The AI assistant is a game-changer!",
        author: "Jane Doe",
        title: "Bestselling Author",
        avatar: "",
        rating: 5,
    },
    {
        quote: "I love the customizable templates. I was able to create a beautiful ebook that matches my brand perfectly.",
        author: "John Smith",
        title: "Marketing Expert",
        avatar: "",
        rating: 5,
    },
    {
        quote: "The one-click export feature saved me so much time. I was able to publish my ebook multiple platforms in minutes.",
        title: "Indie Publisher",
        avatar: "",
        rating: 5,
    },
]