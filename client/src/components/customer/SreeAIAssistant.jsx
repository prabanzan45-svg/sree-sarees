import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Eye,
  Bot,
  User,
  CheckCircle2,
  Minimize2,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { handleImageError } from '../../utils/imageFallback';

const SUGGESTIONS = [
  'Show me green Silk sarees',
  'What is the cheapest saree?',
  'Show sarees under ₹1,500',
  'Show Cotton sarees for daily wear',
  'Tell me about Blouse Stitching',
  'Tell me about Aari Work Classes',
  'What special Offers are available?',
  'How do I care for a silk saree?'
];

const SreeAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState({});

  const { addToCart } = useCart();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: 'Namaste! I am **Sree AI — Your Saree Shopping Assistant**.\n\nI can help you explore our **4 Saree Collections** (*Cotton, Silk, Kalamkari, Fancy*), locate our cheapest handlooms (starting at ₹499), explore exclusive **Offers**, guide you on custom **Blouse Stitching**, and enroll in **Aari Work Classes** (*Online Live & Offline in Madurai*). How may I assist you today?',
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-sree-ai', handleOpen);
    return () => window.removeEventListener('open-sree-ai', handleOpen);
  }, []);

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || loading) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: message.trim(),
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Extract current product id if browsing a product page
      let context = {};
      if (location.pathname.startsWith('/products/')) {
        const parts = location.pathname.split('/');
        if (parts[2]) {
          context.productId = parts[2];
        }
      }

      // Build conversation history payload with product references
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text,
        products: m.products || []
      }));

      const res = await api.post('/ai/chat', {
        message: userMsg.text,
        history,
        context
      });

      if (res.data.success) {
        const aiMsg = {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: res.data.reply,
          products: res.data.products || [],
          mode: res.data.mode,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: 'err_' + Date.now(),
        sender: 'ai',
        text: "I'm having a brief connection issue with our catalogue server. Please try asking again in a moment.",
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItemIds((prev) => ({ ...prev, [product.productId || product._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.productId || product._id]: false }));
    }, 2000);
  };

  return (
    <>
      {/* Floating Trigger Button (Always visible on customer views) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white shadow-boutique-lg border-2 border-boutique-gold/50 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open Sree AI Saree Shopping Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-boutique-goldLight group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-boutique-maroon animate-ping" />
          </div>
          <span className="font-serif font-bold text-xs tracking-wider text-boutique-goldLight uppercase">
            Ask Sree AI
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
            Online
          </span>
        </button>
      )}

      {/* Sree AI Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-boutique-gold/40 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-boutique-maroon text-boutique-ivory p-4 border-b-2 border-boutique-gold/50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-boutique-goldLight/20 border border-boutique-gold/50 flex items-center justify-center text-boutique-goldLight">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-boutique-goldLight tracking-wide">
                    Sree AI
                  </h3>
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Catalogue Connected</span>
                  </span>
                </div>
                <p className="text-[10px] text-gray-300 italic font-serif">
                  Your Saree Shopping Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition-colors"
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-boutique-ivory/50">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                    >
                      <div className="flex items-end space-x-2 max-w-[92%]">
                        {!isUser && (
                          <div className="w-7 h-7 rounded-full bg-boutique-maroon text-boutique-goldLight flex items-center justify-center text-xs flex-shrink-0 mb-1 border border-boutique-gold/30">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-boutique-maroon text-white rounded-br-none shadow-sm'
                              : 'bg-white text-boutique-charcoal rounded-bl-none border border-boutique-gold/30 shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-line font-normal">{msg.text}</p>
                        </div>

                        {isUser && (
                          <div className="w-7 h-7 rounded-full bg-boutique-gold text-white flex items-center justify-center text-xs flex-shrink-0 mb-1">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Embedded Saree Product Cards if present in AI response */}
                      {!isUser && msg.products && msg.products.length > 0 && (
                        <div className="w-full pl-9 pr-2 space-y-2.5 mt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-boutique-goldDark">
                            Matching Sarees from Catalogue:
                          </p>
                          <div className="grid grid-cols-1 gap-2.5">
                            {msg.products.map((p) => {
                              const displayPrice = p.discountPrice || p.price;
                              const isOutOfStock = p.stockQuantity <= 0;
                              const isAdded = addedItemIds[p.productId || p._id];

                              return (
                                <div
                                  key={p.productId || p._id}
                                  className="p-2.5 bg-white rounded-xl border border-boutique-gold/30 shadow-sm flex items-center space-x-3 hover:border-boutique-maroon transition-all"
                                >
                                  <img
                                    src={p.images && p.images[0] ? p.images[0] : ''}
                                    alt={p.name}
                                    onError={handleImageError}
                                    className="w-14 h-16 object-cover object-top rounded-lg border border-boutique-gold/20 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-serif text-xs font-bold text-boutique-charcoal truncate">
                                      {p.name}
                                    </h4>
                                    <p className="text-[10px] text-boutique-goldDark mt-0.5">
                                      {p.fabric} • {p.colour}
                                    </p>
                                    <div className="flex items-baseline space-x-1.5 mt-1">
                                      <span className="font-bold text-xs text-boutique-maroon">
                                        ₹{displayPrice.toLocaleString('en-IN')}
                                      </span>
                                      {p.discountPrice && (
                                        <span className="text-[10px] text-gray-400 line-through">
                                          ₹{p.price.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ml-auto ${
                                        isOutOfStock ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {isOutOfStock ? 'Sold Out' : `${p.stockQuantity} in stock`}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Link
                                        to={`/products/${p.productId || p._id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-boutique-ivory text-boutique-maroon border border-boutique-gold/30 hover:bg-boutique-sand transition-colors"
                                      >
                                        View Saree
                                      </Link>
                                      <button
                                        onClick={() => handleAddToCart(p)}
                                        disabled={isOutOfStock}
                                        className={`px-3 py-1 rounded-md text-[10px] font-semibold flex items-center space-x-1 transition-all ${
                                          isAdded
                                            ? 'bg-emerald-600 text-white'
                                            : isOutOfStock
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-boutique-maroon hover:bg-boutique-maroonDark text-white shadow-xs'
                                        }`}
                                      >
                                        {isAdded ? (
                                          <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Added!</span>
                                          </>
                                        ) : (
                                          <>
                                            <ShoppingBag className="w-3 h-3" />
                                            <span>Add to Bag</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-gray-400 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center space-x-2 pl-9 text-xs text-boutique-maroon animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-boutique-maroon animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-boutique-gold animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-boutique-maroon animate-bounce delay-200" />
                    <span className="text-[11px] font-medium text-boutique-muted ml-1">
                      Sree AI is searching catalogue...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="px-3 py-2 bg-white border-t border-boutique-gold/15 overflow-x-auto flex space-x-1.5 flex-shrink-0">
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-boutique-ivory hover:bg-boutique-sand text-boutique-maroon border border-boutique-gold/30 transition-all flex-shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-boutique-gold/20 flex items-center space-x-2 flex-shrink-0"
              >
                <input
                  type="text"
                  placeholder="Ask about colours, fabrics, sarees under ₹1,500..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-full border border-boutique-gold/35 focus:border-boutique-maroon focus:ring-2 focus:ring-boutique-maroon/20 outline-none bg-boutique-ivory/30"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="p-2.5 rounded-full bg-boutique-maroon hover:bg-boutique-maroonDark text-white disabled:opacity-40 transition-all shadow-sm flex-shrink-0"
                  title="Send message to Sree AI"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SreeAIAssistant;
