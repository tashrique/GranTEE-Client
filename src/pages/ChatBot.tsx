import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ExternalLink, BookOpen, FileText, Users, Send, ArrowDown } from 'lucide-react';

// Add CSS styles as a styled object for message content
const messageStyles = `
  .message-content a {
    color: #2563eb;
    text-decoration: underline;
  }
  .message-content a:hover {
    text-decoration: none;
  }
  .message-content strong, 
  .message-content b {
    font-weight: 600;
  }
  .message-content p {
    margin-bottom: 0.75rem;
  }
  .message-content ul, .message-content ol {
    margin-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .message-content li {
    margin-bottom: 0.25rem;
  }
  .message-content h1, .message-content h2, .message-content h3, .message-content h4 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .confidence-badge {
    padding: 2px 8px;
    border-radius: 9999px;
    font-weight: 500;
    color: white;
  }
  .score-high {
    background-color: #10b981;
  }
  .score-medium {
    background-color: #f59e0b;
  }
  .score-low {
    background-color: #ef4444;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .message-appear {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .mode-button {
    transition: all 0.2s ease;
  }
  
  .mode-button:hover {
    transform: translateY(-2px);
  }
  
  .mode-button.active {
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  
  .scroll-button {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .scroll-button.visible {
    opacity: 1;
  }
  
  .chat-bubble {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
  }
  
  .chat-bubble:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Gradient backgrounds */
  .gradient-header {
    background: linear-gradient(to right, #2563eb, #3b82f6);
  }
`;

// Helper text to keep the chatbot focused on scholarships
const SCHOLARSHIP_CONTEXT = "Please provide information about scholarships and financial aid. ";

// Maximum length for source text before truncating
const MAX_SOURCE_LENGTH = 150;

// Key for storing messages in localStorage
const CHAT_STORAGE_KEY = 'grantee_chat_messages';
const QUERY_MODE_STORAGE_KEY = 'grantee_chat_mode';

// Query mode types
type QueryMode = 'deep' | 'concise' | 'community';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  sources?: {
    text: string;
    score: number;
    metadata: {
      Source?: string;
      filename?: string;
    }
  }[];
  confidence?: number;
}

interface ChatResponse {
  query: string;
  response: string;
  sources: {
    text: string;
    score: number;
    metadata: {
      Source?: string;
      filename?: string;
    }
  }[];
  confidence: number;
  routed_to: string;
}

// Helper function to serialize and deserialize date objects in messages
const serializeMessages = (messages: Message[]): string => {
  return JSON.stringify(messages, (key, value) => {
    if (key === 'timestamp' && value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

const deserializeMessages = (messagesJson: string): Message[] => {
  const messages = JSON.parse(messagesJson);
  
  // Properly reconstruct Date objects for timestamps
  return messages.map((message: Omit<Message, 'timestamp'> & { timestamp: string | { __type: string, value: string } | Date }) => {
    // Convert timestamp string to Date object if it's not already
    if (message.timestamp && typeof message.timestamp === 'string') {
      message.timestamp = new Date(message.timestamp);
    } else if (message.timestamp && typeof message.timestamp === 'object' && 'value' in message.timestamp) {
      message.timestamp = new Date((message.timestamp as { __type: string, value: string }).value);
    }
    return message as Message;
  });
};

const ChatBot: React.FC = () => {
  // Initialize message state from localStorage or with default message
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        try {
          const parsedMessages = deserializeMessages(savedMessages);
          // Verify timestamps are proper Date objects
          if (parsedMessages.some(msg => !(msg.timestamp instanceof Date))) {
            throw new Error('Invalid timestamp format in saved messages');
          }
          return parsedMessages;
        } catch (e) {
          console.error('Error parsing saved messages:', e);
          // If there's an error, clear the corrupted storage
          localStorage.removeItem(CHAT_STORAGE_KEY);
          // Fall back to default message
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    // Default initial message
    return [
      {
        id: '1',
        text: 'Hi there! I\'m your GranTEE Scholarship Assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      }
    ];
  });
  
  // Initialize query mode from localStorage or default to 'concise'
  const [queryMode, setQueryMode] = useState<QueryMode>(() => {
    try {
      const savedMode = localStorage.getItem(QUERY_MODE_STORAGE_KEY) as QueryMode;
      if (savedMode && (savedMode === 'deep' || savedMode === 'concise' || savedMode === 'community')) {
        return savedMode;
      }
    } catch (e) {
      console.error('Error reading query mode from localStorage:', e);
    }
    return 'concise';
  });
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, serializeMessages(messages));
    } catch (e) {
      console.error('Error saving messages to localStorage:', e);
    }
  }, [messages]);

  // Save query mode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(QUERY_MODE_STORAGE_KEY, queryMode);
    } catch (e) {
      console.error('Error saving query mode to localStorage:', e);
    }
  }, [queryMode]);

  // Get query mode context based on the selected mode
  const getQueryModeContext = (mode: QueryMode): string => {
    switch (mode) {
      case 'deep':
        return "Please provide a deep, detailed, and comprehensive answer with thorough explanations. ";
      case 'concise':
        return "Please provide a brief, concise answer that gets straight to the point. ";
      case 'community':
        return "Please provide an answer that includes community insights, student experiences, and practical advice. ";
      default:
        return "";
    }
  };

  // Show scroll button when user scrolls up
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      
      setShowScrollButton(isScrolledUp);
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get source URL from metadata if available
  const getSourceUrl = (metadata: { Source?: string; filename?: string }) => {
    if (!metadata.Source) return null;
    
    // Check if the Source is already a URL
    if (metadata.Source.startsWith('http')) {
      return metadata.Source;
    }
    
    // Extract URL from citation text if possible
    const urlMatch = metadata.Source.match(/https?:\/\/[^\s)]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
    
    return null;
  };

  // Format and process text for better readability
  const formatText = (text: string) => {
    // Replace **text** with <strong>text</strong> for better formatting
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    
    // Ensure proper paragraph formatting
    if (!formattedText.includes('<br>') && formattedText.length > 100) {
      // Add paragraph breaks for better readability in long text
      formattedText = formattedText
        .replace(/\. ([A-Z])/g, '.<br>$1')
        .replace(/: ([A-Z])/g, ':<br>$1');
    }
    
    return formattedText;
  };

  // Clean up source text to make it more readable and truncate if too long
  const formatSourceText = (text: string) => {
    // Check if the text is a social media post
    const isSocialPost = text.includes('POST:') || text.includes('COMMENTS:');
    
    let cleanText = '';
    if (isSocialPost) {
      // Clean social media posts
      cleanText = text
        .replace(/POST:\s*/g, '')
        .replace(/COMMENTS:\s*/g, '')
        .replace(/\n+/g, ' ')
        .trim();
    } else {
      // For normal text
      cleanText = text.trim();
    }
    
    // Truncate if too long
    if (cleanText.length > MAX_SOURCE_LENGTH) {
      return cleanText.substring(0, MAX_SOURCE_LENGTH) + '...';
    }
    
    return cleanText;
  };

  // Get appropriate class for score-based coloring
  const getScoreClass = (score: number) => {
    if (score >= 0.7) return 'score-high';
    if (score >= 0.4) return 'score-medium';
    return 'score-low';
  };

  // Filter out low-quality sources
  const filterSources = (sources: ChatResponse['sources']) => {
    if (!sources || sources.length === 0) return [];
    
    // Filter out sources with very low scores
    return sources
      .filter(source => source.score > 0.3) // Only keep sources with reasonable relevance
      .slice(0, 3); // Limit to top 3 sources to avoid overwhelming the user
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    // Original user input (shown to the user)
    const userInput = inputText.trim();
    
    // Add scholarship context and query mode context to the query for the API
    const modeContext = getQueryModeContext(queryMode);
    const enhancedQuery = `${modeContext}${SCHOLARSHIP_CONTEXT}${userInput}`;

    // Generate unique ID for this message
    const messageId = Date.now().toString();
    
    // Add user message to chat
    const newUserMessage: Message = {
      id: messageId,
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add temporary loading message
    const loadingMessage: Message = {
      id: `${messageId}-loading`,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };
    
    setMessages(prev => [...prev, newUserMessage, loadingMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Call the API with the enhanced query
      const response = await axios.post('https://grantee-server.onrender.com/query', {
        query: enhancedQuery
      });
      
      const data: ChatResponse = response.data;
      
      // Filter sources to only include relevant ones
      const filteredSources = filterSources(data.sources);
      
      // Format the response text for better readability
      const responseText = formatText(data.response);
      
      // Remove loading message and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== `${messageId}-loading`);
        return [
          ...filtered, 
          {
            id: `${messageId}-response`,
            text: responseText,
            sender: 'bot',
            timestamp: new Date(),
            sources: filteredSources,
            confidence: data.confidence
          }
        ];
      });
      
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== `${messageId}-loading`);
        return [
          ...filtered, 
          {
            id: `${messageId}-error`,
            text: 'Sorry, I encountered an error. Please try again later.',
            sender: 'bot',
            timestamp: new Date(),
          }
        ];
      });
      
      toast.error('Failed to get a response from the chatbot.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get mode-specific colors
  const getModeColors = (mode: QueryMode) => {
    switch (mode) {
      case 'deep': 
        return { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700' };
      case 'concise': 
        return { bg: 'bg-blue-600', hover: 'hover:bg-blue-700' };
      case 'community': 
        return { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700' };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Add the styles to the page */}
      <style dangerouslySetInnerHTML={{ __html: messageStyles }} />
      
      {/* Chat container - full height minus navbar */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white shadow-md rounded-lg border border-gray-200">
        {/* Chat header with gradient */}
        <div className="gradient-header text-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold">Scholarship Assistant</h1>
          
          {/* Query Mode Selector */}
          <div className="flex space-x-3">
            {(['concise', 'deep', 'community'] as const).map(mode => {
              const modeColors = getModeColors(mode);
              const isActive = queryMode === mode;
              const icons = {
                concise: <FileText size={18} />,
                deep: <BookOpen size={18} />,
                community: <Users size={18} />
              };
              
              return (
                <button
                  key={mode}
                  onClick={() => setQueryMode(mode)}
                  className={`mode-button flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium 
                  ${isActive 
                    ? `${modeColors.bg} text-white active` 
                    : 'bg-white text-gray-700 hover:bg-gray-100'} 
                  transition-all shadow-sm`}
                >
                  {icons[mode]}
                  <span className="capitalize">{mode}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Messages area with scroll container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50"
        >
          {messages.map((message, index) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-appear`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user' 
                    ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none chat-bubble` 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 chat-bubble'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: message.text }} className="message-content" />
                    
                    {/* Confidence score with color coding */}
                    {message.confidence !== undefined && message.confidence > 0 && (
                      <div className="mt-3 text-xs flex items-center">
                        <span className={`mr-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>Confidence:</span>
                        <span className={`confidence-badge ${getScoreClass(message.confidence)}`}>
                          {(message.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    
                    {/* Sources - improved formatted and clickable */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold mb-2 text-gray-600">Sources:</p>
                        <div className="space-y-3">
                          {message.sources.map((source, index) => {
                            const sourceUrl = getSourceUrl(source.metadata);
                            
                            return (
                              <div key={index} className="text-xs p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition border border-gray-100">
                                <p className="mb-2 font-medium text-gray-700">
                                  {formatSourceText(source.text)}
                                </p>
                                
                                {source.metadata.Source && (
                                  <div className="text-gray-500 flex items-center">
                                    <span className="italic mr-1">From:</span>
                                    
                                    {sourceUrl ? (
                                      <a 
                                        href={sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="font-medium flex items-center text-blue-600 hover:underline"
                                      >
                                        {source.metadata.Source.replace(/https?:\/\/[^\s)]+/g, '').trim() || sourceUrl}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    ) : (
                                      <span className="font-medium">{source.metadata.Source}</span>
                                    )}
                                    
                                    {source.metadata.filename && (
                                      <span className="ml-1">- {source.metadata.filename}</span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Relevance score with color coding */}
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="flex items-center">
                                    <span className="text-gray-500 mr-1">Relevance:</span>
                                    <span className={`confidence-badge ${getScoreClass(source.score)}`}>
                                      {(source.score * 100).toFixed(0)}%
                                    </span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button 
              onClick={scrollToBottom} 
              className={`scroll-button fixed bottom-28 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg visible`}
            >
              <ArrowDown size={20} />
            </button>
          )}
        </div>
        
        {/* Input area with enhanced styling */}
        <form 
          onSubmit={handleSendMessage} 
          className="border-t border-gray-200 p-4 bg-white flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow bg-gray-50 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            placeholder={`Ask about scholarships (${queryMode} mode)...`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`${getModeColors(queryMode).bg} text-white p-3 rounded-full 
              ${getModeColors(queryMode).hover} transition-colors disabled:opacity-50 flex items-center justify-center`}
            disabled={isLoading || !inputText.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot; 