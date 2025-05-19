import { useState, useEffect } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import quotes from '../../data/quotes';

export function QuoteOfDay() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const getQuoteForToday = () => {
    // Use the current date to get a consistent quote for the whole day
    const today = new Date().toISOString().split('T')[0];
    const dayNumber = parseInt(today.replace(/\D/g, ''), 10);
    const quoteIndex = dayNumber % quotes.length;
    return quotes[quoteIndex];
  };

  const refreshQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setLoading(false);
    }, 500); // Add a small delay to show loading state
  };

  useEffect(() => {
    setQuote(getQuoteForToday());
    setLoading(false);
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quote of the Day</h2>
        <button 
          onClick={refreshQuote}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Get another quote"
        >
          <RefreshCcw className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="min-h-[100px] flex items-center justify-center">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        ) : quote ? (
          <div className="space-y-3">
            <p className="text-lg font-medium text-gray-700 italic">
              "{quote.q}"
            </p>
            <p className="text-sm text-gray-500 text-right">
              — {quote.a}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center justify-center gap-1 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Updates daily
        </div>
      </div>
    </div>
  );
}
