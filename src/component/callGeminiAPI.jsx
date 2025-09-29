import { useState } from "react";

  export const callGeminiAPI = async (userMessage, history) => {
      const [messages, setMessages] = useState({});
      setIsLoading(true);
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [...history, { parts: [{ text: userMessage }] }] };

      try {
          // Implementing exponential backoff
          let response;
          let delay = 1000;
          for (let i = 0; i < 5; i++) {
              response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
              });
              if (response.ok) break;
              await new Promise(res => setTimeout(res, delay));
              delay *= 2;
          }
          
          if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
          
          const result = await response.json();
          const geminiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if(geminiResponse) {
              setMessages(prev => ({
                  ...prev,
                  'gemini-ai': [...(prev['gemini-ai'] || []), { text: userMessage, sender: 'user' }, { text: geminiResponse, sender: 'contact' }]
              }));
          }

      } catch (error) {
          console.error("Gemini API call failed:", error);
          setMessages(prev => ({
              ...prev,
              'gemini-ai': [...(prev['gemini-ai'] || []), { text: userMessage, sender: 'user' }, { text: "Sorry, I couldn't connect. Please try again.", sender: 'contact' }]
          }));
      } finally {
          setIsLoading(false);
      }
  };