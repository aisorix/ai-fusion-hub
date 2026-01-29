import React from 'react';
import { motion } from 'framer-motion';
import type { VoiceState } from '@/hooks/useSpeechRecognition';

interface VoiceVisualizerProps {
  state: VoiceState;
  accentColor?: string;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ 
  state, 
  accentColor = '#10a37f'
}) => {
  // ChatGPT-style single orb with smooth animations
  const getOrbConfig = () => {
    switch (state) {
      case 'listening':
        return {
          scale: [1, 1.08, 1],
          opacity: 1,
          duration: 2,
          glowIntensity: '40px',
          innerGlow: '20px',
        };
      case 'processing':
        return {
          scale: [1, 1.15, 1.05, 1.12, 1],
          opacity: 1,
          duration: 1.2,
          glowIntensity: '50px',
          innerGlow: '25px',
        };
      case 'speaking':
        return {
          scale: [1, 1.2, 0.95, 1.15, 1],
          opacity: 1,
          duration: 0.6,
          glowIntensity: '60px',
          innerGlow: '30px',
        };
      default:
        return {
          scale: [1, 1.03, 1],
          opacity: 0.7,
          duration: 3,
          glowIntensity: '30px',
          innerGlow: '15px',
        };
    }
  };

  const config = getOrbConfig();
  const isActive = state !== 'idle';

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer ambient glow */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: isActive ? [1, 1.3, 1] : 1,
          opacity: isActive ? [0.3, 0.5, 0.3] : 0.2,
        }}
        transition={{
          duration: config.duration * 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary ring pulse */}
      <motion.div
        className="absolute w-36 h-36 rounded-full"
        style={{
          border: `2px solid ${accentColor}`,
          opacity: 0.15,
        }}
        animate={{
          scale: state === 'speaking' ? [1, 1.4, 1] : [1, 1.2, 1],
          opacity: state === 'speaking' ? [0.2, 0, 0.2] : [0.15, 0.05, 0.15],
        }}
        transition={{
          duration: state === 'speaking' ? 0.8 : 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />

      {/* Main ChatGPT-style orb */}
      <motion.div
        className="relative w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${accentColor}ee, ${accentColor}99 60%, ${accentColor}66)`,
          boxShadow: `
            0 0 ${config.glowIntensity} ${accentColor}50,
            0 0 ${config.innerGlow} ${accentColor}80,
            inset 0 -8px 20px ${accentColor}40,
            inset 0 8px 20px rgba(255,255,255,0.15)
          `,
        }}
        animate={{
          scale: config.scale,
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner highlight */}
        <motion.div
          className="absolute top-3 left-4 w-8 h-5 rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
        
        {/* Center bright spot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.6)',
            filter: 'blur(4px)',
          }}
          animate={{
            opacity: state === 'speaking' ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3],
            scale: state === 'speaking' ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: state === 'speaking' ? 0.4 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Speaking wave rings */}
      {state === 'speaking' && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 rounded-full"
              style={{
                border: `2px solid ${accentColor}`,
              }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 2],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Listening indicator dots */}
      {state === 'listening' && (
        <div className="absolute bottom-0 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: accentColor }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceVisualizer;
