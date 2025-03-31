import React, { useEffect, useState } from 'react';
import { ClipboardCopyIcon, BrainCircuitIcon, CheckCircleIcon, CpuIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ResultDisplayProps {
  result: string | null;
  loading: boolean;
}

// Animation phrases for the "thinking" state
const thinkingPhrases = [
  "Working on the question...",
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
  const [currentPhrase, setCurrentPhrase] = useState(thinkingPhrases[0]);
  const [typedResult, setTypedResult] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Rotate through thinking phrases
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentPhrase((prev) => {
          const currentIndex = thinkingPhrases.indexOf(prev);
          return thinkingPhrases[(currentIndex + 1) % thinkingPhrases.length];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Typing effect when result is received
  useEffect(() => {
    if (result && !loading) {
      setIsTyping(true);
      setTypedResult("");

      let i = 0;
      const typeSpeed = 10; // ms per character

      const typeInterval = setInterval(() => {
        if (i < result.length) {
          setTypedResult((prev) => prev + result.charAt(i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, typeSpeed);

      return () => clearInterval(typeInterval);
    }
  }, [result, loading]);


  return (
    <div>
      {loading ? (
        <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mb-4">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="text-slate-700 font-medium">{currentPhrase}</p>
            <div className="flex justify-center gap-1 mt-2">
            </div>
          </div>
        </div>
      ) : result ? (
        <Card className="bg-white border-slate-300 overflow-hidden shadow-lg relative">
          <CardContent className="p-6">
            <div className="bg-blue-50 text-slate-800 p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap relative rounded">
              {isTyping ? typedResult : result}
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse absolute"></span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {/* Add any footer content here if needed */}
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
};

export default ResultDisplay;
