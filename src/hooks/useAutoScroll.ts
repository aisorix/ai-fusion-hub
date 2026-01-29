// Auto-scroll hook for chat message lists
// Automatically scrolls to the bottom when new messages arrive

import { useRef, useEffect, useCallback } from 'react';
import type { Message } from '@/stores/chatStore';

export const useAutoScroll = (messages: Message[], isStreaming: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);
  
  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    if (!containerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Consider "near bottom" if within 100px
    return distanceFromBottom < 100;
  }, []);
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    shouldScrollRef.current = checkIfNearBottom();
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
  
  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // Auto-scroll when messages change
  useEffect(() => {
    if (shouldScrollRef.current || isStreaming) {
      // Use requestAnimationFrame for smooth scrolling during streaming
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
