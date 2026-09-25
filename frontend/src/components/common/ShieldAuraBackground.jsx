import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * ShieldAuraBackground — Zenith Auroral Topography & Kinetic Neural Link
 * ───────────────────────────────────────────────────────────────────────
 * A high-art generative background concept:
 * 1. Topographical Contour Waves: Elegant zen sand & cybernetic elevation iso-lines.
 * 2. Magnetic Cursor Vortex: Smooth gravitational repulsion that dynamically bends terrain contours.
 * 3. Autonomous Constellation Nodes: Floating defense anchors that form glowing golden neural links on proximity.
 * 4. Ambient Atmospheric Gradient: Preserves deep contrast and 100% crisp typography legibility.
 * 5. Shooting Star & Meteor Showers: Dynamic periodic bursts of golden meteors trailing incandescent ember dust.
 */
const ShieldAuraBackground = () => {
  const canvasRef = useRef(null);
  const themeContext = useTheme();
  const isDarkMode = themeContext?.isDark ?? true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };
    window.addEventListener('resize', handleResize);

    // Dynamic mouse with momentum damping
    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
      radius: 240,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Neural Constellation Nodes ─────────────────────────────
    let nodes = [];
    const NODE_COUNT = 32;

    const initNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };
    initNodes();

    // ── Shooting Stars & Meteor Showers ───────────────────────
    let shootingStars = [];
    let nextShowerTime = 120; // frames until next shower check

    const spawnShootingStar = (isShower = false) => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 deg downward streak
      const speed = Math.random() * 8 + 14;
      const startX = Math.random() * (width * 1.2) - width * 0.1;
      const startY = Math.random() * (height * 0.4) - 50;
      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 90 + 70,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        size: Math.random() * 1.8 + 1.2,
        life: 0,
        maxLife: Math.random() * 35 + 25,
        alpha: Math.random() * 0.5 + 0.5,
      });
    };

    let time = 0;

    const render = () => {
      time += 0.007;

      // Mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Check for star shower trigger
      nextShowerTime--;
      if (nextShowerTime <= 0) {
        // Random star burst: 2 to 5 shooting stars
        const count = Math.random() < 0.4 ? Math.floor(Math.random() * 4 + 2) : 1;
        for (let s = 0; s < count; s++) {
          setTimeout(() => spawnShootingStar(count > 1), s * 220);
        }
        nextShowerTime = Math.floor(Math.random() * 300 + 200); // Trigger every ~4-8s
      }

      // ── 1. Atmosphere Base Gradient ──────────────────────────
      if (isDarkMode) {
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#0c0a08');
        bg.addColorStop(0.45, '#070604');
        bg.addColorStop(1, '#020202');
        ctx.fillStyle = bg;
      } else {
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#faf8f4');
        bg.addColorStop(0.5, '#f4ece0');
        bg.addColorStop(1, '#ebe0d0');
        ctx.fillStyle = bg;
      }
      ctx.fillRect(0, 0, width, height);

      // ── 2. Atmospheric Radial Auroral Glows ───────────────────
      const aura1X = width * 0.35 + Math.sin(time * 0.6) * 100;
      const aura1Y = height * 0.3 + Math.cos(time * 0.5) * 70;
      const rad1 = ctx.createRadialGradient(aura1X, aura1Y, 30, aura1X, aura1Y, width * 0.55);
      if (isDarkMode) {
        rad1.addColorStop(0, 'rgba(217, 119, 6, 0.09)');
        rad1.addColorStop(0.5, 'rgba(180, 83, 9, 0.025)');
        rad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        rad1.addColorStop(0, 'rgba(217, 119, 6, 0.07)');
        rad1.addColorStop(0.5, 'rgba(180, 83, 9, 0.02)');
        rad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, width, height);

      // Interactive cursor core glow
      const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, mouse.radius);
      if (isDarkMode) {
        cursorGlow.addColorStop(0, 'rgba(245, 158, 11, 0.13)');
        cursorGlow.addColorStop(0.4, 'rgba(217, 119, 6, 0.04)');
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        cursorGlow.addColorStop(0, 'rgba(217, 119, 6, 0.1)');
        cursorGlow.addColorStop(0.4, 'rgba(180, 83, 9, 0.03)');
        cursorGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // ── 3. Shooting Star Showers ─────────────────────────────
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += star.speedX;
        star.y += star.speedY;
        star.life++;

        const progress = star.life / star.maxLife;
        const currentAlpha = star.alpha * (1 - progress);

        // Tail gradient
        const tailX = star.x - (star.speedX / Math.hypot(star.speedX, star.speedY)) * star.length;
        const tailY = star.y - (star.speedY / Math.hypot(star.speedX, star.speedY)) * star.length;

        const starGrad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        const headColor = isDarkMode
          ? `rgba(254, 240, 138, ${currentAlpha})`
          : `rgba(217, 119, 6, ${currentAlpha})`;
        const midColor = isDarkMode
          ? `rgba(245, 158, 11, ${currentAlpha * 0.6})`
          : `rgba(234, 179, 8, ${currentAlpha * 0.4})`;

        starGrad.addColorStop(0, headColor);
        starGrad.addColorStop(0.3, midColor);
        starGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = star.size * (1 - progress * 0.5);
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Luminous glowing head
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.life >= star.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      // ── 4. Topographical Zen Sand & Iso-contour Waves ─────────
      const CONTOUR_COUNT = 9;
      const contourSpacing = height / (CONTOUR_COUNT + 1);

      ctx.lineWidth = 1.1;

      for (let c = 1; c <= CONTOUR_COUNT; c++) {
        const baseY = c * contourSpacing;
        const freq = 0.0022 + c * 0.0003;
        const speed = time * (0.8 + c * 0.1);
        const amp = 16 + c * 3;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 14) {
          // Double harmonic wave
          const wave1 = Math.sin(x * freq + speed) * amp;
          const wave2 = Math.cos(x * freq * 0.6 - speed * 0.4 + c) * (amp * 0.5);

          // Magnetic mouse vortex deflection
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseDeflect = dist < mouse.radius
            ? Math.sin((1 - dist / mouse.radius) * Math.PI) * (dy > 0 ? 28 : -28)
            : 0;

          const y = baseY + wave1 + wave2 + mouseDeflect;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const alpha = isDarkMode ? 0.03 + (c % 2 === 0 ? 0.025 : 0.015) : 0.04 + (c % 2 === 0 ? 0.03 : 0.02);
        ctx.strokeStyle = isDarkMode
          ? `rgba(245, 158, 11, ${alpha})`
          : `rgba(180, 110, 30, ${alpha})`;
        ctx.stroke();
      }

      // ── 5. Neural Constellation Links & Node Proximity ─────────
      const LINK_DIST = 140;

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Subtle repulsion from cursor
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          node.x += (dx / dist) * 0.8;
          node.y += (dy / dist) * 0.8;
        }
      });

      // Draw Proximity Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DIST) {
            const linkAlpha = (1 - dist / LINK_DIST) * (isDarkMode ? 0.18 : 0.14);
            ctx.strokeStyle = isDarkMode
              ? `rgba(251, 191, 36, ${linkAlpha})`
              : `rgba(217, 119, 6, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Draw Mouse to Node Links
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          const mouseLinkAlpha = (1 - mdist / 160) * (isDarkMode ? 0.28 : 0.22);
          ctx.strokeStyle = isDarkMode
            ? `rgba(251, 191, 36, ${mouseLinkAlpha})`
            : `rgba(217, 119, 6, ${mouseLinkAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw Individual Nodes
        const pulse = Math.sin(time * 3 + nodes[i].pulseOffset) * 0.3 + 0.7;
        ctx.fillStyle = isDarkMode
          ? `rgba(251, 191, 36, ${0.5 * pulse})`
          : `rgba(180, 110, 30, ${0.45 * pulse})`;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isDarkMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default ShieldAuraBackground;
