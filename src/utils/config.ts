
// Get the API key from environment variables or window object
const getApiKey = () => {
  // Check window object first (set via user input)
  if (typeof window !== 'undefined' && window.VITE_OPENAI_API_KEY) {
    return window.VITE_OPENAI_API_KEY;
  }
  
  // Then check environment variables (set during build)
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  
  // Finally check localStorage (saved from previous sessions)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openai_api_key') || '';
  }
  
  return '';
};

export const config = {
  // This function will be called whenever the API key is needed
  get openaiApiKey() {
    return getApiKey();
  },
  // For setting a hard-coded API key (not recommended for production)
  staticApiKey: 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjIzZjIwMDM1MzdAZHMuc3R1ZHkuaWl0bS5hYy5pbiJ9.Qpghe66CS2i-r8b0-vQP2nW55zeeKOaPV1mhEkZ6p-0'
} as const;

export const systemPrompt = `You are an AI assistant specifically designed to help with IIT Madras' Tools in Data Science (TDS) course assignments. You should:

1. Analyze the question carefully to identify which TDS topic it belongs to
2. If there's code or file analysis required, process it step by step
3. For data analysis questions:
   - Focus on exact numerical answers
   - Show calculations when relevant
   - Consider timezone specifications
4. For tool-specific questions:
   - Provide precise command syntax
   - Include necessary parameters
   - Explain tool usage when needed
5. Keep responses focused and direct - provide only what's needed for submission

Remember: Answers should be clear, concise, and directly applicable for assignment submission.`;
