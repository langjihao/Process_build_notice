'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIAgentState, BuildNotice } from '@/types/buildNotice';

interface AICopilotProps {
  aiState: AIAgentState;
  onProcessInput: (input: string) => Partial<BuildNotice>;
  onApplySuggestions: (suggestions: Partial<BuildNotice>) => void;
}

export function AICopilot({
  aiState,
  onProcessInput,
  onApplySuggestions,
}: AICopilotProps) {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiState.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const suggestions = onProcessInput(input);
      setInput('');

      // Auto-apply suggestions if any
      if (Object.keys(suggestions).length > 0) {
        setTimeout(() => {
          onApplySuggestions(suggestions);
        }, 500);
      }
    }
  };

  const examplePrompts = [
    'NPI-2024-001, Part ABC-123, Rev A, build 100 units by 2024-12-20',
    'Create build notice for part XYZ-456 revision B, quantity 50, urgent priority',
    'Assembly at Building 5, required by 2024-12-25',
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b cursor-pointer bg-blue-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-lg">AI Co-pilot</h3>
          {aiState.isProcessing && (
            <span className="text-sm text-gray-600">(Processing...)</span>
          )}
        </div>
        <button className="text-gray-600 hover:text-gray-800">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          {/* Messages */}
          <div className="mb-4 h-64 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
            {aiState.messages.length === 0 ? (
              <div className="text-gray-500 text-sm">
                <p className="mb-2">
                  👋 Hi! I'm your AI Co-pilot. I can help you fill out the Build
                  Notice form using natural language.
                </p>
                <p className="mb-2">Try saying things like:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {examplePrompts.map((prompt, idx) => (
                    <li key={idx} className="text-gray-600">
                      "{prompt}"
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                {aiState.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-md ${
                      msg.role === 'user'
                        ? 'bg-blue-100 ml-8'
                        : 'bg-green-100 mr-8'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      {msg.role === 'user' ? '👤 You' : '🤖 AI'}
                    </div>
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Current Suggestions */}
          {Object.keys(aiState.suggestions).length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm font-semibold mb-2">📝 Suggested Fields:</p>
              <ul className="text-xs space-y-1">
                {Object.entries(aiState.suggestions).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium">{key}:</span>{' '}
                    <span className="text-gray-700">{String(value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your request in natural language..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={aiState.isProcessing}
            />
            <button
              type="submit"
              disabled={aiState.isProcessing || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.slice(0, 2).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const suggestions = onProcessInput(prompt);
                    if (Object.keys(suggestions).length > 0) {
                      setTimeout(() => {
                        onApplySuggestions(suggestions);
                      }, 500);
                    }
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  disabled={aiState.isProcessing}
                >
                  Try this
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
