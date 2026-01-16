import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration, Chat } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

// Tool definition for the AI to "save" data
const submitLeadTool: FunctionDeclaration = {
  name: 'submitProjectLead',
  description: 'Save the project lead details to the database when the user has provided sufficient information (Name, Project Type, Budget, Timeline).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Name of the client' },
      projectType: { type: Type.STRING, description: 'Type of project (e.g., UI/UX, Web, App)' },
      budget: { type: Type.STRING, description: 'Estimated budget range' },
      timeline: { type: Type.STRING, description: 'Desired timeline for the project' },
    },
    required: ['name', 'projectType'],
  },
};

export const ChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello. I'm Aura, the studio's intake agent. I can help you start a new project. To begin, may I have your name?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize Chat Session
  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: "You are Aura, the AI intake specialist for Aura Studio, a premium design agency. Your goal is to have a professional, concise, and elegant conversation with potential clients to collect project leads. Ask questions one by one to gather: Name, Project Description, Budget Range, and Timeline. Do not overwhelm the user. Once you have these details, call the 'submitProjectLead' tool to save the order. After the tool runs, confirm to the user that their request is logged and a human will follow up.",
            tools: [{ functionDeclarations: [submitLeadTool] }],
          },
        });
      } catch (error) {
        console.error("Failed to initialize AI", error);
      }
    };
    initChat();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Send User Message & Stream Response
      let currentBotText = "";
      const botMsgId = (Date.now() + 1).toString();
      
      // Add placeholder bot message
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: "", isStreaming: true }]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userText });
      let toolCalls: any[] | undefined;

      for await (const chunk of result) {
        if (chunk.text) {
          currentBotText += chunk.text;
          setMessages(prev => 
            prev.map(msg => msg.id === botMsgId ? { ...msg, text: currentBotText } : msg)
          );
        }
        if (chunk.functionCalls) {
          toolCalls = chunk.functionCalls;
        }
      }

      // 2. Check for Function Calls (after first turn completes)
      if (toolCalls && toolCalls.length > 0) {
        // We have tool calls. The model might have paused generation.
        // Update state to remove streaming flag from the prompt message
         setMessages(prev => 
            prev.map(msg => msg.id === botMsgId ? { ...msg, isStreaming: false } : msg)
          );

        const functionResponses = toolCalls.map((call: any) => {
          if (call.name === 'submitProjectLead') {
            console.log('--- LEAD CAPTURED ---', call.args);
            setLeadSubmitted(true);
            return {
              id: call.id,
              name: call.name,
              response: { result: "Lead successfully saved to Aura Studio database." }
            };
          }
          return { id: call.id, name: call.name, response: { result: "Error: Unknown tool" } };
        });

        // 3. Send Tool Response & Stream Follow-up
        const toolResponseParts = functionResponses.map((fr: any) => ({
            functionResponse: {
                name: fr.name,
                response: fr.response,
                id: fr.id
            }
        }));

        // Add another placeholder for the post-tool response
        const followUpId = (Date.now() + 2).toString();
        let followUpText = "";
        setMessages(prev => [...prev, { id: followUpId, role: 'model', text: "", isStreaming: true }]);
        
        // Send tool response. 
        const followUpResult = await chatSessionRef.current.sendMessageStream({ 
            message: toolResponseParts 
        });

        for await (const chunk of followUpResult) {
            if (chunk.text) {
                followUpText += chunk.text;
                setMessages(prev => 
                    prev.map(msg => msg.id === followUpId ? { ...msg, text: followUpText } : msg)
                );
            }
        }
        
        // Finalize
        setMessages(prev => 
            prev.map(msg => msg.id === followUpId ? { ...msg, isStreaming: false } : msg)
        );
      } else {
        // No tool calls, just finalize the first message
         setMessages(prev => 
            prev.map(msg => msg.id === botMsgId ? { ...msg, isStreaming: false } : msg)
          );
      }

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { id: 'error', role: 'model', text: "I'm having trouble connecting to the studio server. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen ? 'bg-neutral-800 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <Bot className="text-white" />}
        {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-background rounded-full animate-pulse"></span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 md:right-8 w-[calc(100vw-3rem)] md:w-96 h-[500px] z-50 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Sparkles size={16} className="text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-white font-semibold text-sm">Aura AI</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-neutral-400">Gemini 3.0 Pro • Live</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
                    {msg.isStreaming && (
                        <span className="inline-block w-1 h-3 ml-1 bg-indigo-400 animate-pulse align-middle"></span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Success Notification */}
              {leadSubmitted && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center py-2"
                 >
                     <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                         <CheckCircle2 size={12} className="text-green-400" />
                         <span className="text-xs text-green-400 font-medium">Order Saved to Database</span>
                     </div>
                 </motion.div>
              )}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader2 size={16} className="animate-spin text-neutral-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full bg-neutral-900 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-neutral-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};