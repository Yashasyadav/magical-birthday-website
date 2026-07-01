import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const SENTENCES = [
  "To my dearest friend Bhavani,",
  "Today is a celebration of the beautiful light you bring to the world.",
  "Every memory we share is a golden thread woven into my heart.",
  "May your birthday be filled with the same magic and joy you give to others.",
  "Always beside you, your best friend forever."
];

export const WritingAnimation = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const linesRef = useRef([]);

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    lines: linesRef.current
  }));

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full flex flex-col justify-center items-start px-12 md:px-16 pointer-events-none select-none"
      style={{ fontFamily: "'Great Vibes', cursive" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        .handwritten-letter-line {
          opacity: 0;
          transform: translateY(3px);
          font-size: 1.8rem;
          line-height: 2.9rem;
          margin-bottom: 1.3rem;
        }

        .handwritten-letter-line span {
          opacity: 0;
          transition: color 3.2s cubic-bezier(0.1, 0.8, 0.2, 1), 
                      text-shadow 3.2s cubic-bezier(0.1, 0.8, 0.2, 1), 
                      filter 3.2s cubic-bezier(0.1, 0.8, 0.2, 1);
          color: #4b321a; /* Dry ink color */
        }

        .handwritten-letter-line span.is-wet {
          color: #fffde6 !important; /* Glowing wet ink color */
          text-shadow: 0 0 5px #fcd34d, 0 0 10px #fbbf24, 0 0 15px #d97706;
          filter: drop-shadow(0 0 1.5px rgba(255,255,255,0.95));
          transition: none; /* Apply wet glow instantly */
        }

        .handwritten-letter-line span.is-dry {
          color: #4b321a;
          text-shadow: 0 0 1px rgba(0,0,0,0.1);
          filter: none;
        }

        @media (max-width: 640px) {
          .handwritten-letter-line {
            font-size: 1.35rem;
            line-height: 2.1rem;
            margin-bottom: 0.9rem;
          }
        }
      `}</style>

      <div className="w-full flex flex-col pt-8">
        {SENTENCES.map((sentence, index) => (
          <div
            key={index}
            ref={el => linesRef.current[index] = el}
            className="handwritten-letter-line w-full text-left"
          >
            {/* Split sentences into words for realistic staggers */}
            {sentence.split(' ').map((word, wIdx) => (
              <span key={wIdx} className="inline-block mr-2 opacity-0">
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

WritingAnimation.displayName = 'WritingAnimation';

export default WritingAnimation;
