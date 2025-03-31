import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SendIcon, UploadIcon, XIcon, BookOpenIcon } from 'lucide-react';
import { gaTopics } from '@/utils/preTrainedAnswers';

interface QuestionFormProps {
  setResult: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resultRef: React.RefObject<HTMLDivElement>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ setResult, setLoading, resultRef }) => {
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    setLoading(true);
    setResult(null);

    // Scroll to result section
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    try {
      // Use the LLM service
      const { generateAnswer } = await import('@/utils/llmService');
      
      // Read the file content if there's a file
      let fileData = null;
      if (file) {
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onload = (e) => {
            resolve({
              content: e.target?.result,
              type: file.type,
              name: file.name
            });
          };
          
          if (file.type.includes('text') || file.type.includes('json') || file.type.includes('csv')) {
            reader.readAsText(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        });
      }

      const answer = await generateAnswer(question, fileData);
      setResult(answer);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Animated Text Section - Above the question input */}
      
      <div>
        <label htmlFor="question" className={`bg-black text-white transition-all shadow-lg hover:shadow-xl`}>
          Enter your TDS assignment question:
        </label>
        <Textarea
          id="question"
          placeholder=""
          className={`bg-black text-white transition-all shadow-lg hover:shadow-xl`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
        <div className="relative group flex-1">
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`bg-black text-white transition-all shadow-lg hover:shadow-xl`}>
            <UploadIcon size={18} className={`bg-black text-white transition-all shadow-lg hover:shadow-xl`} />
            <span className="text-sm">{file ? file.name : 'Attach file (optional)'}</span>
          </div>
          {file && (
            <button
              type="button"
              onClick={clearFile}
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'} z-20`}
              aria-label="Remove file"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>

        <Button 
          type="submit" 
          className={`bg-black text-white transition-all shadow-lg hover:shadow-xl`}
        >
          <SendIcon size={16} className="mr-2" />
          Submit
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
