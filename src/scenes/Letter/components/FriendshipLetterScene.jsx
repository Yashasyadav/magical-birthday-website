import React, { useEffect, useRef, useState } from 'react';
import soundManager from '@engine/SoundManager';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';
import gsap from 'gsap';

import CinematicBackground from '../../../components/effects/background/CinematicBackground';
import CinematicStars from '../../../components/effects/background/CinematicStars';
import CinematicNebula from '../../../components/effects/background/CinematicNebula';

const PARAGRAPHS = [
  "Dear Bhavani,",
  "Wishing you a very Happy Birthday! 🎉",
  "Before I begin, I just want to thank you for taking the time to go through this little surprise. Every page, every animation, every memory, and every word was created with one simple intention—to make you smile.",
  "Birthdays come every year, but this time I wanted to do something a little different. I know this may not be the biggest surprise in the world, but it's the best one I could create with what I have. It's been such a long time since we last met—probably since our school days—and even though I couldn't be there to wish you in person, I wanted to be a small part of your special day through this little surprise. I truly hope it brought a smile to your face.",
  "Sometimes life moves so quickly that we forget to appreciate the people who quietly make it brighter. This letter is my small attempt to do exactly that.",
  "Looking back at all these memories reminded me of how much you've grown over the years. From the little girl with an innocent smile to the confident young woman you're becoming today, your journey has been beautiful to witness. Time changes many things, but there are some qualities in you that I sincerely hope never change—your kindness, your simplicity, your caring heart, and that genuine smile that has a way of making everyone around you feel comfortable.",
  "One thing I've always admired is the love and respect you have for your mother. Not everyone truly understands the strength it takes for someone to become both a mother and a father at the same time. Watching the bond you share always reminds me how fortunate you both are to have each other. I sincerely hope that one day you give her every happiness she has ever dreamed of, because she truly deserves it.",
  "I also smiled while looking through the memories with your brother, Lucky, your friends, your college life, your trips, and all those little moments that make life so beautiful. To someone else, they may just look like ordinary photographs, but behind every picture is a memory, a feeling, and a story that only you truly know.",
  "Sometimes, the smallest memories become the most precious ones.",
  "As I was creating this website, I realized something—I wasn't just collecting photos; I was collecting moments that tell the story of your journey. Every picture reflects a chapter of your life, and together they show how beautifully you've grown over the years.",
  "As for you...",
  "Keep believing in yourself. Keep chasing your dreams. Keep learning. Keep smiling.",
  "Life won't always be easy. There will be difficult days, unexpected challenges, and moments when things don't go as planned. But I genuinely believe you're stronger than you realize. Never underestimate yourself, because sometimes the strength we fail to see within ourselves is exactly what others admire the most.",
  "I hope you continue exploring new places, creating unforgettable memories, meeting wonderful people, and collecting stories that you'll one day look back on with a smile. Whether it's another journey, another birthday, another achievement, or another chapter of your life, I hope every year becomes even more beautiful than the last.",
  "And finally...",
  "I just want to say thank you. Thank you for every conversation. Thank you for every memory. Thank you for being part of my school life. Thank you for being someone worth remembering.",
  "Even if life takes us on different paths, I hope we'll always be able to look back at these memories with a smile, knowing that we were lucky enough to share such a wonderful friendship.",
  "This entire birthday website is simply my way of saying, \"You are appreciated.\" Nothing more. Nothing less.",
  "On your special day, I have only a few wishes for you:",
  "May your smile always remain as genuine as it is today. May your heart always stay kind. May your mother always be proud of you. May every dream you work for become your reality. May you always find people who value you, respect you, and stand beside you exactly the way you deserve. May happiness, peace, and good health always stay with you. And may life continue to bless you with beautiful memories worth holding onto forever.",
  "Once again, Happy Birthday, Bhavani. 🎂✨",
  "I truly hope this little surprise made your day even a little more special. Take care of yourself. Keep smiling. Keep shining. And never stop being the wonderful person you are.",
  "With warm wishes,"
];

export function FriendshipLetterScene() {
  const [letterStage, setLetterStage] = useState('hidden'); // hidden -> glow -> balloons -> letter-fade-in -> writing -> footer
  const [showFooter, setShowFooter] = useState(false);
  
  const [balloons, setBalloons] = useState([]);
  const [particles, setParticles] = useState([]);
  const [fireflies, setFireflies] = useState([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cardRef = useRef(null);
  const penRef = useRef(null);
  const canvasRef = useRef(null);
  const writingLoopTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Sync letterStage to ref to prevent fireworks loop restarts
  const stageRef = useRef(letterStage);
  useEffect(() => {
    stageRef.current = letterStage;
  }, [letterStage]);

  // 1. Setup Audio & Stages
  useEffect(() => {
    soundManager.preloadMusic('letter');
    soundManager.playMusic('letter', 2000);
    soundManager.setMusicVolume(0.04); // Silent / calm volume to start

    // Step A: Wait 1.0s of absolute silence/anticipation
    const t1 = setTimeout(() => {
      setLetterStage('glow');
      soundManager.setMusicVolume(0.12);
    }, 1000);

    // Step B: Warm center glow appears, wait 1.8s, then launch balloons
    const t2 = setTimeout(() => {
      setLetterStage('balloons');
    }, 2800);

    // Step C: Balloons float, wait 2.2s, then letter materializes
    const t3 = setTimeout(() => {
      setLetterStage('letter-fade-in');
    }, 5000);

    // Step D: Letter materializes, wait 3.0s, then start writing sequence
    const t4 = setTimeout(() => {
      setLetterStage('writing');
      soundManager.setMusicVolume(0.28);
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (writingLoopTimeoutRef.current) clearTimeout(writingLoopTimeoutRef.current);
    };
  }, []);

  // 2. High-Performance Direct DOM writing loop
  useEffect(() => {
    if (letterStage === 'writing') {
      startWritingSequence();
    }
  }, [letterStage]); // eslint-disable-line react-hooks/exhaustive-deps

  const startWritingSequence = () => {
    const card = cardRef.current;
    const pen = penRef.current;
    if (!card || !pen) return;

    const charNodes = card.querySelectorAll('.char-span');
    if (charNodes.length === 0) return;

    // Reset visibility before typing starts
    charNodes.forEach(node => {
      node.style.opacity = 0;
      node.classList.remove('is-wet', 'is-dry');
    });

    const sigElement = card.querySelector('.signature-line');
    if (sigElement) sigElement.classList.remove('is-visible');

    // Pen starts high up, off-screen top-right relative to viewport
    gsap.set(pen, { opacity: 0, x: window.innerWidth * 0.45, y: -220, rotation: 38 });
    
    // Get coordinate of first character (in viewport screen space)
    const firstRect = charNodes[0].getBoundingClientRect();
    const firstX = firstRect.left;
    const firstY = firstRect.top + firstRect.height * 0.85;

    gsap.timeline()
      .to(pen, {
        opacity: 1,
        x: firstX,
        y: firstY - 20, // Hover slightly above paper
        rotation: 18,
        duration: 1.8,
        ease: 'power2.out'
      })
      .to(pen, {
        y: firstY, // Touch down
        duration: 0.4,
        ease: 'power1.inOut',
        onComplete: () => {
          runWritingLoop(charNodes, 0);
        }
      });
  };

  const runWritingLoop = (nodes, index) => {
    if (index >= nodes.length) {
      finishAndSign();
      return;
    }

    const node = nodes[index];
    const card = cardRef.current;
    const pen = penRef.current;

    if (!card || !pen) return;

    // Space & newlines are instantly revealed without pen movement
    if (node.textContent === ' ' || node.textContent === '\n') {
      node.style.opacity = 1;
      runWritingLoop(nodes, index + 1);
      return;
    }

    // Auto-scroll scrollContainer to follow the writing cursor/pen
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && node) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      
      const offsetTop = nodeRect.top - containerRect.top + scrollContainer.scrollTop;
      const targetScrollTop = offsetTop - scrollContainer.clientHeight + 100;
      
      if (targetScrollTop > scrollContainer.scrollTop) {
        scrollContainer.scrollTop = targetScrollTop;
      }
    }

    // Target coordinates in absolute screen space
    const charRect = node.getBoundingClientRect();
    const x = charRect.left;
    const y = charRect.top + charRect.height * 0.85;

    // Move pen smoothly to absolute coordinate with organic micro-rotation wiggles
    gsap.to(pen, {
      x: x,
      y: y,
      rotation: 14 + Math.sin(index * 0.8) * 3.5,
      duration: 0.08,
      ease: 'none'
    });

    // Stroke text display & fresh glossy ink
    node.classList.add('is-wet');
    node.style.opacity = 1;

    // Sparkles emit from pen tip (in card relative coordinates)
    const cardRect = card.getBoundingClientRect();
    emitSparkleAt(x - cardRect.left, y - cardRect.top);

    // Occasional subtle writing scratch sound
    if (index % 12 === 0) {
      soundManager.playSfx('pageFlip');
    }

    // Ink dries after 2.2 seconds
    setTimeout(() => {
      node.classList.remove('is-wet');
      node.classList.add('is-dry');
    }, 2200);

    // Natural human variation in writing speed
    let delay = 45 + Math.random() * 55;

    // Pause & pen-lift when traversing paragraph boundaries
    const isEndOfParagraph = index < nodes.length - 1 &&
      nodes[index].parentNode !== nodes[index + 1].parentNode;

    if (isEndOfParagraph) {
      delay = 850;
      gsap.to(pen, {
        y: '-=12', // Lift pen
        duration: 0.25,
        ease: 'power1.out'
      });
    }

    writingLoopTimeoutRef.current = setTimeout(() => {
      runWritingLoop(nodes, index + 1);
    }, delay);
  };

  const finishAndSign = () => {
    const card = cardRef.current;
    const pen = penRef.current;
    if (!card || !pen) return;

    const sigElement = card.querySelector('.signature-line');
    if (!sigElement) {
      completeWritingPhase();
      return;
    }

    // Get signature coordinates in screen coordinates
    const sigRect = sigElement.getBoundingClientRect();
    const sigX = sigRect.left + 55;
    const sigY = sigRect.top + 28;

    const tl = gsap.timeline();

    // Move pen to signature line
    tl.to(pen, {
      x: sigX,
      y: sigY,
      rotation: 22,
      duration: 1.1,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('transitionWhoosh');
      }
    });

    const cardRect = card.getBoundingClientRect();

    // Trace signature path loops
    tl.to(pen, {
      x: sigX + 18, y: sigY - 14, duration: 0.22, ease: 'sine.inOut',
      onUpdate: () => emitSparkleAt(
        parseFloat(gsap.getProperty(pen, 'x')) - cardRect.left, 
        parseFloat(gsap.getProperty(pen, 'y')) - cardRect.top
      )
    });
    tl.to(pen, {
      x: sigX + 36, y: sigY + 8, duration: 0.22, ease: 'sine.inOut',
      onUpdate: () => emitSparkleAt(
        parseFloat(gsap.getProperty(pen, 'x')) - cardRect.left, 
        parseFloat(gsap.getProperty(pen, 'y')) - cardRect.top
      )
    });
    tl.to(pen, {
      x: sigX + 54, y: sigY - 8, duration: 0.18, ease: 'sine.inOut',
      onUpdate: () => emitSparkleAt(
        parseFloat(gsap.getProperty(pen, 'x')) - cardRect.left, 
        parseFloat(gsap.getProperty(pen, 'y')) - cardRect.top
      ),
      onComplete: () => {
        sigElement.classList.add('is-visible');
        soundManager.playSfx('sparkle');
      }
    });

    // Twirl once with magical sparkles explosion
    tl.to(pen, {
      rotation: '+=360',
      duration: 0.75,
      ease: 'power1.inOut',
      onStart: () => {
        for (let i = 0; i < 16; i++) {
          emitSparkleAt(
            (sigX + 54 + (Math.random() - 0.5) * 25) - cardRect.left, 
            (sigY + (Math.random() - 0.5) * 25) - cardRect.top
          );
        }
      }
    });

    // Fly back to top-right
    tl.to(pen, {
      x: window.innerWidth * 0.45,
      y: -250,
      rotation: 40,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.in',
      onComplete: () => {
        completeWritingPhase();
      }
    }, '+=0.3');
  };

  const completeWritingPhase = () => {
    setLetterStage('footer');
    setShowFooter(true);
    soundManager.setMusicVolume(0.2);
  };

  const handleCardClick = () => {
    if (stageRef.current === 'writing') {
      if (writingLoopTimeoutRef.current) {
        clearTimeout(writingLoopTimeoutRef.current);
      }
      
      const card = cardRef.current;
      if (card) {
        const charSpans = card.querySelectorAll('.char-span');
        charSpans.forEach(node => {
          node.style.opacity = 1;
          node.classList.remove('is-wet');
          node.classList.add('is-dry');
        });
        
        const sigElement = card.querySelector('.signature-line');
        if (sigElement) {
          sigElement.classList.add('is-visible');
        }
      }
      
      if (penRef.current) {
        gsap.killTweensOf(penRef.current);
        gsap.set(penRef.current, { opacity: 0, y: -250 });
      }
      
      completeWritingPhase();
    }
  };

  // 3. Spawns direct DOM sparkles at tip relative to card container
  const emitSparkleAt = (x, y) => {
    const container = document.getElementById('writing-sparkles-container');
    if (!container) return;

    const spark = document.createElement('div');
    spark.className = 'absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 pointer-events-none mix-blend-screen';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.boxShadow = '0 0 6px #fcd34d, 0 0 12px #ffffff';
    container.appendChild(spark);

    gsap.to(spark, {
      x: `+=${(Math.random() - 0.5) * 24}`,
      y: `+=${12 + Math.random() * 20}`,
      scale: 0.1,
      opacity: 0,
      duration: 0.6 + Math.random() * 0.4,
      ease: 'power1.out',
      onComplete: () => {
        spark.remove();
      }
    });
  };

  // 4. Setup 45 balloons on sides (never covers reading center area)
  useEffect(() => {
    const list = [];
    const colors = [
      '#fecdd3', // Pastel Pink
      '#ffffff', // White
      '#caa153', // Gold
      '#fda4af', // Rose Gold
      '#f5f5f5', // Soft White
      '#ffedd5', // Peach
      'rgba(255, 255, 255, 0.2)' // Transparent
    ];
    const shapes = ['oval', 'heart', 'star', 'pearl'];

    for (let i = 0; i < 45; i++) {
      const size = 28 + Math.random() * 32;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Guarded Left/Right margins to keep text unblocked
      const isLeft = Math.random() > 0.5;
      const left = isLeft 
        ? -10 + Math.random() * 21  // Left border path
        : 78 + Math.random() * 22;  // Right border path
      
      const speed = 12 + Math.random() * 10;
      const delay = Math.random() * -18; // Pre-fills screen slowly
      const zIndex = Math.random() > 0.5 ? 40 : 5;
      const swayAmt = 12 + Math.random() * 20;
      const swayDur = 4 + Math.random() * 3;
      const rotation = -10 + Math.random() * 20;

      list.push({
        id: i,
        size,
        color,
        shape,
        left,
        speed,
        delay,
        zIndex,
        swayAmt,
        swayDur,
        rotation
      });
    }
    setBalloons(list);
  }, []);

  // 5. Setup ambient sparks/particles surrounding paper
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        id: i,
        top: 5 + Math.random() * 90,
        left: 5 + Math.random() * 90,
        size: 1.5 + Math.random() * 3,
        delay: Math.random() * -12,
        speed: 10 + Math.random() * 12,
        dx: (Math.random() - 0.5) * 45,
        dy: -30 - Math.random() * 40,
        maxOpacity: 0.12 + Math.random() * 0.3
      });
    }
    setParticles(list);
  }, []);

  // 6. Setup drifting fireflies
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        id: i,
        top: 15 + Math.random() * 70,
        left: 15 + Math.random() * 70,
        delay: Math.random() * -8,
        speed: 5 + Math.random() * 6,
        swayX: (Math.random() - 0.5) * 80,
        swayY: -40 - Math.random() * 50
      });
    }
    setFireflies(list);
  }, []);

  // 7. Mouse interactive 3D parallax tilt (Subtle 2.8-degree limit)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xVal = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const yVal = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      setTilt({
        x: yVal * -2.8,
        y: xVal * 2.8
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 8. Seamless Continuous Canvas Background Fireworks Loop (Never resets on stage change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particlesList = [];
    const fireworksList = [];

    class FireworkParticle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 3.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1.0;
        this.decay = 0.008 + Math.random() * 0.012; // Slower fade-out
        this.gravity = 0.032;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.4 + Math.random() * 2.0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class CelebrationFirework {
      constructor(targetX, targetY) {
        this.x = targetX + (Math.random() - 0.5) * 60;
        this.y = window.innerHeight + 15;
        this.targetY = targetY;
        this.speed = 10 + Math.random() * 3.5;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.16;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.exploded = false;
        this.color = ['#caa153', '#fbcfe8', '#fda4af', '#fcd34d', '#e9d5ff', '#fffbeb'][Math.floor(Math.random() * 6)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.vy >= 0 || this.y <= this.targetY) {
          this.exploded = true;
          this.explode();
        }
      }
      explode() {
        for (let i = 0; i < 55; i++) {
          particlesList.push(new FireworkParticle(this.x, this.y, this.color));
        }
        soundManager.playSfx('sparkle');
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Instantly launch 2 fireworks at start
    const triggerInitialLaunches = () => {
      fireworksList.push(new CelebrationFirework(window.innerWidth * 0.15, window.innerHeight * 0.22));
      fireworksList.push(new CelebrationFirework(window.innerWidth * 0.85, window.innerHeight * 0.25));
    };

    let framesSinceLaunch = 0;
    let initialized = false;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentStage = stageRef.current;
      const isActive = ['letter-fade-in', 'writing', 'footer'].includes(currentStage);

      if (isActive) {
        if (!initialized) {
          triggerInitialLaunches();
          initialized = true;
        }

        framesSinceLaunch++;
        // Rapid fire frequency (every 40-75 frames)
        if (framesSinceLaunch > 40 + Math.random() * 35) {
          const isLeftLaunch = Math.random() > 0.5;
          const tx = isLeftLaunch 
            ? window.innerWidth * (0.05 + Math.random() * 0.22) 
            : window.innerWidth * (0.72 + Math.random() * 0.23);
          const ty = window.innerHeight * (0.12 + Math.random() * 0.32);
          
          fireworksList.push(new CelebrationFirework(tx, ty));
          framesSinceLaunch = 0;
        }
      } else {
        initialized = false;
      }

      // Update & draw active launches
      for (let i = fireworksList.length - 1; i >= 0; i--) {
        const fw = fireworksList[i];
        fw.update();
        if (fw.exploded) {
          fireworksList.splice(i, 1);
        } else {
          fw.draw();
        }
      }

      // Update & draw glowing particles
      for (let i = particlesList.length - 1; i >= 0; i--) {
        const p = particlesList[i];
        p.update();
        if (p.alpha <= 0) {
          particlesList.splice(i, 1);
        } else {
          p.draw();
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Runs continuously once on mount

  // 9. Reset/Navigation Trigger Actions
  const handleReadAgain = () => {
    soundManager.playSfx('buttonClick');
    soundManager.playSfx('pageFlip');
    setShowFooter(false);
    
    // Reset Direct DOM character text visibility classes
    const card = cardRef.current;
    if (card) {
      const charNodes = card.querySelectorAll('.char-span');
      charNodes.forEach(node => {
        node.style.opacity = 0;
        node.classList.remove('is-wet', 'is-dry');
      });
      const sigElement = card.querySelector('.signature-line');
      if (sigElement) {
        sigElement.classList.remove('is-visible');
      }
    }
    
    setLetterStage('writing');
    soundManager.setMusicVolume(0.28);
  };

  const handleContinue = () => {
    soundManager.playSfx('success');
    sceneManager.navigateTo('feedback');
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isLetterVisible = ['letter-fade-in', 'writing', 'footer'].includes(letterStage);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#02010b] flex items-center justify-center">
      {/* Premium Web Fonts and CSS Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        .scrollbar-clean::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-clean::-webkit-scrollbar-track {
          background: rgba(120, 53, 4, 0.02);
          border-radius: 4px;
        }
        .scrollbar-clean::-webkit-scrollbar-thumb {
          background: rgba(217, 119, 6, 0.25);
          border-radius: 4px;
        }
        .scrollbar-clean::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 119, 6, 0.4);
        }

        .font-handwritten {
          font-family: 'Caveat', cursive;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .char-span {
          opacity: 0;
          transition: color 2s ease-out, text-shadow 2.5s ease-out;
        }

        .char-span.is-wet {
          color: #fffdeb !important;
          text-shadow: 0 0 5px #fbbf24, 0 0 10px #d97706, 0 0 15px #ffffff;
          transition: none;
        }

        .char-span.is-dry {
          color: #4b321a;
          text-shadow: 0 0.5px 0.5px rgba(0,0,0,0.12);
        }

        /* First character is rendered as an elegant drop cap */
        .char-span.is-drop-cap {
          float: left;
          font-size: 3.2rem;
          line-height: 2.7rem;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          margin-right: 8px;
          margin-top: 3px;
          display: block;
          background: linear-gradient(135deg, #d9a74a, #b45309);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes floatUp {
          0% { transform: translateY(110vh) rotate(var(--rot-start)); }
          100% { transform: translateY(-120vh) rotate(var(--rot-end)); }
        }

        @keyframes sway {
          0% { translate: 0px; }
          100% { translate: var(--sway-amt) 0px; }
        }

        @keyframes floatDust {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: var(--max-op); }
          85% { opacity: var(--max-op); }
          100% { transform: translateY(var(--dy)) translateX(var(--dx)); opacity: 0; }
        }

        @keyframes fireflyPulse {
          0%, 100% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          50% { opacity: 0.85; transform: translate(var(--sway-x), var(--sway-y)) scale(1.15); }
        }

        @keyframes driftStar {
          0% { transform: translate(-10vw, 20vh) scale(0); opacity: 0; }
          10% { opacity: 0.5; transform: translate(15vw, 25vh) scale(1); }
          90% { opacity: 0.5; transform: translate(85vw, 35vh) scale(1); }
          100% { transform: translate(110vw, 40vh) scale(0); opacity: 0; }
        }

        @keyframes swing {
          0% { transform: rotate(-4.5deg); }
          100% { transform: rotate(4.5deg); }
        }

        @keyframes shoot {
          0% { transform: translate(0, 0) rotate(-45deg) scale(0); opacity: 0; }
          1% { opacity: 0.75; transform: translate(0, 0) rotate(-45deg) scale(1); }
          12% { transform: translate(-380px, 380px) rotate(-45deg) scale(0.25); opacity: 0; }
          100% { transform: translate(-380px, 380px) rotate(-45deg) scale(0); opacity: 0; }
        }

        .drifting-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: #fffdee;
          border-radius: 50%;
          box-shadow: 0 0 8px #fcd34d, 0 0 16px #ffffff;
        }

        .drifting-star.s1 {
          top: 18%;
          animation: driftStar 32s linear infinite;
          animation-delay: 2s;
        }

        .drifting-star.s2 {
          top: 55%;
          animation: driftStar 40s linear infinite;
          animation-delay: 18s;
        }

        .shooting-star {
          position: absolute;
          width: 140px;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, transparent 100%);
          opacity: 0;
          pointer-events: none;
        }

        .shooting-star.ss1 {
          top: 12%;
          right: 15%;
          animation: shoot 20s linear infinite;
          animation-delay: 4s;
        }

        .shooting-star.ss2 {
          top: 38%;
          right: 45%;
          animation: shoot 26s linear infinite;
          animation-delay: 12s;
        }

        .animate-swing {
          animation: swing 3.8s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Cinematic Screen-Edge Vignette */}
      <div className="absolute inset-0 pointer-events-none z-45 shadow-[inset_0_0_90px_rgba(0,0,0,0.85)]" />

      {/* Deep Space Background Layers */}
      <div className="absolute inset-0 z-0">
        <CinematicBackground />
        
        {/* Twinkling star field */}
        <div className="absolute inset-0 z-2 opacity-70">
          <CinematicStars />
        </div>
        
        <CinematicNebula />
        
        {/* Slow cinematic bokeh lights */}
        <div className="absolute top-[20%] right-[10%] w-60 h-60 rounded-full bg-purple-500/5 blur-[85px] pointer-events-none z-1" />
        <div className="absolute bottom-[15%] left-[5%] w-72 h-72 rounded-full bg-amber-500/5 blur-[95px] pointer-events-none z-1" />
        
        {/* Slow shooting star flares */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-2">
          <div className="shooting-star ss1" />
          <div className="shooting-star ss2" />
        </div>

        {/* Drifting space stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-3">
          <div className="drifting-star s1" />
          <div className="drifting-star s2" />
        </div>

        {/* Large soft glowing Moon behind card */}
        <div className="absolute top-[8%] left-[10%] w-80 h-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fffaf0_0%,#dcd4bf_50%,transparent_100%)] opacity-[0.16] pointer-events-none blur-[4px] z-1" />
        
        {/* Soft clouds/mist at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#02010b] via-amber-900/5 to-transparent pointer-events-none z-10 blur-[10px]" />
      </div>

      {/* Hanging Warm Fairy Lights swinging at the top */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none z-10 flex justify-between px-8">
        <svg className="absolute top-0 inset-x-0 w-full h-12" preserveAspectRatio="none" viewBox="0 0 1000 40">
          <path d="M 0 0 Q 125 28 250 8 Q 375 32 500 12 Q 625 32 750 12 Q 875 28 1000 0" fill="none" stroke="rgba(213, 195, 156, 0.35)" strokeWidth="1.2" />
        </svg>
        {[45, 145, 245, 345, 445, 545, 645, 745, 845, 945].map((x, idx) => (
          <div
            key={idx}
            className="absolute w-2.5 h-3.5 rounded-full bg-yellow-100/90 shadow-[0_0_15px_#fde68a,0_0_5px_#d97706] animate-swing"
            style={{
              left: `${x / 10}%`,
              top: `${20 + Math.sin(idx) * 6}px`,
              transformOrigin: 'top center',
              animationDelay: `${idx * 0.28}s`,
              animationDuration: `${3.2 + Math.sin(idx) * 1.2}s`
            }}
          />
        ))}
      </div>

      {/* Center Spotlight glow */}
      <div className="absolute w-[65vw] h-[65vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.22)_0%,rgba(245,158,11,0.06)_50%,transparent_70%)] pointer-events-none z-5 transition-all duration-[2500ms] blur-[45px]"
        style={{
          opacity: letterStage === 'hidden' ? 0 : (letterStage === 'glow' || letterStage === 'balloons') ? 1.0 : 0.25,
          transform: 'scale(1.15)'
        }}
      />

      {/* Floating fireflies glowing randomly */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {fireflies.map((ff) => (
          <div
            key={ff.id}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-300 pointer-events-none blur-[0.6px]"
            style={{
              top: `${ff.top}%`,
              left: `${ff.left}%`,
              boxShadow: '0 0 10px #fde68a, 0 0 20px #f59e0b',
              animation: `fireflyPulse ${ff.speed}s ease-in-out infinite alternate`,
              animationDelay: `${ff.delay}s`,
              '--sway-x': `${ff.swayX}px`,
              '--sway-y': `${ff.swayY}px`
            }}
          />
        ))}
      </div>

      {/* Dynamic Canvas Celebration Fireworks (Rendered behind the letter card) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Celebration side balloons (Rise once and float away naturally in 8-10 seconds) */}
      {['balloons', 'letter-fade-in', 'writing', 'footer'].includes(letterStage) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {balloons.map((b) => (
            <div
              key={b.id}
              className="absolute bottom-0"
              style={{
                left: `${b.left}vw`,
                width: `${b.size}px`,
                height: `${b.size * 1.3}px`,
                zIndex: b.zIndex,
                filter: b.zIndex > 30 ? 'blur(0.8px)' : 'none',
                // Animates floatUp forwards once (leaving screen in 8-10s)
                animation: `floatUp ${b.speed}s linear forwards, sway ${b.swayDur}s ease-in-out infinite alternate`,
                animationDelay: `${b.delay}s`,
                '--rot-start': `${b.rotation - 4}deg`,
                '--rot-end': `${b.rotation + 4}deg`,
                '--sway-amt': `${b.swayAmt}px`
              }}
            >
              <svg viewBox="0 0 50 80" className="w-full h-full">
                {/* Balloon String */}
                <path d="M 25,50 Q 20,68 25,80" fill="none" stroke="rgba(213, 195, 156, 0.3)" strokeWidth="0.8" />
                
                {/* Latex Body */}
                {b.shape === 'heart' && (
                  <path d="M 25,12 C 25,12 21,5 13,5 C 5,5 0,12 0,22 C 0,35 15,45 25,50 C 35,45 50,35 50,22 C 50,12 45,5 37,5 C 29,5 25,12 25,12 Z" fill={b.color} />
                )}
                {b.shape === 'star' && (
                  <path d="M 25,2 L 31,16 L 46,16 L 34,26 L 38,40 L 25,32 L 12,40 L 16,26 L 4,16 L 19,16 Z" fill={b.color} />
                )}
                {b.shape === 'oval' && (
                  <path d="M 25,0 C 40,0 50,15 50,30 C 50,42 38,50 25,50 C 12,50 0,42 0,30 C 0,15 10,0 25,0 Z" fill={b.color} />
                )}
                {b.shape === 'pearl' && (
                  <>
                    <path d="M 25,0 C 40,0 50,15 50,30 C 50,42 38,50 25,50 C 12,50 0,42 0,30 C 0,15 10,0 25,0 Z" fill={b.color} />
                    <ellipse cx="18" cy="14" rx="4.5" ry="7.5" fill="rgba(255,255,255,0.22)" transform="rotate(-15 18 14)" />
                  </>
                )}
                {/* Knot */}
                <polygon points="22,50 28,50 25,47" fill="#caa153" opacity="0.75" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Realistic Ambient Occlusion Drop Shadow Layer (Moves opposite to cursor tilt) */}
      <div 
        className="absolute w-[90vw] md:w-[72vw] h-[85vh] max-w-[800px] max-h-[720px] bg-black/65 rounded-[24px] blur-[30px] pointer-events-none z-25 transition-all duration-[3000ms] ease-out"
        style={{
          opacity: isLetterVisible ? 1.0 : 0,
          transform: `translate(${tilt.y * -4}px, ${tilt.x * 4 + 20}px) scale(${isLetterVisible ? 0.98 : 0.965})`
        }}
      />

      {/* The Handcrafted Ivory Letter Card */}
      <div 
        ref={cardRef}
        onClick={handleCardClick}
        className={`relative rounded-[24px] flex flex-col justify-between p-6 md:p-12 border border-[#d5c39c]/65 select-none z-30 transition-all duration-[3000ms] ease-out ${
          letterStage === 'writing' ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''
        }`}
        style={{
          width: '90vw',
          maxWidth: '800px',
          height: '85vh',
          maxHeight: '720px',
          opacity: isLetterVisible ? 1.0 : 0,
          transform: `scale(${isLetterVisible ? 1.0 : 0.985}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          backgroundImage: 'linear-gradient(135deg, #fffdf8 0%, #f9f1df 50%, #f1e5c2 100%)',
          boxShadow: 'inset 0 0 35px rgba(255, 255, 255, 0.4), inset -8px -8px 24px rgba(120, 53, 4, 0.04), inset 8px 8px 24px rgba(255, 255, 255, 0.6)'
        }}
      >
        {/* Sparkling particle trails container */}
        <div id="writing-sparkles-container" className="absolute inset-0 pointer-events-none z-45" />

        {/* Handmade paper fibers texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.09] pointer-events-none rounded-[24px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,22 Q18,27 15,38 M48,78 Q55,73 60,88 M95,45 Q88,60 98,70 M115,108 Q125,118 120,128' stroke='%237c5f3b' stroke-width='0.45' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px'
          }}
        />

        {/* Delicate golden rim light glow */}
        <div className="absolute inset-0 pointer-events-none rounded-[24px] shadow-[inset_0_0_24px_rgba(253,224,71,0.13),0_0_18px_rgba(251,191,36,0.12)]" />

        {/* Ambient floating golden stars/dust around letter edges */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                boxShadow: '0 0 8px rgba(251,191,36,0.85)',
                animation: `floatDust ${p.speed}s linear infinite`,
                animationDelay: `${p.delay}s`,
                '--max-op': p.maxOpacity,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`
              }}
            />
          ))}
        </div>

        {/* Embossed Gold Border Frame */}
        <div className="absolute inset-5 rounded-[20px] border border-amber-600/35 pointer-events-none">
          <div className="absolute inset-[2px] border border-amber-500/10 rounded-[18px]" />
        </div>

        {/* Handcrafted floral corners with stars/leaves motifs */}
        <div className="absolute top-5 left-5 w-10 h-10 pointer-events-none text-amber-700/50">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M 3 3 L 20 3 M 3 3 L 3 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 6 6 L 12 12" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="24" cy="3" r="1.2" fill="currentColor" />
            <circle cx="3" cy="24" r="1.2" fill="currentColor" />
            <path d="M 12 6 L 14 8 L 16 6 L 14 4 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-5 right-5 w-10 h-10 pointer-events-none text-amber-700/50 transform rotate-90">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M 3 3 L 20 3 M 3 3 L 3 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 6 6 L 12 12" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="24" cy="3" r="1.2" fill="currentColor" />
            <circle cx="3" cy="24" r="1.2" fill="currentColor" />
            <path d="M 12 6 L 14 8 L 16 6 L 14 4 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-5 left-5 w-10 h-10 pointer-events-none text-amber-700/50 transform -rotate-90">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M 3 3 L 20 3 M 3 3 L 3 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 6 6 L 12 12" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="24" cy="3" r="1.2" fill="currentColor" />
            <circle cx="3" cy="24" r="1.2" fill="currentColor" />
            <path d="M 12 6 L 14 8 L 16 6 L 14 4 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-5 right-5 w-10 h-10 pointer-events-none text-amber-700/50 transform rotate-180">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M 3 3 L 20 3 M 3 3 L 3 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 6 6 L 12 12" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="24" cy="3" r="1.2" fill="currentColor" />
            <circle cx="3" cy="24" r="1.2" fill="currentColor" />
            <path d="M 12 6 L 14 8 L 16 6 L 14 4 Z" fill="currentColor" />
          </svg>
        </div>

        {/* --- Header Section --- */}
        <div className="relative z-10 text-center mt-2">
          <h2 className="text-xl md:text-2xl font-serif font-bold tracking-widest bg-gradient-to-r from-[#d9a74a] via-[#fde68a] to-[#b45309] bg-clip-text text-transparent uppercase select-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.1)]">
            ✨ To My Dearest Friend ✨
          </h2>
          
          {/* Small decorative leaf divider */}
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#caa153]/40" />
            <svg className="w-3.5 h-3.5 text-[#caa153]/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11.5 6 8 9 4 9C8 9 11.5 12 12 16C12.5 12 16 9 20 9C16 9 12.5 6 12 2Z" />
            </svg>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#caa153]/40" />
          </div>
          
          <p className="text-xs md:text-sm font-sans tracking-widest text-[#8c6b3e] uppercase">
            {formattedDate}
          </p>
        </div>

        {/* Dynamic User Alert Banner for skipping/scrolling */}
        {letterStage === 'writing' && (
          <div className="relative z-10 mx-auto w-[90%] md:w-[80%] bg-amber-900/5 border border-amber-600/15 rounded-xl py-2 px-3 flex items-center justify-center gap-2 animate-pulse mt-1 select-none">
            <span className="text-[11px] md:text-xs">💡</span>
            <p className="text-[10px] md:text-[11px] font-sans font-bold text-amber-900/70 tracking-wide text-center">
              Tap card to skip drawing animation &nbsp;|&nbsp; Drag / scroll up to read more
            </p>
          </div>
        )}

        {/* --- Body Text (Character-by-character stroke-reveal markup) --- */}
        <div ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 max-w-[620px] mx-auto text-center flex flex-col gap-4 mt-2 py-4 scrollbar-clean select-text">
          {PARAGRAPHS.map((pText, pIdx) => {
            return (
              <p 
                key={pIdx} 
                className="font-handwritten text-lg md:text-2xl text-[#4b321a] leading-relaxed text-center"
              >
                {pText.split('').map((char, cIdx) => {
                  const isDropCap = pIdx === 0 && cIdx === 0;
                  return (
                    <span
                      key={cIdx}
                      className={`char-span ${isDropCap ? 'is-drop-cap' : ''}`}
                      style={{ opacity: 0 }}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>

        {/* --- Signature Line (Handwritten sign space reserved) --- */}
        <div className="relative h-16 mt-1 mr-2 z-10">
          <div 
            className="signature-line absolute right-8 bottom-1 font-handwritten text-2xl text-[#4b321a] opacity-0 transition-opacity duration-[1200ms] select-none flex flex-col items-center"
            style={{ transitionDelay: '0.2s' }}
          >
            <p className="text-[13px] font-handwritten text-[#6b4c30] italic">Your Friend,</p>
            <p className="font-bold mt-0.5 text-3xl">Yashas yadav</p>
            <div className="text-amber-500 mt-1 text-sm">❤️</div>
          </div>
        </div>

        {/* --- Footer message & Navigation Control Buttons (Rendered inside the card flex-flow to prevent overlap) --- */}
        {showFooter && (
          <div 
            className="relative z-10 w-full text-center flex flex-col items-center gap-2 mt-2 select-none"
            style={{ animation: 'fadeInUp 1.2s ease forwards' }}
          >
            {/* Bottom Message Banner */}
            <div className="w-full text-center flex flex-col items-center gap-1.5 px-4">
              <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#caa153]/25 to-transparent" />
              <p className="text-xs md:text-sm font-sans tracking-widest text-[#8c6b3e] uppercase font-semibold">
                ✨ Closing Quote ✨
              </p>
              <p className="text-[11px] md:text-xs font-sans tracking-wide text-amber-800/85 max-w-[560px] mx-auto leading-relaxed italic">
                &ldquo;Some friendships don&apos;t need daily conversations to remain special. They simply stay quietly in the heart, becoming beautiful memories that time can never erase.&rdquo; ❤️
              </p>
              <p className="text-[9px] font-sans tracking-widest text-amber-900/50 uppercase mt-1 select-none animate-pulse font-bold">
                📜 Scroll or drag up to read the full letter
              </p>
              <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#caa153]/25 to-transparent" />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mt-1 justify-center z-50 pointer-events-auto">
              <button
                onClick={handleReadAgain}
                className="px-5 py-2 rounded-full border border-amber-600/40 text-amber-950 font-sans text-xs font-bold tracking-widest bg-amber-950/5 hover:bg-amber-900/15 hover:border-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.18)] transition-all duration-300 cursor-pointer"
              >
                📖 Read Again
              </button>
              <button
                onClick={handleContinue}
                className="px-5 py-2 rounded-full border border-amber-600/40 text-amber-950 font-sans text-xs font-bold tracking-widest bg-amber-950/5 hover:bg-amber-900/15 hover:border-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.18)] transition-all duration-300 cursor-pointer"
              >
                ❤️ Finish Journey
              </button>
            </div>
          </div>
        )}

        {/* Embossed base footer divider (visual thickness accent - shifted up to divide signature and footer) */}
        <div className="absolute inset-x-12 bottom-[24%] h-px bg-gradient-to-r from-transparent via-amber-600/15 to-transparent pointer-events-none" />
      </div>

      {/* Floating Golden Fountain Pen (Absolute relative to full viewport screen coordinates with left:0, top:0) */}
      <div 
        ref={penRef}
        className="absolute w-28 h-28 pointer-events-none z-50 filter drop-shadow-[0_0_24px_rgba(251,191,36,0.68)]"
        style={{
          left: 0,
          top: 0,
          opacity: 0,
          transformOrigin: 'bottom left',
          marginLeft: '-3px',
          marginTop: '-109px',
          display: letterStage === 'writing' ? 'block' : 'none'
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-5deg)' }}>
          <defs>
            <linearGradient id="quillGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="featherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
              <stop offset="60%" stopColor="#fef3c7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d="M 12 88 Q 32 52 78 8 Q 58 42 12 88 Z" fill="url(#featherGrad)" stroke="url(#quillGold)" strokeWidth="0.8" />
          <path d="M 22 75 Q 36 58 68 18" fill="none" stroke="url(#quillGold)" strokeWidth="0.5" />
          <path d="M 10 90 L 16 80 L 11 76 L 19 68 L 25 73 L 20 80 L 10 90 Z" fill="url(#quillGold)" stroke="#543005" strokeWidth="0.5" strokeLinejoin="round" />
          <line x1="10" y1="90" x2="18" y2="76" stroke="#543005" strokeWidth="0.5" />
          <circle cx="18" cy="76" r="0.8" fill="#543005" />
        </svg>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-yellow-100 rounded-full blur-[2px] shadow-[0_0_12px_#fbbf24] mix-blend-screen" />
      </div>

      {/* Fade helper transition styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default FriendshipLetterScene;