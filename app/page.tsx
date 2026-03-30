"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const UNLOCK_CODE = "Samsonline";

const LETTER_PARAGRAPHS = [
  { text: "Happy Birthday, sister Pascyyyyyyy…", type: "title" },
  { text: "There are people life gives you, and then there are people life blesses you with — you are both to us.", type: "body" },
  { text: "We have been thinking about what to write to you, and honestly, words feel too small for what we carry in our hearts for you.", type: "body" },
  { text: "You are one of the most renowned forces in our lives. The kind of presence that doesn't always ask to be seen, but holds everything together in ways that only time and reflection can truly reveal.", type: "body" },
  { text: "There are so many moments we look back on now and realize that we were able to stand, grow, and keep going… because you were there.", type: "body" },
  { text: "We don't think we say it enough… but we see you, we love you, and we appreciate you.", type: "emphasis" },
  { text: "We see your sacrifices — even the ones you never speak about. We see the strength it takes to show up for someone else, over and over again. We see the way you give not out of convenience, but out of love.", type: "body" },
  { text: "And if we are being honest, there are parts of our lives that only make sense because you stood in the gap for us.", type: "body" },
  { text: "You have been more than a sister to us. You have been a covering, a support system, a steady hand, and a reminder that we are never alone. And we don't take that for granted — not for one second.", type: "body" },
  { text: "This new year of your life, we don't just wish you happiness — we pray for you deeply.", type: "emphasis" },
  { text: "We pray that life begins to meet you with the same kindness you have shown others, us especially. We pray that everything you have poured out comes back to you in ways that overwhelm you with joy. We pray that you experience ease, rest, and fulfillment — not just as dreams, but as your reality.", type: "body" },
  { text: "You deserve to be carried too. You deserve to be seen, celebrated, and poured into.", type: "emphasis" },
  { text: "And as we grow, we want you to know this — we will spend our lives becoming someone you can be proud of. Not just in words, but in results. In impact. In the way we live. Because if there's anyone whose sacrifices must never be in vain, it's yours.", type: "body" },
  { text: "May this year reward you for every good thing you have ever done.", type: "body" },
  { text: "We love you endlessly. — C & E 🌸", type: "closing" },
];

const PHOTOS = [
  { src: "/photos/pascy1.jpeg", caption: "The one who holds everything together", num: "01" },
  { src: "/photos/pascy2.jpeg", caption: "A force that never asks to be seen", num: "02" },
  { src: "/photos/pascy3.jpeg", caption: "Our steady hand through every storm", num: "03" },
  { src: "/photos/pascy4.jpeg", caption: "A love that shows up, always", num: "04" },
];

const SONGS = ["/songs/song1.mp3", "/songs/song2.mp3", "/songs/song3.mp3"];
const SONG_NAMES = [
  "A Thousand Years — Christina Perri",
  "Never Enough — Loren Allred",
  "You Are The Reason — Calum Scott",
];

type Phase = "lock" | "title" | "photos" | "letter" | "close";

type Petal = {
  id: number;
  x: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  color: string;
};

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      op: Math.random() * 0.45 + 0.08, pulse: Math.random() * Math.PI * 2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.pulse += 0.011; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const a = p.op * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ✅ FIX: Petals now initialises random values only on the client (inside useEffect)
// This prevents the SSR ↔ client mismatch that caused the hydration error.
function Petals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 5 + Math.random() * 11,
        dur: 13 + Math.random() * 18,
        delay: Math.random() * 16,
        drift: 40 + Math.random() * 120,
        color:
          i % 3 === 0
            ? "rgba(212,155,88,0.28)"
            : i % 3 === 1
            ? "rgba(220,130,110,0.22)"
            : "rgba(240,190,120,0.18)",
      }))
    );
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x + "%",
            top: "-20px",
            width: p.size + "px",
            height: p.size * 0.65 + "px",
            borderRadius: "50% 0 50% 0",
            background: p.color,
            animation: `petalDrift ${p.dur}s ${p.delay}s infinite linear`,
            "--drift": p.drift + "px",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function PascyBirthday() {
  const [phase, setPhase] = useState<Phase>("lock");
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [songBanner, setSongBanner] = useState("");
  const [visibleParas, setVisibleParas] = useState<number[]>([]);
  const [unlocking, setUnlocking] = useState(false);
  const [titleIn, setTitleIn] = useState(false);
  const [slideDir, setSlideDir] = useState<"in" | "out-left" | "out-right">("in");
  const [transitioning, setTransitioning] = useState(false);

  const audio = useRef<HTMLAudioElement | null>(null);
  const paraRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lockRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const playTrack = useCallback((i: number) => {
    const a = new Audio(SONGS[i]); a.loop = true; a.volume = 0;
    a.play().catch(() => {});
    if (audio.current) {
      const old = audio.current; let v = old.volume;
      const t = setInterval(() => { v = Math.max(0, v - 0.025); old.volume = v; if (v <= 0) { old.pause(); clearInterval(t); } }, 40);
    }
    audio.current = a; let vol = 0;
    const t = setInterval(() => { vol = Math.min(vol + 0.012, 0.48); a.volume = vol; if (vol >= 0.48) clearInterval(t); }, 50);
    setSongBanner(SONG_NAMES[i]);
    setTimeout(() => setSongBanner(""), 5500);
  }, []);

  const unlock = () => {
    if (code.trim() === UNLOCK_CODE) {
      setUnlocking(true);
      setTimeout(() => {
        setPhase("title"); playTrack(0);
        setTimeout(() => setTitleIn(true), 300);
        setTimeout(() => setPhase("photos"), 5800);
      }, 900);
    } else {
      setErr(true);
      lockRef.current?.animate([
        { transform: "translateX(-10px)" }, { transform: "translateX(10px)" },
        { transform: "translateX(-6px)" }, { transform: "translateX(6px)" },
        { transform: "translateX(0)" }
      ], { duration: 380 });
    }
  };

  useEffect(() => {
    if (phase !== "letter") return;
    playTrack(1);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt((e.target as HTMLElement).dataset.idx || "0");
          setVisibleParas(p => p.includes(idx) ? p : [...p, idx]);
        }
      });
    }, { threshold: 0.12 });
    setTimeout(() => paraRefs.current.forEach(el => el && observer.observe(el)), 400);
    return () => observer.disconnect();
  }, [phase, playTrack]);

  const goPhoto = (dir: 1 | -1) => {
    if (transitioning) return;
    const nx = photoIdx + dir;
    if (nx < 0) return;
    if (nx >= PHOTOS.length) { setPhase("letter"); return; }
    setTransitioning(true);
    setSlideDir(dir === 1 ? "out-left" : "out-right");
    setTimeout(() => {
      setPhotoIdx(nx);
      setSlideDir("in");
      setTimeout(() => setTransitioning(false), 600);
    }, 320);
  };

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) goPhoto(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const G = "linear-gradient(135deg,#B8862A,#D4AF37,#F0D060,#D4AF37,#B8862A)";
  const GOLD = "#D4AF37";
  const INK = "#0A0600";
  const PAPER = "#FAF7F0";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
        html, body { height: 100%; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder { color: rgba(212,175,55,0.22); }
        button { cursor: pointer; outline: none; border: none; background: none; }

        @keyframes petalDrift {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 1; } 92% { opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(500deg); opacity: 0; }
        }
        @keyframes shimmer { 0% { background-position: -300% center; } 100% { background-position: 300% center; } }
        @keyframes floatBob { 0%,100% { transform: translateY(0) rotate(-1.2deg); } 50% { transform: translateY(-16px) rotate(1deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes rotateSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulseRing { 0%,100% { opacity:0.25; transform:scale(1); } 50% { opacity:0.65; transform:scale(1.06); } }
        @keyframes lockExit { 0% { transform:scale(1); opacity:1; filter:blur(0); } 100% { transform:scale(1.08) translateY(-40px); opacity:0; filter:blur(20px); } }
        @keyframes lineGrow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        @keyframes scanLine { 0% { top:-2px; opacity:0; } 10% { opacity:1; } 90% { opacity:0.5; } 100% { top:100vh; opacity:0; } }
        @keyframes borderPulse { 0%,100% { border-color:rgba(212,175,55,0.16); } 50% { border-color:rgba(212,175,55,0.42); } }
        @keyframes slideInFromRight { from { opacity:0; transform:translateX(56px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInFromLeft  { from { opacity:0; transform:translateX(-56px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideOutToLeft   { from { opacity:1; transform:translateX(0); }    to { opacity:0; transform:translateX(-56px); } }
        @keyframes slideOutToRight  { from { opacity:1; transform:translateX(0); }    to { opacity:0; transform:translateX(56px); } }
        @keyframes kenBurns { from { transform:scale(1.07) translate(3px,-2px); } to { transform:scale(1.0) translate(0,0); } }
        @keyframes captionIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.12)} 28%{transform:scale(1)} 42%{transform:scale(1.08)} 70%{transform:scale(1)} }

        .btn-gold { transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease; }
        .btn-gold:hover { transform: translateY(-1px) scale(1.015); filter: brightness(1.08); box-shadow: 0 0 70px rgba(212,175,55,0.3), 0 8px 30px rgba(0,0,0,0.55) !important; }
        .btn-ghost { transition: all 0.22s ease; }
        .btn-ghost:hover { border-color: rgba(212,175,55,0.38) !important; color: rgba(212,175,55,0.7) !important; background: rgba(212,175,55,0.04) !important; }
        .pdot { transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Photos split: desktop side-by-side, mobile stacked ── */
        .photos-split {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          /* Cap width on very wide screens so it doesn't stretch absurdly */
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          height: 100vh;
        }
        .photos-img-panel {
          flex: 0 0 48%;
          position: relative;
          overflow: hidden;
          background: #020100;
          min-height: 0;
        }
        .photos-text-panel {
          flex: 1 1 52%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg,#100800 0%,#080400 45%,#030100 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(20px,4vh,48px) clamp(20px,4vw,52px);
          min-height: 0;
        }

        /* Mobile: stack image on top, text below */
        @media (max-width: 640px) {
          .photos-split {
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
          }
          .photos-img-panel {
            flex: 0 0 44vh;
            width: 100%;
          }
          .photos-text-panel {
            flex: 1 1 auto;
            width: 100%;
            overflow-y: auto;
            padding: 20px 22px 28px;
          }
        }

        /* Tablet: side by side but tighter */
        @media (min-width: 641px) and (max-width: 900px) {
          .photos-img-panel { flex: 0 0 42%; }
          .photos-text-panel { flex: 1 1 58%; padding: 24px 28px; }
        }
      `}</style>

      <main style={{
        minHeight: "100vh", width: "100%",
        background: "radial-gradient(ellipse at 30% 0%,#1C0F02 0%,#0E0800 55%,#040200 100%)",
        fontFamily: "'Cormorant Garamond',Georgia,serif",
        color: PAPER, overflow: "hidden", position: "relative",
      }}>
        <ParticleCanvas />
        <Petals />

        {/* Ambient glows */}
        <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"-30%", left:"50%", transform:"translateX(-50%)", width:"min(1100px,130vw)", height:"min(1100px,130vw)", borderRadius:"50%", background:"radial-gradient(circle,rgba(212,175,55,0.08) 0%,transparent 65%)", filter:"blur(90px)" }} />
          <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:"65vw", height:"65vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(180,100,50,0.06) 0%,transparent 65%)", filter:"blur(80px)" }} />
          <div style={{ position:"absolute", top:"40%", left:"-15%", width:"45vw", height:"45vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(212,130,40,0.04) 0%,transparent 65%)", filter:"blur(70px)" }} />
        </div>

        {/* Film grain */}
        <div style={{ position:"fixed", inset:0, zIndex:2, pointerEvents:"none", opacity:0.025, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* Song banner */}
        {songBanner && (
          <div style={{ position:"fixed", top:22, left:"50%", transform:"translateX(-50%)", zIndex:300, padding:"10px 28px", borderRadius:2, background:"rgba(8,4,0,0.96)", backdropFilter:"blur(40px)", color:GOLD, fontSize:9, fontFamily:"'Jost',sans-serif", letterSpacing:"0.32em", textTransform:"uppercase", whiteSpace:"nowrap", border:"0.5px solid rgba(212,175,55,0.25)", boxShadow:"0 10px 50px rgba(0,0,0,0.6)", animation:"fadeUp 0.5s both" }}>
            ♪ &nbsp;{songBanner}
          </div>
        )}

        {/* ══════ LOCK ══════ */}
        {phase === "lock" && (
          <div ref={lockRef} style={{ position:"fixed", inset:0, zIndex:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px", animation: unlocking ? "lockExit 0.9s ease forwards" : "fadeIn 1.4s both" }}>
            {[600,440,300].map((s,i) => (
              <div key={i} style={{ position:"absolute", width:`min(${s}px,94vw)`, height:`min(${s}px,94vw)`, borderRadius:"50%", border:`0.5px solid rgba(212,175,55,${0.04+i*0.035})`, animation:`rotateSlow ${24+i*8}s linear infinite ${i%2===1?"reverse":""}`, pointerEvents:"none" }} />
            ))}
            <div style={{ position:"absolute", width:"min(180px,50vw)", height:"min(180px,50vw)", borderRadius:"50%", border:"1px solid rgba(212,175,55,0.1)", animation:"pulseRing 3.5s ease-in-out infinite", pointerEvents:"none" }} />

            <div style={{ textAlign:"center", marginBottom:56, position:"relative", zIndex:1 }}>
              <div style={{ fontSize:"clamp(4rem,13vw,8rem)", lineHeight:1, marginBottom:32, animation:"floatBob 4s ease-in-out infinite", filter:"drop-shadow(0 0 80px rgba(212,175,55,0.6)) drop-shadow(0 20px 50px rgba(180,100,50,0.4))" }}>🎀</div>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9, letterSpacing:"0.55em", textTransform:"uppercase", color:"rgba(212,175,55,0.36)", marginBottom:22 }}>— a gift awaits you —</p>
              <div style={{ height:"0.5px", maxWidth:200, margin:"0 auto 26px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent)", transformOrigin:"center", animation:"lineGrow 1.6s 0.5s both" }} />
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,5.5vw,4rem)", fontWeight:300, letterSpacing:"0.06em", color:PAPER, margin:"0 0 12px", lineHeight:1.2 }}>
                What's the{" "}
                <em style={{ background:G, backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 5s linear infinite", fontWeight:600 }}>secret key?</em>
              </h1>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"rgba(250,247,240,0.18)", letterSpacing:"0.08em", fontWeight:300 }}>Enter the code below to open your gift</p>
            </div>

            <div style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:12, position:"relative", zIndex:1 }}>
              <input type="text" value={code}
                onChange={e => { setCode(e.target.value); setErr(false); }}
                onKeyDown={e => e.key === "Enter" && unlock()}
                placeholder="Enter secret code…"
                style={{ width:"100%", textAlign:"center", color:PAPER, padding:"18px 24px", borderRadius:2, outline:"none", fontSize:14, letterSpacing:"0.2em", fontFamily:"'Jost',sans-serif", fontWeight:300, background:"rgba(250,247,240,0.035)", backdropFilter:"blur(20px)", border: err ? "0.5px solid rgba(220,80,60,0.5)" : "0.5px solid rgba(212,175,55,0.2)", boxShadow:"inset 0 1px 0 rgba(212,175,55,0.06)", animation:"borderPulse 3.5s ease-in-out infinite", transition:"border 0.3s" }}
              />
              {err && <p style={{ color:"rgba(220,110,90,0.75)", fontSize:11, textAlign:"center", fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"0.08em", animation:"fadeUp 0.3s both" }}>Hmm… that's not quite right. Try again 🌸</p>}
              <button className="btn-gold" onClick={unlock} style={{ padding:"17px", borderRadius:2, color:INK, fontWeight:500, fontSize:11, fontFamily:"'Jost',sans-serif", letterSpacing:"0.25em", textTransform:"uppercase", background:G, backgroundSize:"300% auto", animation:"shimmer 5s linear infinite", boxShadow:"0 0 50px rgba(212,175,55,0.2),0 6px 28px rgba(0,0,0,0.55)" }}>
                Unlock Gift
              </button>
            </div>
          </div>
        )}

        {/* ══════ TITLE ══════ */}
        {phase === "title" && (
          <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.7),transparent)", animation:"scanLine 2.2s ease-in-out 0.3s both", zIndex:1 }} />
            <div style={{ textAlign:"center", padding:"0 24px", opacity:titleIn?1:0, transform:titleIn?"scale(1)":"scale(0.01)", filter:titleIn?"blur(0)":"blur(80px)", transition:"all 2.8s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9, letterSpacing:"0.65em", textTransform:"uppercase", color:"rgba(212,175,55,0.35)", marginBottom:32 }}>— this is for you —</p>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(5.5rem,22vw,16rem)", fontWeight:300, lineHeight:0.9, background:G, backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 6s linear infinite", filter:"drop-shadow(0 0 120px rgba(212,175,55,0.4))" }}>Pascy</div>
              <div style={{ height:"0.5px", maxWidth:80, margin:"30px auto 26px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)" }} />
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,2.8vw,2rem)", fontStyle:"italic", fontWeight:300, color:"rgba(250,247,240,0.38)", letterSpacing:"0.1em" }}>With everything we carry in our hearts.</p>
              <div style={{ marginTop:30, fontSize:"clamp(1.8rem,5vw,3rem)", animation:"heartbeat 2.2s 1s ease-in-out infinite" }}>🌸</div>
            </div>
          </div>
        )}

        {/* ══════ PHOTOS ══════ */}
        {phase === "photos" && (
          // ✅ FIX: className="photos-split" is now correctly applied to the wrapper
          // The outer fixed wrapper centres & constrains the card on big screens
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.7s both" }}
          >
            <div className="photos-split">

              {/* LEFT — photo panel */}
              <div className="photos-img-panel">
                <img
                  key={`img-${photoIdx}`}
                  src={PHOTOS[photoIdx].src}
                  alt=""
                  style={{
                    position:"absolute", inset:0, width:"100%", height:"100%",
                    objectFit:"cover", objectPosition:"center top",
                    animation:`kenBurns 10s ease-out forwards, ${
                      slideDir === "in"       ? "slideInFromLeft 0.65s cubic-bezier(0.22,1,0.36,1)" :
                      slideDir === "out-left" ? "slideOutToLeft 0.32s ease" :
                                               "slideOutToRight 0.32s ease"
                    }`,
                    filter:"brightness(0.76) saturate(0.88)",
                  }}
                />

                {/* Gradient overlays */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:2, background:"linear-gradient(to right,rgba(2,1,0,0.05) 0%,rgba(2,1,0,0) 45%,rgba(2,1,0,0.78) 100%)" }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"40%", pointerEvents:"none", zIndex:2, background:"linear-gradient(to top,rgba(2,1,0,0.72) 0%,transparent 100%)" }} />
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"24%", pointerEvents:"none", zIndex:2, background:"linear-gradient(to bottom,rgba(2,1,0,0.45) 0%,transparent 100%)" }} />

                {/* Progress pips */}
                <div style={{ position:"absolute", top:22, left:22, zIndex:10, display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                    {PHOTOS.map((_,i) => (
                      <div key={i} className="pdot" style={{ height:"1.5px", borderRadius:999, background: i===photoIdx?GOLD : i<photoIdx?"rgba(212,175,55,0.38)":"rgba(250,247,240,0.1)", width: i===photoIdx?28 : i<photoIdx?13:6 }} />
                    ))}
                  </div>
                  <span style={{ fontFamily:"'Jost',sans-serif", fontSize:8, letterSpacing:"0.36em", color:"rgba(212,175,55,0.35)", textTransform:"uppercase" }}>{PHOTOS[photoIdx].num} of 04</span>
                </div>

                {/* Ghost number */}
                <div style={{ position:"absolute", bottom:16, left:18, zIndex:3 }}>
                  <span key={`gnum-${photoIdx}`} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(4rem,8vw,7rem)", fontWeight:700, lineHeight:1, letterSpacing:"-0.04em", color:"rgba(212,175,55,0.1)", animation:"fadeUp 0.7s 0.1s both", userSelect:"none" }}>{PHOTOS[photoIdx].num}</span>
                </div>
              </div>

              {/* RIGHT — editorial text panel */}
              <div className="photos-text-panel">
                {/* Inner glow */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at 20% 50%,rgba(212,175,55,0.055) 0%,transparent 60%)" }} />
                {/* Seam line */}
                <div style={{ position:"absolute", left:0, top:"8%", bottom:"8%", width:"0.5px", background:"linear-gradient(to bottom,transparent,rgba(212,175,55,0.28) 30%,rgba(212,175,55,0.28) 70%,transparent)" }} />

                {/* TOP label */}
                <div style={{ position:"relative", zIndex:2 }}>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:8, letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(212,175,55,0.28)", marginBottom:12 }}>— For Pascy, with love</p>
                  <div style={{ width:40, height:"0.5px", background:"linear-gradient(to right,rgba(212,175,55,0.4),transparent)" }} />
                </div>

                {/* MIDDLE — caption */}
                <div
                  key={`cap-${photoIdx}`}
                  style={{
                    flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
                    position:"relative", zIndex:2, padding:"20px 0",
                    animation: slideDir === "in" ? "captionIn 0.75s 0.18s cubic-bezier(0.22,1,0.36,1) both" :
                               slideDir === "out-left" ? "slideOutToLeft 0.3s ease both" :
                               "slideOutToRight 0.3s ease both",
                  }}
                >
                  <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-58%)", fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(5rem,11vw,11rem)", fontWeight:700, lineHeight:1, color:"rgba(212,175,55,0.032)", userSelect:"none", letterSpacing:"-0.05em", pointerEvents:"none" }}>
                    {PHOTOS[photoIdx].num}
                  </div>

                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.4rem,4.5vw,4.5rem)", lineHeight:0.65, color:"rgba(212,175,55,0.18)", marginBottom:14, userSelect:"none" }}>"</div>

                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,2.1vw,1.9rem)", fontStyle:"italic", fontWeight:300, color:PAPER, lineHeight:1.65, letterSpacing:"0.01em", marginBottom:22, maxWidth:"92%", position:"relative", zIndex:1 }}>
                    {PHOTOS[photoIdx].caption}
                  </p>

                  <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative", zIndex:1 }}>
                    <div style={{ width:24, height:"0.5px", background:"rgba(212,175,55,0.4)" }} />
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:8, letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(212,175,55,0.38)" }}>C & E 🌸</span>
                  </div>
                </div>

                {/* BOTTOM — nav */}
                <div style={{ position:"relative", zIndex:2 }}>
                  <div style={{ height:"0.5px", background:"linear-gradient(to right,rgba(212,175,55,0.17),transparent)", marginBottom:16 }} />
                  <div style={{ display:"flex", gap:9 }}>
                    {photoIdx > 0 && (
                      <button className="btn-ghost" onClick={() => goPhoto(-1)} style={{ flex:"0 0 auto", padding:"12px 16px", borderRadius:2, border:"0.5px solid rgba(212,175,55,0.16)", color:"rgba(212,175,55,0.4)", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
                        ← Prev
                      </button>
                    )}
                    <button className="btn-gold" onClick={() => goPhoto(1)} style={{ flex:1, padding:"13px 18px", borderRadius:2, background:G, backgroundSize:"300% auto", animation:"shimmer 5s linear infinite", color:INK, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:500, boxShadow:"0 0 40px rgba(212,175,55,0.15),0 8px 28px rgba(0,0,0,0.55)" }}>
                      {photoIdx === PHOTOS.length - 1 ? "Read Our Letter →" : "Next Memory →"}
                    </button>
                  </div>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:8, color:"rgba(250,247,240,0.09)", letterSpacing:"0.18em", textTransform:"uppercase", marginTop:12, textAlign:"center" }}>swipe or tap to continue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ LETTER ══════ */}
        {phase === "letter" && (
          <div style={{ position:"relative", zIndex:50, minHeight:"100vh", padding:"100px 24px 150px", display:"flex", flexDirection:"column", alignItems:"center", animation:"fadeIn 1s both" }}>
            <div style={{ position:"fixed", left:0, top:0, bottom:0, width:"1px", background:"linear-gradient(180deg,transparent,rgba(212,175,55,0.22),transparent)", zIndex:10 }} />
            <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"1px", background:"linear-gradient(180deg,transparent,rgba(212,175,55,0.1),transparent)", zIndex:10 }} />

            <div style={{ textAlign:"center", marginBottom:84, maxWidth:640, width:"100%" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9, letterSpacing:"0.5em", textTransform:"uppercase", color:"rgba(212,175,55,0.3)", marginBottom:16 }}>♪ Never Enough — Loren Allred</p>
              <div style={{ height:"0.5px", maxWidth:90, margin:"0 auto 40px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.32),transparent)" }} />
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,7vw,5.5rem)", fontWeight:300, letterSpacing:"0.04em", color:PAPER, margin:0, lineHeight:1 }}>
                Our Letter{" "}
                <em style={{ background:G, backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 6s linear infinite", fontWeight:600, fontStyle:"italic" }}>to You</em>
              </h2>
            </div>

            <div style={{ maxWidth:620, width:"100%", position:"relative" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"9rem", lineHeight:0.5, color:"rgba(212,175,55,0.055)", userSelect:"none", position:"absolute", top:-14, left:-14 }}>"</div>

              {LETTER_PARAGRAPHS.map((para, i) => (
                <div key={i} ref={el => { paraRefs.current[i] = el; }} data-idx={i}
                  style={{ marginBottom: i===0?48:para.type==="emphasis"?36:28, opacity:visibleParas.includes(i)?1:0, transform:visibleParas.includes(i)?"translateY(0)":"translateY(26px)", transition:`opacity 1.1s ease ${Math.min(i*0.04,0.4)}s,transform 1.1s ease ${Math.min(i*0.04,0.4)}s` }}>
                  {para.type === "title" && <>
                    <div style={{ height:"0.5px", marginBottom:20, background:"linear-gradient(90deg,rgba(212,175,55,0.42),transparent)" }} />
                    <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.5rem,4vw,2.5rem)", fontWeight:600, margin:0, lineHeight:1.3, background:G, backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 6s linear infinite" }}>{para.text}</h3>
                    <div style={{ height:"0.5px", marginTop:20, background:"linear-gradient(90deg,rgba(212,175,55,0.22),transparent)" }} />
                  </>}
                  {para.type === "emphasis" && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,2.5vw,1.45rem)", fontStyle:"italic", fontWeight:400, color:"rgba(212,175,55,0.82)", margin:0, lineHeight:2.05, borderLeft:"1.5px solid rgba(212,175,55,0.28)", paddingLeft:22 }}>{para.text}</p>}
                  {para.type === "body" && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1rem,2.2vw,1.22rem)", fontWeight:300, color:"rgba(250,247,240,0.66)", margin:0, lineHeight:2.15 }}>{para.text}</p>}
                  {para.type === "closing" && (
                    <div style={{ marginTop:52, padding:"30px 34px", border:"0.5px solid rgba(212,175,55,0.16)", borderRadius:2, background:"linear-gradient(135deg,rgba(212,175,55,0.03) 0%,rgba(212,140,40,0.02) 100%)", boxShadow:"0 20px 60px rgba(0,0,0,0.3),inset 0 1px 0 rgba(212,175,55,0.07)" }}>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,2.5vw,1.4rem)", fontStyle:"italic", fontWeight:600, color:GOLD, margin:0, lineHeight:1.95 }}>{para.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop:64, animation:"fadeUp 1s 1.6s both" }}>
              <button className="btn-gold" onClick={() => { playTrack(2); setPhase("close"); }} style={{ padding:"16px 60px", borderRadius:2, background:G, backgroundSize:"300% auto", animation:"shimmer 5s linear infinite", color:INK, fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:500, boxShadow:"0 0 50px rgba(212,175,55,0.16),0 8px 32px rgba(0,0,0,0.55)" }}>
                One Last Thing →
              </button>
            </div>
          </div>
        )}

        {/* ══════ CLOSE ══════ */}
        {phase === "close" && (
          <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 28px", overflowY:"auto", animation:"fadeIn 2s both" }}>
            {[
              { top:24, left:24,  borderTop:"0.5px solid rgba(212,175,55,0.28)", borderLeft:"0.5px solid rgba(212,175,55,0.28)"  },
              { top:24, right:24, borderTop:"0.5px solid rgba(212,175,55,0.28)", borderRight:"0.5px solid rgba(212,175,55,0.28)" },
              { bottom:24, left:24,  borderBottom:"0.5px solid rgba(212,175,55,0.28)", borderLeft:"0.5px solid rgba(212,175,55,0.28)"  },
              { bottom:24, right:24, borderBottom:"0.5px solid rgba(212,175,55,0.28)", borderRight:"0.5px solid rgba(212,175,55,0.28)" },
            ].map((c,i) => <div key={i} style={{ position:"fixed", ...c, width:26, height:26 }} />)}

            <div style={{ maxWidth:520, width:"100%", textAlign:"center" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9, letterSpacing:"0.5em", textTransform:"uppercase", color:"rgba(212,175,55,0.3)", marginBottom:16 }}>♪ You Are The Reason — Calum Scott</p>
              <div style={{ height:"0.5px", maxWidth:70, margin:"0 auto 54px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.32),transparent)" }} />

              <div style={{ fontSize:"clamp(4rem,13vw,7.5rem)", lineHeight:1, marginBottom:38, animation:"floatBob 3.5s ease-in-out infinite", filter:"drop-shadow(0 0 70px rgba(212,175,55,0.5)) drop-shadow(0 20px 50px rgba(180,100,50,0.35))" }}>🌸</div>

              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,8vw,6.5rem)", fontWeight:300, margin:"0 0 4px", lineHeight:1, color:PAPER }}>You are loved,</h2>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,8vw,6.5rem)", fontWeight:700, margin:"0 0 38px", lineHeight:1, background:G, backgroundSize:"300% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 6s linear infinite" }}>Pascy.</h2>

              <div style={{ height:"0.5px", maxWidth:60, margin:"0 auto 38px", background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.32),transparent)" }} />

              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:"clamp(1rem,2.4vw,1.3rem)", color:"rgba(250,247,240,0.42)", lineHeight:2.3, margin:"0 0 58px" }}>
                Not just today. Not just in the big moments.<br />
                In every ordinary day that follows this one —<br />
                you are deeply, completely, endlessly loved.
              </p>

              <div style={{ padding:"30px 38px", border:"0.5px solid rgba(212,175,55,0.16)", borderRadius:2, background:"linear-gradient(135deg,rgba(212,175,55,0.035) 0%,rgba(212,140,40,0.02) 100%)", backdropFilter:"blur(24px)", boxShadow:"0 24px 70px rgba(0,0,0,0.4),inset 0 1px 0 rgba(212,175,55,0.07)" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,3vw,1.6rem)", fontWeight:600, color:PAPER, margin:"0 0 10px" }}>With everything we've got — always.</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, color:GOLD, fontSize:"clamp(0.95rem,2.2vw,1.2rem)", margin:0 }}>Cynthia & Ezinwanne 🌸</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}