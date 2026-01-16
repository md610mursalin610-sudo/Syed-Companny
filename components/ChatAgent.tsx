import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, CornerDownLeft, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration, Chat } from "@google/genai";
import { Button } from "./ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "./ui/chat-bubble";
import { ChatInput } from "./ui/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "./ui/expandable-chat";
import { ChatMessageList } from "./ui/chat-message-list";

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
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello. I'm Aura, the studio's intake agent. I can help you start a new project. To begin, may I have your name?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      
      let toolCalls: any[] | undefined = undefined;

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

      // 2. Check for Function Calls (after stream completes)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="z-50">
      <ExpandableChat
        size="md"
        position="bottom-right"
        icon={<Bot className="h-8 w-8 text-white" />}
      >
        <ExpandableChatHeader className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Sparkles size={18} className="text-indigo-400" />
            </div>
            <div>
                <h3 className="text-white font-semibold text-base">Aura AI</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-neutral-400">Gemini 3.0 Pro • Live</span>
                </div>
            </div>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.role === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0 border border-white/10"
                  src={
                    message.role === "user"
                      ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      : undefined
                  }
                  fallback={message.role === "user" ? "US" : "AI"}
                />
                <ChatBubbleMessage
                  variant={message.role === "user" ? "sent" : "received"}
                >
                  {message.text}
                  {message.isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle rounded-full"></span>
                  )}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {/* Success Notification */}
            {leadSubmitted && (
                 <div className="flex justify-center py-2 mb-4">
                     <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                         <CheckCircle2 size={12} className="text-green-400" />
                         <span className="text-xs text-green-400 font-medium">Order Saved to Database</span>
                     </div>
                 </div>
              )}

            {isLoading && !messages[messages.length - 1]?.isStreaming && messages[messages.length - 1]?.role === 'user' && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar fallback="AI" className="border border-white/10"/>
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          <form
            onSubmit={handleSendMessage}
            className="relative rounded-xl border border-white/10 bg-black/40 focus-within:ring-1 focus-within:ring-indigo-500/50 p-1"
          >
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-12 resize-none rounded-xl bg-transparent border-0 p-3 shadow-none focus-visible:ring-0 text-white placeholder:text-neutral-500"
            />
            <div className="flex items-center p-2 justify-end">
              <Button 
                type="submit" 
                size="sm" 
                className="ml-auto gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                disabled={!inputValue.trim() || isLoading}
              >
                Send
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
};