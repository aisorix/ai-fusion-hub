// Auto-scroll hook for chat message lists
// Smooth scrolling with user-override detection

import { useRef, useEffect, useCallback } from 'react';
import type { Message } from '@/stores/chatStore';

export const useAutoScroll = (messages: Message[], isStreaming: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);
  const rafRef = useRef<number | null>(null);
  
  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);
  
  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      shouldScrollRef.current = checkIfNearBottom();
    });
  }, [checkIfNearBottom]);
  
  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);
  
  // Set up scroll listener + CSS hints
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.style.willChange = 'scroll-position';
    container.style.overscrollBehaviorY = 'contain';
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.style.willChange = '';
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);
  
  // Auto-scroll when messages change — only if user hasn't scrolled up
  useEffect(() => {
    if (shouldScrollRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom(false);
      });
    }
  }, [messages, isStreaming, scrollToBottom]);
  
  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);
  
  return {
    containerRef,
    scrollToBottom,
  };
};

export default useAutoScroll;
