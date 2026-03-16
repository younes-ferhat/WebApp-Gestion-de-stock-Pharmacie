import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, Info } from 'lucide-react';

function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Bonjour ! Je suis l'intelligence artificielle de Pharmasol. Je peux analyser vos stocks, vos péremptions et vous aider à optimiser vos commandes. Que souhaitez-vous savoir ?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      // On envoie la requête à la route que ton collègue va créer
      const res = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.reply || "Je n'ai pas pu traiter votre demande pour le moment." 
      }]);
    } catch (err) {
      console.error("Erreur IA:", err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Erreur de connexion avec l'assistant IA." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      
      {/* Header local */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-[#76b09c] text-white rounded-2xl shadow-lg shadow-[#76b09c]/20">
          <Bot size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Assistant IA</h1>
          <p className="text-gray-500 text-sm font-medium italic">Analyse prédictive de l'officine</p>
        </div>
      </div>

      {/* Conteneur de Chat */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-[#76b09c] text-white'
                }`}>
                  {msg.role === 'user' ? <User size={20}/> : <Sparkles size={20}/>}
                </div>
                <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-gray-800 text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-6 py-4 rounded-full border border-gray-100 flex items-center gap-3 shadow-sm">
                <Loader2 size={18} className="animate-spin text-[#76b09c]" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Analyse en cours...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Demandez une analyse de vos stocks..."
              className="w-full bg-gray-50 border border-gray-100 p-5 pr-16 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#76b09c] transition-all font-medium text-gray-700"
            />
            <button 
              type="submit"
              disabled={isTyping}
              className="absolute right-2 p-4 bg-[#76b09c] text-white rounded-xl hover:bg-[#5e8d7d] transition-all active:scale-90 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Info size={12}/> L'IA peut faire des erreurs, vérifiez les stocks manuellement.
          </p>
        </form>
      </div>
    </div>
  );
}

export default AIChat;