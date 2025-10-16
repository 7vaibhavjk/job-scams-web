import React, { useEffect, useRef, useState } from "react";
import "./ProtegradRacer.css";

export default function ProtegradRacer() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [difficulty, setDifficulty] = useState("easy");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // score: state for UI + ref for game loop (no stale closure)
  const [score, _setScore] = useState(0);
  const scoreRef = useRef(0);
  const setScoreValue = (v) => { scoreRef.current = v; _setScore(v); };

  const [best, setBest] = useState(() => Number(localStorage.getItem("racer_best") || 0));

  // risk: state for UI + ref for loop
  const [, _setRisk] = useState(0);
  const riskRef = useRef(0);
  const setRiskValue = (val) => {
    const v = Math.max(0, Math.min(100, val));
    riskRef.current = v;
    _setRisk(v);
  };
  const addRisk = (delta) => setRiskValue(riskRef.current + delta);

  // canvas/loop
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(0);

  const laneRef = useRef(1);
  const carXAnim = useRef(0);
  const speedRef = useRef(0);
  const lastSpawn = useRef(0);
  const lastTs = useRef(0);
  const objects = useRef([]);
  const tipRef = useRef(null);
  const helpFlashUntil = useRef(0);
  const lastToolRef = useRef(-1);
  const pausedRef = useRef(false);
useEffect(() => { pausedRef.current = paused; }, [paused]);

const openMenu = () => {
  setRunning(false);
  setPaused(false);
  setGameOver(false);
  setMenuOpen(true);
  cancelAnimationFrame(rafRef.current);
};

  // audio
  const audioCtxRef = useRef(null);
  const beep = (freq = 440, dur = 0.08, type = "sine", vol = 0.06) => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol;
      o.connect(g); g.connect(ctx.destination); o.start();
      setTimeout(() => o.stop(), dur * 1000);
    } catch {}
  };

  const DIFF = {
    easy:   { base: 1.2, max: 3.2, accel: 0.018, spawn: 1450 },
    medium: { base: 1.6, max: 4.0, accel: 0.026, spawn: 1200 },
    hard:   { base: 2.2, max: 5.0, accel: 0.038, spawn: 1000 }
  };

  const { base, max, accel, spawn } = DIFF[difficulty];

  const RED_ITEMS = [
    { label: "UPFRONT",      tip: "Upfront payment requested. Legit employers don’t charge you." },
    { label: "GIFT",         tip: "Gift cards as payment = classic scam method." },
    { label: "WIRE",         tip: "Asked to wire money. Never wire funds to ‘employers’." },
    { label: "CRYPTO",       tip: "Upfront crypto request? That’s a major red flag." },
    { label: "FAKE CHECK",   tip: "Cheque overpay scam: you’ll be asked to ‘refund’ later." },
    { label: "TRAINING $",   tip: "Paying for training or onboarding fees is not normal." },
    { label: "GEAR $",       tip: "They demand buying equipment from a ‘preferred’ vendor." },
    { label: "NO INTERVIEW", tip: "Instant hire with no interview? Be cautious and verify." },
    { label: "TOO GOOD",     tip: "Pay looks too good to be true — research before engaging." },
    { label: "URGENT",       tip: "Manufactured urgency pressures bad decisions. Slow down." },
    { label: "BANK DETAILS", tip: "Bank details requested pre-hire — don’t share." },
    { label: "ID PHOTO",     tip: "ID selfie/documents requested over chat — risky." },
    { label: "DM ONLY",      tip: "Hiring via direct messages only? Verify independently." },
  ];

  // size to 16:9 and prevent overlap with footer
  useEffect(() => {
    const c = canvasRef.current, wrap = wrapRef.current;
    const resize = () => {
      if (!c || !wrap) return;
      const usableW = wrap.clientWidth;
      const h = Math.min(Math.round(usableW * 9/16), 540);
      c.width = Math.round(usableW);
      c.height = Math.max(420, h);
      ctxRef.current = c.getContext("2d");
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") laneRef.current = Math.max(0, laneRef.current - 1);
      else if (k === "arrowright" || k === "d") laneRef.current = Math.min(2, laneRef.current + 1);
      else if (k === "p") setPaused(p => !p);
      else if (k === "r") openMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onTouch = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      laneRef.current = x < rect.width / 2 ? Math.max(0, laneRef.current - 1) : Math.min(2, laneRef.current + 1);
    };
    el.addEventListener("touchstart", onTouch, { passive: true });
    return () => el.removeEventListener("touchstart", onTouch);
  }, []);

  useEffect(() => {
    if (!running || paused) return;

    speedRef.current = base;
    lastTs.current = 0;
    lastSpawn.current = 0;
    objects.current = [];
    helpFlashUntil.current = performance.now() + 3500;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const draw = (ts) => {
      // keep timestamp stable
      if (!lastTs.current) lastTs.current = ts;
      const dt = Math.min(64, ts - lastTs.current);
      lastTs.current = ts;

      // 🟡 if paused, don't update game state — just keep frame alive
      if (pausedRef.current) {
  rafRef.current = requestAnimationFrame(draw);
  return;
}



      // speed ramp
      speedRef.current = Math.min(max, speedRef.current + accel * (dt / 16.666));

      const { width: W, height: H } = ctx.canvas;
      ctx.clearRect(0, 0, W, H);

      drawGridBackground(ctx, W, H);

      const roadW = Math.min(560, Math.max(360, Math.round(W * 0.64)));
      const left = (W - roadW) / 2;
      drawLanes(ctx, left, roadW, H);

      const laneX = (lane) => {
        const slot = roadW / 3;
        return left + slot * lane + slot / 2;
      };
      const AV_W = 44, AV_H = 88;
      const targetX = laneX(laneRef.current);
      if (!carXAnim.current) carXAnim.current = targetX;
      carXAnim.current += (targetX - carXAnim.current) * Math.min(1, dt / 120);
      const avX = carXAnim.current - AV_W / 2;
      const avY = H - AV_H - 24;
      drawRunner(ctx, avX, avY, AV_W, AV_H);

      if (ts - lastSpawn.current > spawn) {
        lastSpawn.current = ts;
        const lane = Math.floor(Math.random() * 3);
        const isGreen = Math.random() < 0.28;
        const item = RED_ITEMS[Math.floor(Math.random() * RED_ITEMS.length)];
        objects.current.push({ lane, y: -70, type: isGreen ? "verify" : "flag", h: isGreen ? 40 : 56, item });
      }

      const vy = (speedRef.current * dt) / 16.666 * 1.4;
      const keep = [];
      for (const o of objects.current) {
        o.y += vy;

        if (o.type === "flag") drawRedTriangle(ctx, laneX(o.lane), o.y, o.h, o.item.label);
        else drawGreenCheckFlag(ctx, laneX(o.lane), o.y);

        if (collide(o, avX, avY, AV_W, AV_H, laneX)) {
          if (o.type === "flag") {
            addRisk(+22);
            showTip(`${o.item.tip} — Risk +22`, "danger");
            beep(240, 0.1, "square", 0.07);
            if (riskRef.current >= 100) { endGame(); return; }
          } else {
            addRisk(-16);
            const tools = ["URL Checker", "Ad Analyzer", "Support Center", "Report Page"];
            let idx = Math.floor(Math.random() * tools.length);
            if (idx === lastToolRef.current) idx = (idx + 1) % tools.length;
            lastToolRef.current = idx;
            showTip(`Protegrad Verification used: ${tools[idx]} — Risk −16`, "info");
            beep(720, 0.08, "triangle", 0.06);
          }
        } else if (o.y < H + 60) {
          keep.push(o);
        }
      }
      objects.current = keep;

      // HUD uses refs to avoid stale values
      drawHud(ctx, { score: scoreRef.current, best, risk: riskRef.current, speed: speedRef.current, W });

      // update running score (ref + state)
      const inc = (speedRef.current * dt) / 16.666;
      setScoreValue(Math.floor(scoreRef.current + inc));

      if (ts < helpFlashUntil.current) drawHelp(ctx, W);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, difficulty, base, max, accel, spawn, best]);

  const endGame = () => {
    setGameOver(true);
    setRunning(false);
    setPaused(false);
    const newBest = Math.max(best, scoreRef.current); // use ref
    setBest(newBest);
    localStorage.setItem("racer_best", String(newBest));
  };

  const startGame = () => {
    setMenuOpen(false);
    setGameOver(false);
    setPaused(false);
    setScoreValue(0);
    setRiskValue(0);
    laneRef.current = 1;
    objects.current = [];
    setScoreValue(0);
    setRiskValue(0);
    speedRef.current = DIFF[difficulty].base;
    beep(520, 0.08, "sine", 0.06);
    setRunning(true);
  };

  const showTip = (text, mode = "info") => {
    if (!tipRef.current) return;
    tipRef.current.textContent = text;
    tipRef.current.classList.remove("show", "danger");
    if (mode === "danger") tipRef.current.classList.add("danger");
    // restart CSS animation
    // eslint-disable-next-line no-unused-expressions
    tipRef.current.offsetHeight;
    tipRef.current.classList.add("show");
  };

  return (
    <section className="racer-card light" ref={wrapRef}>
<header className="racer-head">
  <h3 className="racer-brand">Protegrad Racer</h3>
  <div className="racer-hints">
    <span>←/→ or A/D</span>
    <span>Tap to steer</span>
    {running && (
      <>
        <button
          className="r-btn"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "Resume (P)" : "Pause (P)"}
        </button>
        <button className="r-btn" onClick={openMenu}>
          Restart (R)
        </button>
      </>
    )}
  </div>
</header>

      <div className="stage">
        <canvas ref={canvasRef} />
        <div className="tip" ref={tipRef} />
      </div>

      <footer className="stage-note">
        <small>
          Dodge <span className="symbol danger-symbol" /> (fees, gift cards, crypto, no-interview…)
&nbsp;•&nbsp; Grab <span className="symbol verify-symbol" /> to reduce your Risk meter.

        </small>
      </footer>

      {menuOpen && (
        <div className="menu-overlay">
          <div className="menu-card">
            <h4>Protegrad Racer</h4>
            <p className="tag">Race to safety by spotting scams.</p>
            <div className="menu-grid">
              <div className="box">
                <div className="label">Difficulty</div>
                <div className="pills">
                  {["easy","medium","hard"].map(d => (
                    <button key={d} className={`pill ${difficulty===d?"active":""}`} onClick={() => setDifficulty(d)}>
                      {d[0].toUpperCase()+d.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="hint">Higher difficulty = faster signs & tighter spawns.</p>
              </div>
              <div className="box">
                <div className="label">Controls</div>
                <ul className="bullets">
                  <li>Desktop: <b>← / →</b> or <b>A / D</b> to change lanes, <b>P</b> to pause.</li>
                  <li>Mobile: <b>Tap</b> left/right to steer.</li>
<li>
  Collect <span className="symbol verify-symbol" /> to lower risk, and avoid <span className="symbol danger-symbol" />.
</li>
                </ul>
              </div>
            </div>
            <div className="cta"><button className="start" onClick={startGame}>Start Game</button></div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="menu-overlay">
          <div className="menu-card">
            <h4>Game Over</h4>
            <div className="score-wrap">
              <div className="score-line"><span>Score: </span><b>{scoreRef.current}</b></div>
              <div className="score-line"><span>Best Score: </span><b>{best}</b>{scoreRef.current===best && <em className="newbest">New best!</em>}</div>
            </div>
            <div className="cta"><button className="start" onClick={openMenu}>Play Again</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- drawing helpers (unchanged) ---------------- */
function drawGridBackground(ctx, W, H){
  const bg = ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0, "#f5fbff"); bg.addColorStop(1, "#eef6ff");
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle = "rgba(0,60,130,.10)"; ctx.lineWidth = 1;
  const step = 36;
  for (let x = 0; x <= W; x += step) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y <= H; y += step) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  ctx.restore();
  const g = ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.max(W,H));
  g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,40,90,.08)");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}
function drawLanes(ctx,left,roadW,H){
  ctx.save(); ctx.fillStyle="rgba(0,70,160,.06)"; roundRect(ctx,left,12,roadW,H-24,18,true); ctx.restore();
  ctx.save(); ctx.strokeStyle="rgba(0,70,160,.35)"; ctx.setLineDash([16,20]); ctx.lineWidth=5;
  for(let i=1;i<3;i++){ const x = left + (roadW/3)*i; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  ctx.restore();
}
function drawRunner(ctx,x,y,w,h){
  const g = ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,"#9cd1ff"); g.addColorStop(1,"#3aa0ff");
  ctx.fillStyle = g; shadowedRounded(ctx,x,y,w,h,12);
  ctx.fillStyle="#FFD8B6"; roundRect(ctx,x+w/2-12,y+6,24,22,12,true);
  ctx.fillStyle="#fff";    roundRect(ctx,x+w/2-12,y+26,24,18,8,true);
  ctx.fillStyle="#ff5252"; roundRect(ctx,x+w/2-4,y+30,8,20,4,true);
  ctx.fillStyle="rgba(0,60,140,.8)";
  roundRect(ctx,x+8,y+h-30,12,22,6,true); roundRect(ctx,x+w-20,y+h-28,12,20,6,true);
}
function drawRedTriangle(ctx, cx, top, h, label) {
  const w = 48;
  const x1 = cx, y1 = top;
  const x2 = cx - w / 2, y2 = top + h;
  const x3 = cx + w / 2, y3 = top + h;

  ctx.save();
  ctx.fillStyle = "#ff5c5c";
  ctx.strokeStyle = "rgba(0,0,0,.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 🔺 Large exclamation mark, slightly lower & perfectly centered
  ctx.fillStyle = "#fff";
  ctx.font = "bold 26px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("!", cx, top + h * 0.63);

  // 🏷 Label below
  ctx.fillStyle = "rgba(0,0,0,.85)";
  roundRect(ctx, cx - 34, top + h + 4, 68, 18, 6, true);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 10px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(label, cx, top + h + 13);
  ctx.restore();
}


function drawGreenCheckFlag(ctx,cx,top){
  ctx.strokeStyle="rgba(0,0,0,.35)"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx-10,top); ctx.lineTo(cx-10,top+40); ctx.stroke();
  const g = ctx.createLinearGradient(cx,top,cx,top+24); g.addColorStop(0,"#baf5c3"); g.addColorStop(1,"#2dbb5a");
  ctx.fillStyle=g; roundRect(ctx,cx-8,top+4,22,18,4,true);
  ctx.strokeStyle="#fff"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-4,top+14); ctx.lineTo(cx+0,top+18); ctx.lineTo(cx+8,top+8); ctx.stroke();
}
function drawHud(ctx,{score,best,risk,speed,W}){
  ctx.fillStyle="rgba(0,60,130,.20)"; roundRect(ctx,18,18,190,74,12,true);
  ctx.fillStyle="#08203a"; ctx.font="bold 16px system-ui";
  ctx.fillText(`Score: ${score}`, 28, 42);
  ctx.fillText(`Best:  ${best}`, 28, 62);
  ctx.fillText(`Speed: ${speed.toFixed(1)}`, 28, 82);
  const w=240,h=14,x=W-w-28,y=22;
  ctx.fillStyle="rgba(0,60,130,.20)"; roundRect(ctx,x-10,y-6,w+20,44,12,true);
  ctx.fillStyle="#08203a"; ctx.font="bold 12px system-ui"; ctx.fillText("Risk", x-2, y+8);
  const pct=Math.max(0, Math.min(1, risk/100));
  const grd=ctx.createLinearGradient(x,0,x+w,0); grd.addColorStop(0,"#6adf7b"); grd.addColorStop(0.6,"#ffe76c"); grd.addColorStop(1,"#ff6b6b");
  ctx.fillStyle=grd; roundRect(ctx,x,y+18,Math.max(10,w*pct),h,7,true);
  ctx.strokeStyle="rgba(0,0,0,.25)"; ctx.lineWidth=2; roundRect(ctx,x,y+18,w,h,7,false,true);
}
function drawHelp(ctx,W){
  ctx.fillStyle="rgba(255,255,255,.9)"; roundRect(ctx,W/2-280,92,560,60,12,true);
  ctx.fillStyle="#08203a"; ctx.font="bold 14px system-ui"; ctx.textAlign="center";
  ctx.fillText("←/→ or A/D  •  Tap to steer  •  Pause: P", W/2, 116);
  ctx.fillText("Dodge red warning signs; collect green verification flags to lower Risk.", W/2, 136);
  ctx.textAlign="start";
}
function roundRect(ctx,x,y,w,h,r,fill,stroke){ const rr=Math.min(r,w/2,h/2);
  ctx.beginPath(); ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr); ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr);
  if(fill) ctx.fill(); if(stroke) ctx.stroke();
}
function shadowedRounded(ctx,x,y,w,h,r){ ctx.save(); ctx.shadowColor="rgba(0,0,0,.2)"; ctx.shadowBlur=12; ctx.shadowOffsetY=4; roundRect(ctx,x,y,w,h,r,true,false); ctx.restore(); }
function collide(o,ax,ay,aw,ah,laneX){ const ox=(o.type==="verify")?laneX(o.lane)-10:laneX(o.lane)-24; const ow=(o.type==="verify")?24:48; const oy=o.y, oh=o.h;
  return !(ox+ow < ax || ox > ax+aw || oy+oh < ay || oy > ay+ah);
}
