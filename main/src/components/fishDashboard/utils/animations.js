// utils/animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initCyberAnimations = () => {
  // Matrix text reveal
  gsap.utils.toArray('.cyber-reveal').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%"
      }
    });
  });

  // Floating elements
  gsap.utils.toArray('.float').forEach(el => {
    gsap.to(el, {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  });

  // Data stream effect
  const streamElements = document.querySelectorAll('.data-stream');
  streamElements.forEach(el => {
    gsap.to(el, {
      backgroundPosition: '0% 100%',
      duration: 10,
      repeat: -1,
      ease: "none"
    });
  });

  // Terminal cursor blink
  const cursor = document.querySelector('.terminal-cursor');
  if (cursor) {
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true
    });
  }
};