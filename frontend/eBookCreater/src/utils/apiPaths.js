export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",      // send OTP
    VERIFY_OTP: "/api/auth/verify-otp",  // verify OTP
      RESEND_OTP: "/api/auth/resend-otp",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
  },

  BOOKS: {
    CREATE_BOOK: "/api/books",
    GET_BOOKS: "/api/books",
    GET_BOOK_BY_ID: "/api/books",
    UPDATE_BOOK: "/api/books",
    DELETE_BOOK: "/api/books",
    UPDATE_COVER: "/api/books/cover",
  },

  AI: {
    GENERATE_OUTLINE: "/api/ai/generate-outline",
    GENERATE_CHAPTER_CONTENT: "/api/ai/generate-chapter-content",
  },

  EXPORT: {
    PDF: "/api/export",
    DOC: "/api/export",
  },
};
