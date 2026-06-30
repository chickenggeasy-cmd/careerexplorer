/**
 * Career Explorer Pro - Quiz Logic (Fixed & Balanced Edition + A11Y)
 *
 * ✅ FIXES:
 * 1. เพิ่ม 'E' ใน letters array (A-E)
 * 2. แก้ emoji ข้อ 6 จาก " hobby " เป็น "🎨"
 * 3. ใส่ข้อความใน quiz-top-bar-badge และ qp-brand
 * 4. finishQuiz() เช็ค null answers ก่อน
 * 5. origRouter crash fix
 * 6. Normalize scores ป้องกัน bias
 * 7. Rebalance คะแนนทุกข้อให้ครอบคลุมทุกสายงาน
 * 8. เพิ่มคำถามสำหรับ aviation, logistics, factory ที่ขาด
 * 9. [NEW] แก้อาการกระตุก (Layout Shift) เวลากดเลือก Choice
 * 10. [NEW] เพิ่ม Accessibility (A11Y) - รองรับคีย์บอร์ด Tab & Enter/Space, Screen Reader
 */

// ════ INJECT PREMIUM MODERN CSS ════
const injectQuizStyles = () => {
  if (document.getElementById('quiz-modern-styles')) return;
  const style = document.createElement('style');
  style.id = 'quiz-modern-styles';
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap');

    .quiz-wrapper { font-family: 'Prompt', sans-serif; animation: quizFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1); }

    @keyframes quizFadeInUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
    @keyframes floatA         { 0%,100%{transform:translateY(0) rotate(0deg);}   50%{transform:translateY(-14px) rotate(2deg);} }
    @keyframes floatB         { 0%,100%{transform:translateY(0) rotate(0deg);}   50%{transform:translateY(10px) rotate(-2deg);} }
    @keyframes floatC         { 0%,100%{transform:translateY(0) rotate(0deg);}   50%{transform:translateY(-8px) rotate(1deg);} }
    @keyframes pulseGlow      { 0%{box-shadow:0 0 0 0 rgba(233,30,140,.4);} 70%{box-shadow:0 0 0 18px rgba(233,30,140,0);} 100%{box-shadow:0 0 0 0 rgba(233,30,140,0);} }
    @keyframes shimmer        { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
    @keyframes rotateSlow     { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
    @keyframes rotateSlowRev  { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
    @keyframes blobMorph      { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;} }
    @keyframes sparkle        { 0%,100%{opacity:0; transform:scale(0);} 50%{opacity:1; transform:scale(1);} }
    @keyframes countUp        { from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);} }

    .quiz-intro-shell {
      position: relative; overflow: hidden; border-radius: 32px;
      background: linear-gradient(145deg, #fff0f7 0%, #fff 40%, #fdf2ff 100%);
      box-shadow: 0 40px 120px rgba(233,30,140,.08), 0 8px 32px rgba(0,0,0,.04);
      padding: 0; margin-bottom: 0;
    }
    .quiz-bg-ring-1 { position: absolute; pointer-events: none; width: 600px; height: 600px; border-radius: 50%; border: 1.5px dashed rgba(233,30,140,.08); top: -200px; right: -180px; animation: rotateSlow 40s linear infinite; }
    .quiz-bg-ring-2 { position: absolute; pointer-events: none; width: 400px; height: 400px; border-radius: 50%; border: 1.5px dashed rgba(233,30,140,.12); top: -100px; right: -80px; animation: rotateSlowRev 28s linear infinite; }
    .quiz-bg-ring-3 { position: absolute; pointer-events: none; width: 320px; height: 320px; border-radius: 50%; border: 1px solid rgba(233,30,140,.07); bottom: -80px; left: -100px; animation: rotateSlow 35s linear infinite; }
    .quiz-blob-1 { position: absolute; pointer-events: none; width: 280px; height: 280px; background: radial-gradient(circle, rgba(233,30,140,.07) 0%, transparent 70%); top: -60px; left: -60px; animation: blobMorph 12s ease-in-out infinite; }
    .quiz-blob-2 { position: absolute; pointer-events: none; width: 220px; height: 220px; background: radial-gradient(circle, rgba(176,31,255,.05) 0%, transparent 70%); bottom: 40px; right: -40px; animation: blobMorph 15s ease-in-out infinite reverse; }
    .quiz-dot-grid { position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: radial-gradient(circle, rgba(233,30,140,.06) 1px, transparent 1px); background-size: 28px 28px; mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%); }

    .quiz-top-bar { position: relative; z-index: 2; background: linear-gradient(90deg, #e91e8c, #c2185b, #9c27b0, #e91e8c); background-size: 300% auto; animation: shimmer 6s linear infinite; padding: 10px 32px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; border-radius: 32px 32px 0 0; }
    .quiz-top-bar-badge { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.3); border-radius: 50px; padding: 4px 14px; font-size: 12px; font-weight: 700; color: white; backdrop-filter: blur(6px); }
    .quiz-top-bar-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; animation: pulseGlow 1.5s infinite; }

    .quiz-intro-container { display: flex; align-items: center; justify-content: space-between; gap: 48px; padding: 48px 48px 52px; position: relative; z-index: 2; }
    .quiz-text-side { flex: 1.15; }
    .quiz-image-side { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; }

    .quiz-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #e91e8c; background: rgba(233,30,140,.08); border: 1px solid rgba(233,30,140,.18); border-radius: 50px; padding: 6px 16px; margin-bottom: 20px; }
    .quiz-title { font-size: 50px; font-weight: 900; line-height: 1.1; background: linear-gradient(135deg, #e91e8c 0%, #b91c1c 60%, #c2185b 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 18px; letter-spacing: -1px; }
    .quiz-title span { display: block; }
    .quiz-subtitle { font-size: 16px; color: #64748b; line-height: 1.8; margin-bottom: 28px; max-width: 480px; }
    .quiz-subtitle strong { color: #1e293b; }

    .quiz-stats-row { display: flex; gap: 0; margin-bottom: 28px; background: white; border: 1px solid rgba(233,30,140,.1); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 24px rgba(233,30,140,.06); max-width: 420px; }
    .quiz-stat-item { flex: 1; padding: 14px 10px; text-align: center; border-right: 1px solid rgba(233,30,140,.08); transition: background .2s; }
    .quiz-stat-item:last-child { border-right: none; }
    .quiz-stat-item:hover { background: rgba(233,30,140,.03); }
    .quiz-stat-num { font-size: 22px; font-weight: 800; color: #e91e8c; display: block; animation: countUp .6s ease both; }
    .quiz-stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }

    .quiz-pills-container { display: flex; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
    .quiz-pill { background: white; border: 1px solid rgba(233,30,140,.15); border-radius: 50px; padding: 9px 18px; font-size: 13px; color: #475569; font-weight: 600; box-shadow: 0 4px 12px rgba(233,30,140,.06); display: flex; align-items: center; gap: 7px; transition: all .25s; }
    .quiz-pill:hover { border-color: #e91e8c; box-shadow: 0 6px 20px rgba(233,30,140,.15); transform: translateY(-2px); }

    .quiz-btn-primary { background: linear-gradient(135deg, #e91e8c, #c2185b); color: white; border: none; border-radius: 50px; padding: 18px 44px; font-size: 17px; font-weight: 700; cursor: pointer; font-family: 'Prompt', sans-serif; transition: all .3s cubic-bezier(.175,.885,.32,1.275); box-shadow: 0 12px 32px rgba(233,30,140,.38); display: inline-flex; align-items: center; gap: 10px; position: relative; overflow: hidden; }
    .quiz-btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,.15), transparent); opacity: 0; transition: opacity .3s; }
    .quiz-btn-primary:hover:not(:disabled) { transform: translateY(-4px) scale(1.03); box-shadow: 0 20px 48px rgba(233,30,140,.52); }
    .quiz-btn-primary:hover::before { opacity: 1; }
    .quiz-btn-primary:active:not(:disabled) { transform: translateY(1px); }
    .quiz-btn-primary:disabled { background: #e2e8f0; color: #94a3b8; box-shadow: none; cursor: not-allowed; }

    .quiz-trust-row { display: flex; align-items: center; gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(233,30,140,.08); }
    .quiz-trust-avatars { display: flex; }
    .quiz-trust-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; margin-left: -8px; overflow: hidden; background: linear-gradient(135deg, #e91e8c, #f472b6); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .quiz-trust-avatar:first-child { margin-left: 0; }
    .quiz-trust-text { font-size: 13px; color: #64748b; font-weight: 500; line-height: 1.5; }
    .quiz-trust-text strong { color: #e91e8c; }

    .premium-image-container { width: 100%; max-width: 420px; aspect-ratio: 1/1; position: relative; border-radius: 38px; overflow: visible; }
    .actual-hero-image { width: 100%; height: 100%; object-fit: cover; border-radius: 38px; box-shadow: 0 30px 70px rgba(233,30,140,.12), 0 8px 24px rgba(0,0,0,.08); }
    .image-glow-ring { position: absolute; inset: -16px; border-radius: 50px; background: linear-gradient(135deg, rgba(233,30,140,.15), rgba(176,31,255,.08), transparent); z-index: -1; animation: blobMorph 10s ease-in-out infinite; }

    .floating-career-badge { position: absolute; background: rgba(255,255,255,.92); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.8); padding: 10px 16px; border-radius: 18px; box-shadow: 0 12px 32px rgba(0,0,0,.08); display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 13px; color: #1e293b; z-index: 3; transition: all .3s; white-space: nowrap; }
    .floating-career-badge:hover { transform: scale(1.06); box-shadow: 0 20px 40px rgba(233,30,140,.18); }
    .badge-tech { top: 8%;  left: -12%; animation: floatA 4s ease-in-out infinite; }
    .badge-biz  { bottom: 12%; right: -8%; animation: floatA 5s ease-in-out infinite 1s; }
    .badge-med  { top: -4%; right: 10%; animation: floatB 4.5s ease-in-out infinite .5s; }

    .sparkle-dot { position: absolute; pointer-events: none; width: 8px; height: 8px; border-radius: 50%; background: #e91e8c; z-index: 4; }
    .sparkle-dot-1 { top: 20%; left: 5%;  animation: sparkle 2.5s ease-in-out infinite; }
    .sparkle-dot-2 { bottom: 30%; left: -4%; animation: sparkle 3s ease-in-out infinite .7s; }
    .sparkle-dot-3 { top: 60%; right: -2%; animation: sparkle 2.8s ease-in-out infinite 1.2s; width:5px; height:5px; background:#c084fc; }

    .quiz-feature-card { position: absolute; background: white; border-radius: 16px; padding: 12px 16px; box-shadow: 0 12px 30px rgba(0,0,0,.08); display: flex; align-items: center; gap: 10px; z-index: 3; font-size: 13px; font-weight: 600; color: #1e293b; border: 1px solid rgba(233,30,140,.08); animation: floatC 5s ease-in-out infinite; }
    .quiz-feature-icon { font-size: 22px; }
    .quiz-feature-sub { font-size: 11px; color: #94a3b8; font-weight: 500; }
    .feat-card-1 { left: -18%; top: 38%; }
    .feat-card-2 { right: -14%; bottom: 28%; animation-delay: 1.5s; }

    .quiz-cat-strip { position: relative; z-index: 2; padding: 0 48px 40px; }
    .quiz-cat-strip-title { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
    .quiz-cat-pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .quiz-cat-pill { display: flex; align-items: center; gap: 6px; background: white; border: 1px solid rgba(0,0,0,.06); border-radius: 50px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #475569; box-shadow: 0 2px 8px rgba(0,0,0,.04); transition: all .2s; }
    .quiz-cat-pill:hover { border-color: #e91e8c; color: #e91e8c; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(233,30,140,.1); }

    @keyframes qSlideIn       { from{opacity:0;transform:translateY(16px) scale(.98);} to{opacity:1;transform:translateY(0) scale(1);} }
    @keyframes qCardSlideNext { from{opacity:0;transform:translateX(52px) scale(.97);} to{opacity:1;transform:translateX(0) scale(1);} }
    @keyframes qCardSlidePrev { from{opacity:0;transform:translateX(-52px) scale(.97);} to{opacity:1;transform:translateX(0) scale(1);} }
    @keyframes qPulseRing     { 0%{box-shadow:0 0 0 0 rgba(233,30,140,.35);} 70%{box-shadow:0 0 0 14px rgba(233,30,140,0);} 100%{box-shadow:0 0 0 0 rgba(233,30,140,0);} }
    @keyframes qChoiceIn      { from{opacity:0;transform:translateX(-14px);} to{opacity:1;transform:translateX(0);} }
    @keyframes qEmojiPop      { 0%{transform:scale(0) rotate(-20deg);} 60%{transform:scale(1.18) rotate(4deg);} 100%{transform:scale(1) rotate(0deg);} }
    @keyframes qProgressPulse { 0%,100%{opacity:1;} 50%{opacity:.7;} }
    @keyframes qShimmerSlide  { 0%{left:-100%;} 100%{left:200%;} }

    .qp-outer { min-height: 60vh; display: flex; align-items: flex-start; justify-content: center; padding: 32px 16px 48px; position: relative; }
    .qp-outer::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; background: radial-gradient(ellipse 600px 400px at 15% 20%, rgba(233,30,140,.04) 0%, transparent 70%), radial-gradient(ellipse 500px 350px at 85% 75%, rgba(156,39,176,.03) 0%, transparent 70%); }
    .qp-container { width: 100%; max-width: 720px; position: relative; z-index: 1; animation: qSlideIn .55s cubic-bezier(.16,1,.3,1) both; }

    .qp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; gap: 12px; }
    .qp-header-left { display: flex; align-items: center; gap: 10px; }
    .qp-brand { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: #e91e8c; background: rgba(233,30,140,.07); border: 1px solid rgba(233,30,140,.15); border-radius: 50px; padding: 7px 16px; }
    .qp-brand-dot { width: 7px; height: 7px; border-radius: 50%; background: #e91e8c; animation: qPulseRing 1.6s infinite; }
    .qp-back-btn { background: white; border: 1.5px solid #e2e8f0; border-radius: 50px; padding: 7px 18px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'Prompt', sans-serif; transition: all .2s; display: flex; align-items: center; gap: 6px; }
    .qp-back-btn:hover { border-color: #e91e8c; color: #e91e8c; background: rgba(233,30,140,.04); }
    .qp-back-btn:disabled { opacity: .35; cursor: not-allowed; pointer-events: none; }
    .qp-quit-btn { background: white; border: 1.5px solid #e2e8f0; border-radius: 50px; padding: 7px 18px; font-size: 12px; font-weight: 700; color: #94a3b8; cursor: pointer; font-family: 'Prompt', sans-serif; transition: all .2s; display: flex; align-items: center; gap: 6px; }
    .qp-quit-btn:hover { border-color: #e91e8c; color: #e91e8c; background: rgba(233,30,140,.04); }

    .qp-progress-section { margin-bottom: 28px; }
    .qp-progress-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .qp-step-label { font-size: 13px; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 8px; }
    .qp-step-badge { background: linear-gradient(135deg, #e91e8c, #c2185b); color: white; border-radius: 50px; padding: 3px 12px; font-size: 12px; font-weight: 800; letter-spacing: .3px; }
    .qp-pct-label { font-size: 13px; font-weight: 800; color: #e91e8c; background: rgba(233,30,140,.07); border-radius: 50px; padding: 3px 12px; }

    .qp-step-dots { display: flex; gap: 3px; margin-bottom: 10px; flex-wrap: wrap; }
    .qp-dot { height: 4px; border-radius: 50px; flex: 1; min-width: 0; background: #e2e8f0; transition: background .4s, transform .3s; }
    .qp-dot.done { background: linear-gradient(90deg, #e91e8c, #f472b6); }
    .qp-dot.active { background: linear-gradient(90deg, #e91e8c, #f9a8d4); animation: qProgressPulse 1.4s ease-in-out infinite; transform: scaleY(1.6); }

    .qp-bar-track { height: 8px; background: #f1f5f9; border-radius: 50px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,.05); }
    .qp-bar-fill { height: 100%; background: linear-gradient(90deg, #e91e8c 0%, #f472b6 60%, #e91e8c 100%); background-size: 200% auto; border-radius: 50px; position: relative; overflow: hidden; transition: width .6s cubic-bezier(.4,0,.2,1); animation: shimmer 3s linear infinite; }
    .qp-bar-fill::after { content: ''; position: absolute; top: 0; bottom: 0; width: 60%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent); animation: qShimmerSlide 2s ease-in-out infinite; }

    .qp-card { background: white; border-radius: 28px; border: 1.5px solid rgba(233,30,140,.08); box-shadow: 0 4px 6px rgba(0,0,0,.02), 0 20px 48px rgba(233,30,140,.07), 0 40px 80px rgba(0,0,0,.04); overflow: hidden; margin-bottom: 20px; position: relative; }
    .qp-card.slide-next { animation: qCardSlideNext .38s cubic-bezier(.16,1,.3,1) both; }
    .qp-card.slide-prev { animation: qCardSlidePrev .38s cubic-bezier(.16,1,.3,1) both; }
    .qp-card.slide-next .qp-choice { animation: qChoiceIn .35s cubic-bezier(.16,1,.3,1) both; }
    .qp-card.slide-prev .qp-choice { animation: qCardSlidePrev .35s cubic-bezier(.16,1,.3,1) both; }
    .qp-card-stripe { height: 4px; background: linear-gradient(90deg, #e91e8c, #c2185b, #9c27b0, #e91e8c); background-size: 300% auto; animation: shimmer 4s linear infinite; }
    .qp-card-deco { position: absolute; top: 20px; right: 24px; display: flex; gap: 6px; opacity: .4; }
    .qp-card-deco span { width: 8px; height: 8px; border-radius: 50%; }
    .qp-card-body { padding: 36px 40px 40px; }

    .qp-emoji-wrap { display: flex; justify-content: center; margin-bottom: 24px; }
    .qp-emoji-circle { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, rgba(233,30,140,.08) 0%, rgba(233,30,140,.04) 100%); border: 2px solid rgba(233,30,140,.12); display: flex; align-items: center; justify-content: center; font-size: 46px; animation: qEmojiPop .5s cubic-bezier(.175,.885,.32,1.275) both; box-shadow: 0 8px 24px rgba(233,30,140,.1); }
    /* 🛠️ a11y: แก้ heading ของข้อให้เป็น h2 */
    .qp-q-number { text-align: center; margin-bottom: 14px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #e91e8c; }
    .qp-q-text { font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; line-height: 1.55; margin-bottom: 36px; font-family: 'Prompt', sans-serif; letter-spacing: -.3px; margin-top:0; }

    .qp-choices { display: flex; flex-direction: column; gap: 10px; }

    /* 🛠️ UI Fix: เปลี่ยนเป็นการใช้ border-color คุมกล่อง แทนการเพิ่ม border เพื่อป้องกัน Layout Shift */
    .qp-choice { 
      display: flex; align-items: center; gap: 16px; padding: 17px 22px; border-radius: 18px; 
      background: #fafbfc; cursor: pointer; font-family: 'Prompt', sans-serif; font-size: 15px; font-weight: 600; color: #475569; 
      transition: all .25s cubic-bezier(.16,1,.3,1); position: relative; overflow: hidden; 
      animation: qChoiceIn .4s cubic-bezier(.16,1,.3,1) both; 
      
      /* a11y: เปลี่ยนจาก div เป็น button */
      width: 100%; text-align: left; border: 2px solid transparent; 
      box-shadow: inset 0 0 0 2px #f1f5f9; /* ใช้ inset shadow ทำกรอบหลอกแทน border จริง */
    }
    .qp-choice:nth-child(1) { animation-delay: .05s; }
    .qp-choice:nth-child(2) { animation-delay: .1s; }
    .qp-choice:nth-child(3) { animation-delay: .15s; }
    .qp-choice:nth-child(4) { animation-delay: .2s; }
    .qp-choice:nth-child(5) { animation-delay: .25s; }
    .qp-choice::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(233,30,140,.04) 50%, transparent 100%); transform: translateX(-100%); transition: transform .4s ease; }
    
    .qp-choice:hover::before, .qp-choice:focus::before { transform: translateX(100%); }
    .qp-choice:hover, .qp-choice:focus { 
      background: rgba(253,242,248,.6); transform: translateX(8px); 
      box-shadow: inset 0 0 0 2px rgba(233,30,140,.3), 0 8px 24px rgba(233,30,140,.08); 
      color: #1e293b; outline: none; 
    }
    .qp-choice.selected { 
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); color: #9d174d; 
      transform: translateX(8px) scale(1.01); 
      box-shadow: inset 0 0 0 2px #e91e8c, 0 12px 30px rgba(233,30,140,.18); 
    }

    .qp-letter { width: 38px; height: 38px; min-width: 38px; border-radius: 12px; background: white; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; color: #94a3b8; transition: all .25s; letter-spacing: .5px; box-shadow: 0 2px 6px rgba(0,0,0,.06); }
    .qp-choice:hover .qp-letter, .qp-choice:focus .qp-letter { border-color: rgba(233,30,140,.3); color: #e91e8c; }
    .qp-choice.selected .qp-letter { background: linear-gradient(135deg, #e91e8c, #c2185b); border-color: transparent; color: white; box-shadow: 0 6px 16px rgba(233,30,140,.3); }
    .qp-choice-text { flex: 1; line-height: 1.4; }
    .qp-check { width: 26px; height: 26px; border-radius: 50%; background: #e91e8c; color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; flex-shrink: 0; animation: qEmojiPop .3s cubic-bezier(.175,.885,.32,1.275) both; box-shadow: 0 4px 12px rgba(233,30,140,.35); }

    .qp-actions { display: flex; flex-direction: column; gap: 14px; }
    .qp-btn-row { display: flex; gap: 12px; }
    .qp-prev-btn { flex: 0 0 auto; padding: 19px 24px; border-radius: 20px; border: 2px solid #e2e8f0; background: white; color: #64748b; font-size: 16px; font-weight: 700; font-family: 'Prompt', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .25s; }
    .qp-prev-btn:hover:not(:disabled) { border-color: #e91e8c; color: #e91e8c; background: rgba(233,30,140,.04); transform: translateY(-2px); }
    .qp-prev-btn:disabled { opacity: .3; cursor: not-allowed; }
    .qp-next-btn { flex: 1; padding: 19px; border-radius: 20px; border: none; font-size: 17px; font-weight: 800; font-family: 'Prompt', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all .3s cubic-bezier(.175,.885,.32,1.275); position: relative; overflow: hidden; }
    .qp-next-btn:not(:disabled) { background: linear-gradient(135deg, #e91e8c 0%, #c2185b 60%, #9c27b0 100%); color: white; box-shadow: 0 12px 36px rgba(233,30,140,.42), 0 4px 12px rgba(0,0,0,.08); }
    .qp-next-btn:not(:disabled)::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,.18), transparent 60%); }
    .qp-next-btn:not(:disabled):hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 20px 52px rgba(233,30,140,.55), 0 8px 24px rgba(0,0,0,.1); }
    .qp-next-btn:not(:disabled):active { transform: translateY(1px) scale(.99); }
    .qp-next-btn:disabled { background: #f1f5f9; color: #cbd5e1; cursor: not-allowed; box-shadow: none; }
    .qp-hint { text-align: center; font-size: 12px; color: #94a3b8; font-weight: 500; }

    @keyframes rFadeUp    { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
    @keyframes rCardIn    { from{opacity:0;transform:translateX(-20px) scale(.97);} to{opacity:1;transform:translateX(0) scale(1);} }
    @keyframes rBarGrow   { from{width:0;} to{width:var(--bar-w);} }
    @keyframes rConfetti  { 0%{transform:translateY(-20px) rotate(0deg);opacity:1;} 100%{transform:translateY(60px) rotate(360deg);opacity:0;} }
    @keyframes rRankPop   { 0%{transform:scale(0) rotate(-15deg);} 60%{transform:scale(1.2) rotate(5deg);} 100%{transform:scale(1) rotate(0deg);} }
    @keyframes rGlowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(233,30,140,.3);} 50%{box-shadow:0 0 0 16px rgba(233,30,140,0);} }
    @keyframes rStarSpin  { from{transform:rotate(0deg) scale(1);} 50%{transform:rotate(180deg) scale(1.2);} to{transform:rotate(360deg) scale(1);} }
    @keyframes rNumberCount { from{opacity:0;transform:scale(.5);} to{opacity:1;transform:scale(1);} }
    @keyframes toastIn  { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
    @keyframes toastOut { from{opacity:1;transform:translateY(0);} to{opacity:0;transform:translateY(16px);} }
    .quiz-share-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: #0f172a; color: white; padding: 14px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; font-family: 'Prompt', sans-serif; box-shadow: 0 12px 32px rgba(0,0,0,.2); z-index: 9999; white-space: nowrap; animation: toastIn .35s cubic-bezier(.16,1,.3,1) both; }
    .quiz-share-toast.hide { animation: toastOut .35s cubic-bezier(.4,0,1,1) both; }

    .qr-outer { display: flex; align-items: flex-start; justify-content: center; padding: 32px 16px 56px; position: relative; min-height: 60vh; }
    .qr-container { width: 100%; max-width: 720px; animation: rFadeUp .6s cubic-bezier(.16,1,.3,1) both; }
    .qr-hero { position: relative; overflow: hidden; background: linear-gradient(135deg, #fff0f7 0%, #fdf2ff 50%, #fff0f7 100%); border-radius: 32px; border: 1.5px solid rgba(233,30,140,.1); padding: 48px 40px 40px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,.02), 0 24px 60px rgba(233,30,140,.08); }
    .qr-hero::before { content: ''; position: absolute; top: -100px; right: -100px; width: 350px; height: 350px; border-radius: 50%; border: 1.5px dashed rgba(233,30,140,.1); animation: rotateSlow 30s linear infinite; pointer-events: none; }
    .qr-hero::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; border-radius: 50%; border: 1px dashed rgba(233,30,140,.08); animation: rotateSlowRev 24s linear infinite; pointer-events: none; }
    .qr-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    .qr-confetti-dot { position: absolute; border-radius: 2px; animation: rConfetti 3s ease-in infinite; }
    .qr-hero-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #e91e8c, #c2185b, #9c27b0, #e91e8c); background-size: 300% auto; animation: shimmer 4s linear infinite; border-radius: 32px 32px 0 0; }
    .qr-emoji-ring { width: 100px; height: 100px; border-radius: 50%; background: white; border: 3px solid rgba(233,30,140,.15); box-shadow: 0 12px 36px rgba(233,30,140,.15), 0 0 0 8px rgba(233,30,140,.05); display: flex; align-items: center; justify-content: center; font-size: 52px; margin: 0 auto 20px; animation: qEmojiPop .5s cubic-bezier(.175,.885,.32,1.275) both; position: relative; z-index: 1; }
    .qr-title { font-size: 32px; font-weight: 900; line-height: 1.2; background: linear-gradient(135deg, #e91e8c 0%, #c2185b 60%, #9c27b0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; letter-spacing: -.5px; font-family: 'Prompt', sans-serif; position: relative; z-index: 1; }
    .qr-subtitle { font-size: 15px; color: #64748b; margin-bottom: 28px; line-height: 1.6; position: relative; z-index: 1; }
    .qr-summary-pills { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
    .qr-summary-pill { background: white; border: 1px solid rgba(233,30,140,.12); border-radius: 50px; padding: 8px 18px; font-size: 13px; font-weight: 700; color: #475569; box-shadow: 0 4px 12px rgba(233,30,140,.06); display: flex; align-items: center; gap: 7px; }

    .qr-cards { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
    .qr-card { border-radius: 24px; overflow: hidden; background: white; transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s; position: relative; animation: rCardIn .5s cubic-bezier(.16,1,.3,1) both; }
    .qr-card:nth-child(1) { animation-delay: .05s; }
    .qr-card:nth-child(2) { animation-delay: .15s; }
    .qr-card:nth-child(3) { animation-delay: .25s; }
    .qr-card:hover { transform: translateY(-4px); }
    .qr-card.rank-1 { border: 2px solid #e91e8c; box-shadow: 0 8px 32px rgba(233,30,140,.14), 0 2px 8px rgba(0,0,0,.04); animation: rCardIn .5s cubic-bezier(.16,1,.3,1) both, rGlowPulse 2.5s 1s infinite; }
    .qr-card.rank-2 { border: 1.5px solid rgba(100,116,139,.18); box-shadow: 0 4px 20px rgba(0,0,0,.05); }
    .qr-card.rank-3 { border: 1.5px solid rgba(100,116,139,.12); box-shadow: 0 4px 16px rgba(0,0,0,.04); }
    .qr-card-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 5px; border-radius: 24px 0 0 24px; }
    .qr-card-inner { display: flex; align-items: center; gap: 18px; padding: 22px 24px 22px 28px; }
    .qr-icon-box { width: 72px; height: 72px; min-width: 72px; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 38px; box-shadow: 0 6px 20px rgba(0,0,0,.08); position: relative; }
    .qr-icon-crown { position: absolute; top: -12px; right: -8px; font-size: 22px; animation: rStarSpin 4s ease-in-out infinite; filter: drop-shadow(0 2px 4px rgba(0,0,0,.2)); }
    .qr-card-text { flex: 1; min-width: 0; }
    .qr-rank-label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
    .qr-cat-name { font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 12px; line-height: 1.3; font-family: 'Prompt', sans-serif; }
    .qr-bar-wrap { background: #f1f5f9; border-radius: 50px; height: 8px; overflow: hidden; position: relative; }
    .qr-bar-fill { height: 100%; border-radius: 50px; position: relative; overflow: hidden; animation: rBarGrow .8s cubic-bezier(.4,0,.2,1) both; animation-delay: .3s; }
    .qr-bar-fill::after { content: ''; position: absolute; top: 0; bottom: 0; width: 50%; left: -50%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); animation: qShimmerSlide 2s ease-in-out infinite; }
    .qr-card-right { text-align: center; min-width: 68px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .qr-medal { font-size: 36px; animation: rRankPop .5s cubic-bezier(.175,.885,.32,1.275) both; filter: drop-shadow(0 3px 6px rgba(0,0,0,.15)); }
    .qr-medal-1 { animation-delay: .2s; }
    .qr-medal-2 { animation-delay: .3s; }
    .qr-medal-3 { animation-delay: .4s; }
    .qr-pct { font-size: 20px; font-weight: 900; animation: rNumberCount .4s cubic-bezier(.16,1,.3,1) both; animation-delay: .5s; font-family: 'Prompt', sans-serif; }
    .qr-pct-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }

    .qr-tip-card { background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%); border: 1.5px solid rgba(245,158,11,.2); border-radius: 24px; padding: 24px 28px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 16px; box-shadow: 0 8px 24px rgba(245,158,11,.08); animation: rFadeUp .6s .4s cubic-bezier(.16,1,.3,1) both; }
    .qr-tip-icon { font-size: 36px; flex-shrink: 0; margin-top: 2px; animation: floatA 4s ease-in-out infinite; }
    .qr-tip-title { font-size: 15px; font-weight: 800; color: #92400e; margin-bottom: 6px; font-family:'Prompt',sans-serif; }
    .qr-tip-text  { font-size: 13px; color: #78350f; line-height: 1.7; font-family:'Prompt',sans-serif; }

    .qr-actions { display: flex; gap: 12px; flex-wrap: wrap; animation: rFadeUp .6s .5s cubic-bezier(.16,1,.3,1) both; }
    .qr-btn-restart { flex: 1; min-width: 120px; padding: 17px 16px; border-radius: 18px; border: 2px solid #e2e8f0; background: white; color: #475569; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Prompt', sans-serif; transition: all .25s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .qr-btn-restart:hover { border-color: #e91e8c; color: #e91e8c; background: rgba(233,30,140,.03); transform: translateY(-2px); }
    .qr-btn-share { flex: 1; min-width: 120px; padding: 17px 16px; border-radius: 18px; border: 2px solid rgba(233,30,140,.25); background: rgba(233,30,140,.05); color: #e91e8c; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Prompt', sans-serif; transition: all .25s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .qr-btn-share:hover { background: rgba(233,30,140,.1); border-color: #e91e8c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(233,30,140,.15); }
    .qr-btn-explore { flex: 2; min-width: 160px; padding: 17px 24px; border-radius: 18px; border: none; background: linear-gradient(135deg, #e91e8c, #c2185b, #9c27b0); background-size: 200% auto; color: white; font-size: 15px; font-weight: 800; cursor: pointer; font-family: 'Prompt', sans-serif; transition: all .3s cubic-bezier(.175,.885,.32,1.275); box-shadow: 0 12px 32px rgba(233,30,140,.38); display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; overflow: hidden; animation: shimmer 4s linear infinite; }
    .qr-btn-explore::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,.15), transparent); }
    .qr-btn-explore:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 20px 48px rgba(233,30,140,.52); }

    @media (max-width: 991px) {
      .quiz-intro-container { flex-direction: column; gap: 36px; padding: 32px 24px 36px; }
      .quiz-cat-strip { padding: 0 24px 32px; }
      .quiz-top-bar { padding: 10px 24px; }
      .quiz-title { font-size: 36px; text-align: center; }
      .quiz-subtitle { text-align: center; max-width: 100%; }
      .quiz-eyebrow { margin: 0 auto 20px; }
      .quiz-stats-row { max-width: 100%; }
      .quiz-pills-container { justify-content: center; }
      .quiz-btn-primary { width: 100%; justify-content: center; }
      .quiz-trust-row { justify-content: center; }
      .quiz-image-side { width: 100%; max-width: 380px; }
      .feat-card-1, .feat-card-2 { display: none; }
      .badge-tech { left: -4%; }
      .badge-biz  { right: -2%; }
      .qp-card-body { padding: 28px 24px 32px; }
      .qp-q-text { font-size: 19px; }
    }
    @media (max-width: 480px) {
      .quiz-title { font-size: 30px; }
      .badge-tech, .badge-biz, .badge-med { font-size: 11px; padding: 7px 12px; }
      .qp-outer { padding: 16px 12px 40px; }
      .qp-q-text { font-size: 17px; }
      .qp-choice { padding: 14px 16px; font-size: 14px; }
      .qp-letter { width: 32px; height: 32px; min-width: 32px; border-radius: 10px; font-size: 12px; }
      .qr-actions { flex-direction: column; }
      .qr-btn-explore { flex: none; width: 100%; }
    }
  `;
  document.head.appendChild(style);
};

// ════ CAREER QUIZ CATEGORIES ════
const QUIZ_CATEGORIES = {
  medical:      { name: "สายการแพทย์และสุขภาพ",            icon: "🏥", color: "#e91e8c", light: "#fce7f3" },
  tech:         { name: "สายวิศวกรรมและไอที",              icon: "💻", color: "#1d4ed8", light: "#dbeafe" },
  business:     { name: "สายธุรกิจและการเงิน",              icon: "💼", color: "#b45309", light: "#fef3c7" },
  law:          { name: "สายกฎหมายและความปลอดภัย",         icon: "⚖️", color: "#6b21a8", light: "#f3e8ff" },
  arts:         { name: "สายสร้างสรรค์ สื่อ และบันเทิง",   icon: "🎭", color: "#15803d", light: "#dcfce7" },
  education:    { name: "สายวิทยาศาสตร์และการศึกษา",       icon: "🎓", color: "#c2410c", light: "#ffedd5" },
  sports:       { name: "สายกีฬาและนันทนาการ",             icon: "🏆", color: "#065f46", light: "#d1fae5" },
  food:         { name: "สายอาหารและการบริการ",            icon: "🍳", color: "#92400e", light: "#fef3c7" },
  aviation:     { name: "สายการบินและการท่องเที่ยว",       icon: "✈️", color: "#1e3a5f", light: "#e0f2fe" },
  construction: { name: "สายก่อสร้างและอสังหาริมทรัพย์",  icon: "🏗️", color: "#475569", light: "#f1f5f9" },
  agriculture:  { name: "สายเกษตรและสิ่งแวดล้อม",         icon: "🌱", color: "#3f6212", light: "#ecfccb" },
  logistics:    { name: "สายโลจิสติกส์และคลังสินค้า",     icon: "📦", color: "#7c2d12", light: "#fff7ed" },
  factory:      { name: "สายโรงงานและยานยนต์",             icon: "🏭", color: "#1e293b", light: "#f8fafc" },
  lifestyle:    { name: "สายความงามและแฟชั่น",             icon: "💄", color: "#701a75", light: "#fdf4ff" },
};

// ════ CAREER QUIZ QUESTIONS (BALANCED) ════
const QUIZ_QUESTIONS = [
  {
    q: "คุณมักจะรู้สึกตื่นเต้นกับอะไรมากที่สุดในชีวิตประจำวัน?",
    emoji: "✨",
    choices: [
      { text: "การเรียนรู้สิ่งใหม่ๆ และแก้ปัญหาที่ซับซ้อน",             scores: { tech: 3, education: 1, business: 1 } },
      { text: "การได้ช่วยเหลือผู้อื่นให้พ้นจากความทุกข์",                scores: { medical: 3, law: 1, education: 1 } },
      { text: "การสร้างสรรค์ผลงานที่สวยงามและเป็นเอกลักษณ์",             scores: { arts: 3, lifestyle: 1, food: 1 } },
      { text: "การวางแผนและจัดการให้ทุกอย่างเป็นไปตามเป้าหมาย",           scores: { business: 3, logistics: 2, construction: 1 } },
      { text: "การได้ออกกำลังกาย ผจญภัย และท้าทายขีดจำกัดตัวเอง",        scores: { sports: 3, aviation: 2, agriculture: 1 } },
    ],
  },
  {
    q: "ถ้าคุณมีเวลาว่าง 1 วันเต็มๆ คุณจะเลือกทำอะไร?",
    emoji: "⏳",
    choices: [
      { text: "อ่านหนังสือ ดูสารคดี หรือเข้าคอร์สออนไลน์",               scores: { education: 3, tech: 1, medical: 1 } },
      { text: "เข้าครัวทำอาหารเมนูพิเศษ หรือไปคาเฟ่สวยๆ",              scores: { food: 3, lifestyle: 2, arts: 1 } },
      { text: "ไปเที่ยวต่างจังหวัดหรือวางแผนทริปต่างประเทศ",             scores: { aviation: 3, sports: 1, lifestyle: 1 } },
      { text: "ซ่อมแซมสิ่งของในบ้าน ประดิษฐ์ หรือต่อโมเดล",              scores: { factory: 3, construction: 2, tech: 1 } },
      { text: "จัดส่งพัสดุ วางแผนเส้นทาง หรือจัดระบบสต็อกสินค้า",       scores: { logistics: 3, business: 2, factory: 1 } },
    ],
  },
  {
    q: "คุณให้ความสำคัญกับอะไรมากที่สุดในการตัดสินใจเรื่องสำคัญ?",
    emoji: "🤔",
    choices: [
      { text: "เหตุผลและข้อมูลที่ถูกต้องและน่าเชื่อถือ",                  scores: { tech: 3, business: 1, education: 1 } },
      { text: "ความรู้สึก สัญชาตญาณ และความคิดสร้างสรรค์",               scores: { arts: 3, lifestyle: 2, food: 1 } },
      { text: "ผลกระทบต่อผู้อื่น สังคม และความยุติธรรม",                  scores: { law: 3, medical: 2, education: 1 } },
      { text: "ความมั่นคง ปลอดภัย และผลตอบแทนระยะยาว",                   scores: { business: 3, construction: 2, logistics: 1 } },
      { text: "ความเป็นมิตรต่อสิ่งแวดล้อมและชุมชน",                      scores: { agriculture: 3, factory: 1, sports: 1 } },
    ],
  },
  {
    q: "ถ้าคุณเป็นหัวหน้าทีม คุณจะบริหารจัดการแบบไหน?",
    emoji: "👨‍💼",
    choices: [
      { text: "ให้อิสระ วางเป้าหมายชัดเจน แล้วติดตามผล KPI",             scores: { business: 3, tech: 1, logistics: 1 } },
      { text: "เน้นทำงานร่วมกัน ช่วยเหลือซึ่งกันและกัน",                  scores: { education: 3, medical: 2, arts: 1 } },
      { text: "กำหนดกฎระเบียบและขั้นตอนการทำงานที่ชัดเจน",               scores: { law: 3, factory: 2, construction: 1 } },
      { text: "ส่งเสริมไอเดียใหม่ๆ และความคิดสร้างสรรค์ของทีม",          scores: { arts: 3, lifestyle: 1, food: 1 } },
      { text: "ดูแลความปลอดภัยและสวัสดิการของทีมเป็นอันดับแรก",         scores: { aviation: 3, sports: 2, medical: 1 } },
    ],
  },
  {
    q: "คุณชอบสภาพแวดล้อมการทำงานแบบไหนมากที่สุด?",
    emoji: "🏢",
    choices: [
      { text: "ในห้องแล็บหรือสตูดิโอที่เงียบสงบและมีสมาธิ",              scores: { tech: 3, arts: 2, education: 1 } },
      { text: "กลางแจ้ง ท่ามกลางธรรมชาติ ไร่นา หรือป่าเขา",              scores: { agriculture: 3, sports: 2, construction: 1 } },
      { text: "ในออฟฟิศที่ทันสมัย มีการประชุมและระดมสมองบ่อยๆ",           scores: { business: 3, law: 2, education: 1 } },
      { text: "ในโรงพยาบาล คลินิก หรือดูแลผู้คนโดยตรง",                  scores: { medical: 3, lifestyle: 1, food: 1 } },
      { text: "บนเครื่องบิน สนามบิน หรือสถานที่ท่องเที่ยวทั่วโลก",       scores: { aviation: 3, logistics: 2, lifestyle: 1 } },
    ],
  },
  {
    q: "ถ้าคุณต้องเลือกงานอดิเรกใหม่ คุณจะเลือกอะไร?",
    emoji: "🎨",  
    choices: [
      { text: "เรียนรู้ภาษาใหม่ เล่นเครื่องดนตรี หรือวาดภาพ",             scores: { education: 3, arts: 2, lifestyle: 1 } },
      { text: "ทำสวน ปลูกต้นไม้ เลี้ยงสัตว์ หรือทำเกษตรอินทรีย์",       scores: { agriculture: 3, food: 2, sports: 1 } },
      { text: "ถ่ายภาพ ทำวิดีโอ หรือเขียนบล็อกท่องเที่ยว",                scores: { arts: 3, aviation: 2, lifestyle: 1 } },
      { text: "ซ่อมรถยนต์ ต่อโมเดล หรือ DIY ของในบ้าน",                   scores: { factory: 3, construction: 2, tech: 1 } },
      { text: "ศึกษาเรื่องการลงทุน ติดตามข่าวหุ้น หรือทำบัญชี",           scores: { business: 3, logistics: 1, tech: 1 } },
    ],
  },
  {
    q: "คุณรู้สึกดีที่สุดเมื่อได้ทำอะไร?",
    emoji: "😊",
    choices: [
      { text: "ได้เห็นผลงานที่สร้างขึ้นมาด้วยมือตัวเองสำเร็จ",            scores: { construction: 3, factory: 2, arts: 1 } },
      { text: "ได้ช่วยแก้ปัญหาให้คนอื่นพ้นจากความเดือดร้อน",              scores: { medical: 3, law: 2, education: 1 } },
      { text: "ได้สร้างสรรค์ไอเดียใหม่ๆ ที่แตกต่างและโดดเด่น",            scores: { arts: 3, tech: 1, lifestyle: 1 } },
      { text: "ได้เรียนรู้และพัฒนาตัวเองอย่างต่อเนื่อง",                  scores: { education: 3, sports: 2, medical: 1 } },
      { text: "ได้ขนส่ง จัดเส้นทาง หรือทำให้สินค้าถึงมือลูกค้าทันเวลา", scores: { logistics: 3, aviation: 2, business: 1 } },
    ],
  },
  {
    q: "ถ้าคุณมีโอกาสเดินทางไปที่ไหนก็ได้ในโลก คุณจะเลือกไปที่ไหน?",
    emoji: "✈️",
    choices: [
      { text: "เมืองใหญ่ที่เต็มไปด้วยเทคโนโลยีและนวัตกรรม เช่น โตเกียว", scores: { tech: 3, business: 2, education: 1 } },
      { text: "ชนบทที่เงียบสงบ มีธรรมชาติ ทุ่งนา และวิถีชีวิตเรียบง่าย",  scores: { agriculture: 3, sports: 1, food: 1 } },
      { text: "เมืองประวัติศาสตร์ที่มีพิพิธภัณฑ์ มหาวิทยาลัย และวัฒนธรรม", scores: { education: 3, arts: 2, law: 1 } },
      { text: "สถานที่ท่องเที่ยวผจญภัย เช่น ปีนเขา ดำน้ำ หรือสกี",       scores: { sports: 3, aviation: 2, lifestyle: 1 } },
      { text: "ศูนย์การค้าและแหล่งแฟชั่นระดับโลก เช่น ปารีส มิลาน",      scores: { lifestyle: 3, arts: 1, food: 1 } },
    ],
  },
  {
    q: "คุณชอบการสื่อสารแบบไหนมากที่สุด?",
    emoji: "💬",
    choices: [
      { text: "การนำเสนอข้อมูลที่ชัดเจน มีตัวเลขและหลักฐานสนับสนุน",     scores: { business: 3, education: 2, tech: 1 } },
      { text: "การเล่าเรื่องที่น่าสนใจ สร้างแรงบันดาลใจ และจับอารมณ์",   scores: { arts: 3, lifestyle: 2, food: 1 } },
      { text: "การรับฟังอย่างตั้งใจและให้คำปรึกษาผู้อื่น",                scores: { medical: 3, law: 2, education: 1 } },
      { text: "การสื่อสารผ่านแผนผัง ไดอะแกรม หรือซอฟต์แวร์",             scores: { tech: 3, construction: 2, factory: 1 } },
      { text: "การสื่อสารทางวิทยุ ระบบนำทาง หรือการบัญชาการ",             scores: { aviation: 3, logistics: 2, law: 1 } },
    ],
  },
  {
    q: "ถ้าคุณต้องเลือกทักษะใหม่ คุณจะเลือกเรียนรู้อะไร?",
    emoji: "🧠",
    choices: [
      { text: "การเขียนโปรแกรม AI หรือ Data Science",                      scores: { tech: 3, education: 2, business: 1 } },
      { text: "การทำอาหาร เบเกอรี่ หรือการชงกาแฟระดับมืออาชีพ",           scores: { food: 3, lifestyle: 2, arts: 1 } },
      { text: "การเจรจาต่อรอง การตลาด หรือการขาย",                        scores: { business: 3, law: 2, aviation: 1 } },
      { text: "การปฐมพยาบาล การดูแลผู้ป่วย หรือโภชนาการ",                 scores: { medical: 3, sports: 2, education: 1 } },
      { text: "การขับรถบรรทุก การจัดการคลังสินค้า หรือการผลิตชิ้นส่วน",   scores: { logistics: 3, factory: 2, construction: 1 } },
    ],
  },
  {
    q: "คุณจัดการกับความเครียดอย่างไร?",
    emoji: "🧘",
    choices: [
      { text: "ออกกำลังกาย เล่นกีฬา หรือฝึกซ้อมทักษะกีฬา",               scores: { sports: 3, medical: 1, agriculture: 1 } },
      { text: "ฟังเพลง วาดภาพ ดูหนัง หรือแสดงสิ่งที่รู้สึกออกมา",         scores: { arts: 3, lifestyle: 2, food: 1 } },
      { text: "วางแผน จัดลำดับความสำคัญ และแก้ปัญหาอย่างเป็นระบบ",        scores: { business: 3, tech: 2, logistics: 1 } },
      { text: "พูดคุย ปรึกษาหารือ หรือขอความช่วยเหลือจากผู้อื่น",          scores: { medical: 3, education: 2, law: 1 } },
      { text: "ลงมือทำงาน ซ่อมของ หรืองานที่ต้องใช้ทักษะฝีมือมือ",        scores: { factory: 3, construction: 2, agriculture: 1 } },
    ],
  },
  {
    q: "ถ้าคุณมีพลังวิเศษ คุณอยากมีพลังอะไร?",
    emoji: "🦸",
    choices: [
      { text: "พลังในการรักษาโรคและเยียวยาทุกความเจ็บปวด",                scores: { medical: 3, education: 1, sports: 1 } },
      { text: "พลังในการสร้างสรรค์สิ่งสวยงามจากความว่างเปล่า",              scores: { arts: 3, construction: 2, lifestyle: 1 } },
      { text: "พลังในการควบคุมเทคโนโลยีและระบบคอมพิวเตอร์",               scores: { tech: 3, factory: 2, logistics: 1 } },
      { text: "พลังในการเดินทางข้ามเวลาและสถานที่ชั่วพริบตา",              scores: { aviation: 3, logistics: 2, sports: 1 } },
      { text: "พลังในการสร้างความยุติธรรมและเปลี่ยนกฎเกณฑ์ที่ไม่เป็นธรรม", scores: { law: 3, education: 2, business: 1 } },
    ],
  },
  {
    q: "คุณชอบการเรียนรู้แบบไหน?",
    emoji: "📖",
    choices: [
      { text: "เรียนรู้จากประสบการณ์จริง ลงมือทำ ผิดพลาดแล้วปรับปรุง",   scores: { construction: 3, factory: 2, sports: 1 } },
      { text: "เรียนรู้จากตำรา งานวิจัย และแหล่งข้อมูลที่น่าเชื่อถือ",    scores: { education: 3, medical: 2, law: 1 } },
      { text: "เรียนรู้จากการวิเคราะห์ข้อมูล กราฟ และสถิติ",              scores: { tech: 3, business: 2, logistics: 1 } },
      { text: "เรียนรู้จากการพูดคุยแลกเปลี่ยนและสังเกตผู้อื่น",           scores: { arts: 3, lifestyle: 2, food: 1 } },
      { text: "เรียนรู้จากธรรมชาติ สิ่งแวดล้อม และการลงพื้นที่จริง",      scores: { agriculture: 3, aviation: 2, food: 1 } },
    ],
  },
  {
    q: "ถ้าคุณต้องเลือกสัตว์เลี้ยง คุณจะเลือกอะไร?",
    emoji: "🐾",
    choices: [
      { text: "สุนัข — ซื่อสัตย์ เป็นเพื่อน และชอบออกกำลังกายด้วยกัน",   scores: { sports: 3, medical: 1, lifestyle: 1 } },
      { text: "แมว — อิสระ ฉลาด และสังเกตสิ่งรอบข้างเสมอ",               scores: { arts: 3, tech: 2, education: 1 } },
      { text: "ปลา — สงบ สวยงาม และต้องการการดูแลอย่างเป็นระบบ",          scores: { food: 2, business: 2, logistics: 1 } },
      { text: "นก — ชอบที่กว้าง เสรีภาพ และการเดินทาง",                   scores: { aviation: 3, agriculture: 2, lifestyle: 1 } },
      { text: "สัตว์เลี้ยงแปลกๆ — ท้าทาย ต้องการความรู้พิเศษ",            scores: { agriculture: 3, factory: 1, law: 1 } },
    ],
  },
  {
    q: "คุณให้ความสำคัญกับอะไรมากที่สุดในชีวิต?",
    emoji: "💖",
    choices: [
      { text: "ความสำเร็จในหน้าที่การงาน ชื่อเสียง และการเติบโต",          scores: { business: 3, law: 1, tech: 1 } },
      { text: "ความสุข ความพึงพอใจ และการแสดงออกตัวตน",                   scores: { lifestyle: 3, arts: 2, food: 1 } },
      { text: "การมีส่วนร่วมพัฒนาสังคมและช่วยเหลือผู้ด้อยโอกาส",          scores: { education: 3, medical: 2, law: 1 } },
      { text: "การได้ใช้ชีวิตอย่างอิสระ ผจญภัย และสัมผัสโลกกว้าง",        scores: { aviation: 3, sports: 2, agriculture: 1 } },
      { text: "ความมั่นคง เสถียรภาพ และการมีงานที่มั่นคงตลอดชีวิต",        scores: { factory: 3, construction: 2, logistics: 1 } },
    ],
  },
  {
    q: "ถ้าคุณต้องออกแบบผลิตภัณฑ์ใหม่ คุณจะเน้นอะไร?",
    emoji: "💡",
    choices: [
      { text: "ฟังก์ชันล้ำสมัย ประสิทธิภาพสูง และใช้ AI ช่วย",            scores: { tech: 3, factory: 2, business: 1 } },
      { text: "ความสวยงาม ดีไซน์ที่โดดเด่น และสะท้อนตัวตนผู้ใช้",        scores: { arts: 3, lifestyle: 2, food: 1 } },
      { text: "ความปลอดภัย ทนทาน และผ่านมาตรฐานทุกข้อกำหนด",              scores: { construction: 3, law: 2, aviation: 1 } },
      { text: "ความเป็นมิตรต่อสิ่งแวดล้อม ย่อยสลายได้ และ Zero-waste",    scores: { agriculture: 3, education: 2, medical: 1 } },
      { text: "ระบบขนส่งและโลจิสติกส์ที่เร็ว แม่นยำ และประหยัดต้นทุน",   scores: { logistics: 3, aviation: 2, business: 1 } },
    ],
  },
  {
    q: "คุณชอบการแก้ปัญหาแบบไหน?",
    emoji: "🧩",
    choices: [
      { text: "วิเคราะห์ข้อมูล เขียนโค้ด หรือใช้ซอฟต์แวร์หาทางออก",      scores: { tech: 3, business: 2, education: 1 } },
      { text: "ปรึกษาผู้เชี่ยวชาญ อ่านตำรา และทำตามขั้นตอนมาตรฐาน",      scores: { medical: 3, law: 2, education: 1 } },
      { text: "ลองผิดลองถูก ทดสอบ prototype และปรับปรุงซ้ำๆ",              scores: { factory: 3, arts: 2, construction: 1 } },
      { text: "ตรวจสอบกฎระเบียบ เอกสาร และทำตามขั้นตอนที่กำหนด",          scores: { law: 3, logistics: 2, aviation: 1 } },
      { text: "ออกไปสำรวจภาคสนาม วัดจริง ดูสภาพพื้นที่จริง",              scores: { agriculture: 3, construction: 2, sports: 1 } },
    ],
  },
  {
    q: "ถ้าคุณต้องจัดงานอีเวนต์ คุณจะเลือกจัดงานแบบไหน?",
    emoji: "🎉",
    choices: [
      { text: "งานสัมมนาวิชาการ เวิร์คช็อป หรือ Hackathon",               scores: { education: 3, tech: 2, business: 1 } },
      { text: "งานแสดงศิลปะ แฟชั่นโชว์ หรือคอนเสิร์ต",                   scores: { arts: 3, lifestyle: 2, food: 1 } },
      { text: "งานเปิดตัวสินค้า เจรจาธุรกิจ หรือ Networking",             scores: { business: 3, logistics: 2, law: 1 } },
      { text: "งานแข่งขันกีฬา วิ่ง หรือกิจกรรม Outdoor",                  scores: { sports: 3, aviation: 2, construction: 1 } },
      { text: "งานเลี้ยงอาหาร ปาร์ตี้ หรือ Food Festival",               scores: { food: 3, lifestyle: 2, agriculture: 1 } },
    ],
  },
  {
    q: "คุณให้ความสำคัญกับอะไรมากที่สุดในการเลือกซื้อของ?",
    emoji: "🛍️",
    choices: [
      { text: "คุณภาพ ความทนทาน และการรับประกันสินค้า",                     scores: { factory: 3, construction: 2, logistics: 1 } },
      { text: "ราคา ความคุ้มค่า และการเปรียบเทียบตลาด",                     scores: { business: 3, logistics: 2, tech: 1 } },
      { text: "ดีไซน์ ความสวยงาม และเทรนด์แฟชั่น",                        scores: { lifestyle: 3, arts: 2, food: 1 } },
      { text: "ประโยชน์ใช้สอย นวัตกรรม และฟีเจอร์ล้ำสมัย",               scores: { tech: 3, medical: 2, education: 1 } },
      { text: "ความเป็นมิตรต่อสิ่งแวดล้อม ออร์แกนิก และยั่งยืน",          scores: { agriculture: 3, food: 2, law: 1 } },
    ],
  },
  {
    q: "ถ้าคุณต้องเลือกอาชีพในโลกแฟนตาซี คุณจะเลือกเป็นอะไร?",
    emoji: "🧙",
    choices: [
      { text: "นักเวทย์ผู้รักษา — คอยเยียวยาและดูแลสุขภาพผู้คน",         scores: { medical: 3, education: 1, sports: 1 } },
      { text: "วิศวกรผู้สร้าง — ประดิษฐ์เครื่องจักรและระบบมหัศจรรย์",      scores: { tech: 3, factory: 2, construction: 1 } },
      { text: "พ่อค้าผู้มั่งคั่ง — สร้างอาณาจักรการค้าและเส้นทางขนส่ง",  scores: { business: 3, logistics: 2, aviation: 1 } },
      { text: "อัศวินผู้พิทักษ์ — รักษาความยุติธรรมและกฎหมาย",             scores: { law: 3, sports: 2, medical: 1 } },
      { text: "นักสำรวจผู้บุกเบิก — เดินทางค้นพบดินแดนและพืชพันธุ์ใหม่",  scores: { agriculture: 3, aviation: 2, education: 1 } },
    ],
  },
];

// ════ STATE ════
let quizState = {
  step: "intro",
  current: 0,
  scores: {},
  answers: [],
};

// ════ RENDER ════
function renderQuiz() {
  injectQuizStyles();
  const app = document.getElementById("quizApp");
  if (!app) return;
  const s = quizState;

  // ── INTRO ──────────────────────────────────────────────
  if (s.step === "intro") {
    app.innerHTML = `
      <div class="quiz-wrapper">
        <div class="quiz-intro-shell">
          <div class="quiz-bg-ring-1"></div>
          <div class="quiz-bg-ring-2"></div>
          <div class="quiz-bg-ring-3"></div>
          <div class="quiz-blob-1"></div>
          <div class="quiz-blob-2"></div>
          <div class="quiz-dot-grid"></div>

          <div class="quiz-top-bar">
            <div class="quiz-top-bar-badge">
              <div class="quiz-top-bar-dot"></div>
              Career Explorer Pro
            </div>
            <div class="quiz-top-bar-badge">🎯 แม่นยำ 95%+</div>
            <div class="quiz-top-bar-badge">⚡ ผลทันที</div>
            <div class="quiz-top-bar-badge">🔒 ไม่เก็บข้อมูลส่วนตัว</div>
          </div>

          <div class="quiz-intro-container">
            <div class="quiz-text-side">
              <div class="quiz-eyebrow">🎯 Career Matching System</div>
              <h2 class="quiz-title">
                <span>ค้นหาสายงาน</span>
                <span>ที่ใช่สำหรับคุณ</span>
              </h2>
              <p class="quiz-subtitle">
                ทำแบบทดสอบวิเคราะห์เชิงลึก <strong>${QUIZ_QUESTIONS.length} ข้อ</strong>
                เพื่อทำความเข้าใจทักษะและทัศนคติ แล้วค้นพบ
                <strong>3 อันดับสายงาน</strong> ที่ตอบโจทย์ตัวตนของคุณมากที่สุด
              </p>
              <div class="quiz-stats-row">
                <div class="quiz-stat-item">
                  <span class="quiz-stat-num">14</span>
                  <span class="quiz-stat-label">สายงาน</span>
                </div>
                <div class="quiz-stat-item">
                  <span class="quiz-stat-num">${QUIZ_QUESTIONS.length}</span>
                  <span class="quiz-stat-label">คำถาม</span>
                </div>
                <div class="quiz-stat-item">
                  <span class="quiz-stat-num">5 นาที</span>
                  <span class="quiz-stat-label">ใช้เวลา</span>
                </div>
                <div class="quiz-stat-item">
                  <span class="quiz-stat-num">3</span>
                  <span class="quiz-stat-label">ผลลัพธ์</span>
                </div>
              </div>
              <div class="quiz-pills-container">
                <div class="quiz-pill">⏱️ ใช้เวลา 5 นาที</div>
                <div class="quiz-pill">📋 ${QUIZ_QUESTIONS.length} คำถามครบถ้วน</div>
                <div class="quiz-pill">✨ ประมวลผลแม่นยำ</div>
                <div class="quiz-pill">🔄 ทำใหม่ได้ไม่จำกัด</div>
              </div>
              <button class="quiz-btn-primary" onclick="startQuiz()">
                เริ่มค้นหาตัวเองคลิกเลย 🚀
              </button>
              <div class="quiz-trust-row">
                <div class="quiz-trust-avatars">
                  <div class="quiz-trust-avatar">A</div>
                  <div class="quiz-trust-avatar">B</div>
                  <div class="quiz-trust-avatar">C</div>
                  <div class="quiz-trust-avatar">D</div>
                  <div class="quiz-trust-avatar">E</div>
                </div>
                <div class="quiz-trust-text">
                  <strong>นักเรียนและนักศึกษากว่าพันคน</strong><br>
                  ค้นพบเส้นทางอาชีพของตัวเองแล้ว
                </div>
              </div>
            </div>

            <div class="quiz-image-side">
              <div class="floating-career-badge badge-tech">💻 สายไอที & Tech</div>
              <div class="floating-career-badge badge-biz">💼 ธุรกิจ & การจัดการ</div>
              <div class="floating-career-badge badge-med">🏥 การแพทย์ & สุขภาพ</div>
              <div class="quiz-feature-card feat-card-1">
                <div class="quiz-feature-icon">🎯</div>
                <div><div>แม่นยำสูง</div><div class="quiz-feature-sub">การวิเคราะห์</div></div>
              </div>
              <div class="quiz-feature-card feat-card-2">
                <div class="quiz-feature-icon">⚡</div>
                <div><div>ผลทันที</div><div class="quiz-feature-sub">Real-time</div></div>
              </div>
              <div class="sparkle-dot sparkle-dot-1"></div>
              <div class="sparkle-dot sparkle-dot-2"></div>
              <div class="sparkle-dot sparkle-dot-3"></div>
              <div class="premium-image-container">
                <div class="image-glow-ring"></div>
                <img src="img/photo/58488151515.png" class="actual-hero-image" alt="Career Explorer Hero"
                  onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg,#fce7f3,#f3e8ff)'; this.parentElement.innerHTML += '<div style=\'display:flex;align-items:center;justify-content:center;height:100%;font-size:80px;\'>🎯</div>';">
              </div>
            </div>
          </div>

          <div class="quiz-cat-strip">
            <div class="quiz-cat-strip-title">ครอบคลุม 14 สายงานหลัก</div>
            <div class="quiz-cat-pills">
              ${Object.values(QUIZ_CATEGORIES).map(c =>
                `<div class="quiz-cat-pill">${c.icon} ${c.name}</div>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }

  // ── QUIZ STEP ──────────────────────────────────────────
  else if (s.step === "quiz") {
    const q           = QUIZ_QUESTIONS[s.current];
    const pct         = Math.round((s.current / QUIZ_QUESTIONS.length) * 100);
    const isLast      = s.current + 1 === QUIZ_QUESTIONS.length;
    const currentAnswer = s.answers[s.current] ?? null;

    const dotsHTML = Array.from({ length: QUIZ_QUESTIONS.length }, (_, i) => {
      let cls = 'qp-dot';
      if (i < s.current)        cls += ' done';
      else if (i === s.current) cls += ' active';
      return `<div class="${cls}"></div>`;
    }).join('');

    const letters = ['A', 'B', 'C', 'D', 'E'];

    // 🛠️ a11y & UI FIX: เปลี่ยน div เป็น button เพื่อรองรับคีย์บอร์ด + ใส่ aria-label อธิบาย Choice
    const choicesHTML = q.choices.map((c, i) => {
      const isSel = currentAnswer === i;
      return `
        <button type="button" 
                class="qp-choice ${isSel ? 'selected' : ''}" 
                onclick="selectQuizAnswer(${i})"
                aria-pressed="${isSel ? 'true' : 'false'}"
                aria-label="ตัวเลือก ${letters[i]}: ${c.text}">
          <div class="qp-letter" aria-hidden="true">${letters[i]}</div>
          <div class="qp-choice-text">${c.text}</div>
          ${isSel ? `<div class="qp-check" aria-hidden="true">✓</div>` : ''}
        </button>`;
    }).join('');

    app.innerHTML = `
      <div class="quiz-wrapper">
        <div class="qp-outer">
          <div class="qp-container">

            <div class="qp-header">
              <div class="qp-header-left">
                <div class="qp-brand">
                  <div class="qp-brand-dot"></div>
                  Career Explorer Pro
                </div>
              </div>
              <button type="button" class="qp-quit-btn" onclick="restartQuiz()">✕ ออกจากแบบทดสอบ</button>
            </div>

            <div class="qp-progress-section" aria-live="polite">
              <div class="qp-progress-meta">
                <div class="qp-step-label">
                  คำถาม
                  <span class="qp-step-badge">${s.current + 1} / ${QUIZ_QUESTIONS.length}</span>
                </div>
                <div class="qp-pct-label">${pct}% เสร็จแล้ว</div>
              </div>
              <div class="qp-step-dots" aria-hidden="true">${dotsHTML}</div>
              <div class="qp-bar-track" aria-hidden="true">
                <div class="qp-bar-fill" style="width:${pct}%;"></div>
              </div>
            </div>

            <div class="qp-card">
              <div class="qp-card-stripe"></div>
              <div class="qp-card-deco">
                <span style="background:#fca5a5;"></span>
                <span style="background:#fcd34d;"></span>
                <span style="background:#6ee7b7;"></span>
              </div>
              <div class="qp-card-body">
                <div class="qp-emoji-wrap">
                  <div class="qp-emoji-circle" aria-hidden="true">${q.emoji}</div>
                </div>
                <h2 class="qp-q-number">ข้อที่ ${s.current + 1} จาก ${QUIZ_QUESTIONS.length}</h2>
                <h3 class="qp-q-text">${q.q}</h3>
                
                <div class="qp-choices" role="group" aria-label="ตัวเลือกคำตอบ">${choicesHTML}</div>
              </div>
            </div>

            <div class="qp-actions">
              <div class="qp-btn-row">
                <button
                  type="button"
                  class="qp-prev-btn"
                  onclick="prevQuizQuestion()"
                  ${s.current === 0 ? 'disabled' : ''}
                  title="กลับข้อก่อนหน้า"
                  aria-label="ย้อนกลับไปคำถามข้อก่อนหน้า"
                >
                  ← ก่อนหน้า
                </button>
                <button
                  type="button"
                  class="qp-next-btn"
                  onclick="nextQuizQuestion()"
                  ${currentAnswer === null ? 'disabled' : ''}
                  aria-label="${isLast ? 'ดูผลลัพธ์แบบทดสอบ' : 'ไปคำถามข้อต่อไป'}"
                >
                  ${isLast ? '✨ ดูผลลัพธ์!' : 'ข้อต่อไป →'}
                </button>
              </div>
              <div class="qp-hint" aria-live="polite">
                ${currentAnswer === null
                  ? '👆 เลือกคำตอบที่ตรงกับตัวคุณที่สุด'
                  : `✅ เลือกแล้ว! ${isLast ? 'กดดูผลลัพธ์ได้เลย' : 'กดข้อต่อไปหรือย้อนกลับได้'}`}
              </div>
            </div>

          </div>
        </div>
      </div>`;
  }

  // ── RESULT STEP ─────────────────────────────────────────
  else if (s.step === "result") {
    const total = Object.values(s.scores).reduce((a, b) => a + b, 0);
    const top3  = Object.entries(s.scores).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const medals      = ["🥇","🥈","🥉"];
    const rankLabels  = ["🌟 แมทช์สุดๆ!", "🥈 อันดับ 2", "🥉 อันดับ 3"];
    const rankColors  = ["#e91e8c","#64748b","#94a3b8"];
    const rankClasses = ["rank-1","rank-2","rank-3"];

    const shareLines = top3.map(([id, sc], i) => {
      const cat = QUIZ_CATEGORIES[id];
      const pct = total > 0 ? Math.round((sc / total) * 100) : 0;
      return `${medals[i]} ${cat.name} (${pct}%)`;
    }).join('\n');
    s.shareText = `🎯 ผลแบบทดสอบสายอาชีพ Career Explorer Pro\n\n${shareLines}\n\nค้นพบสายงานของคุณได้ที่ Career Explorer Pro!`;

    const confettiColors = ["#e91e8c","#f472b6","#c084fc","#fbbf24","#34d399","#60a5fa"];
    const confettiHTML = Array.from({ length: 16 }, (_, i) => {
      const color = confettiColors[i % confettiColors.length];
      const size  = 6 + Math.random() * 8;
      const left  = 5 + (i / 16) * 90;
      const delay = (i * 0.18).toFixed(2);
      const dur   = (2.5 + Math.random() * 1.5).toFixed(2);
      return `<div class="qr-confetti-dot" style="
        background:${color}; width:${size}px; height:${size}px;
        left:${left}%; top:-10px;
        animation:rConfetti ${dur}s ${delay}s ease-in infinite;
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
        opacity:.85;
      "></div>`;
    }).join('');

    const cardsHTML = top3.map(([id, sc], i) => {
      const cat = QUIZ_CATEGORIES[id];
      if (!cat) return "";
      const pct = total > 0 ? Math.round((sc / total) * 100) : 0;
      return `
        <div class="qr-card ${rankClasses[i]}" tabindex="0">
          <div class="qr-card-accent" style="background:linear-gradient(180deg,${cat.color},${cat.color}88);"></div>
          <div class="qr-card-inner">
            <div class="qr-icon-box" aria-hidden="true" style="background:${cat.light};">
              <span style="position:relative;z-index:1;">${cat.icon}</span>
              ${i === 0 ? `<div class="qr-icon-crown">👑</div>` : ''}
            </div>
            <div class="qr-card-text">
              <div class="qr-rank-label" style="color:${rankColors[i]};">${rankLabels[i]}</div>
              <h3 class="qr-cat-name" style="margin-top:0;">${cat.name}</h3>
              <div class="qr-bar-wrap" aria-hidden="true">
                <div class="qr-bar-fill" style="width:${pct}%; --bar-w:${pct}%; background:linear-gradient(90deg,${cat.color},${cat.color}99);"></div>
              </div>
            </div>
            <div class="qr-card-right">
              <div class="qr-medal qr-medal-${i+1}" aria-hidden="true">${medals[i]}</div>
              <div class="qr-pct" style="color:${cat.color};" aria-label="ตรงกับคุณ ${pct} เปอร์เซ็นต์">${pct}%</div>
              <div class="qr-pct-label" aria-hidden="true">แมทช์</div>
            </div>
          </div>
        </div>`;
    }).join('');

    app.innerHTML = `
      <div class="quiz-wrapper">
        <div class="qr-outer">
          <div class="qr-container">
            <div class="qr-hero" tabindex="0">
              <div class="qr-hero-bar"></div>
              <div class="qr-confetti" aria-hidden="true">${confettiHTML}</div>
              <div class="qr-emoji-ring" aria-hidden="true">🎉</div>
              <h2 class="qr-title" style="margin-top:0;">ผลลัพธ์สายอาชีพของคุณ!</h2>
              <div class="qr-subtitle">
                นี่คือ <strong style="color:#e91e8c;">3 สายงาน</strong>
                ที่ตรงกับตัวตนของคุณมากที่สุด
              </div>
              <div class="qr-summary-pills">
                <div class="qr-summary-pill">📋 ตอบครบ ${QUIZ_QUESTIONS.length} ข้อ</div>
                <div class="qr-summary-pill">🏆 ครอบคลุม ${Object.keys(QUIZ_CATEGORIES).length} สายงาน</div>
                <div class="qr-summary-pill">⚡ ประมวลผลแม่นยำ 95%+</div>
              </div>
            </div>
            <div class="qr-cards" role="list" aria-label="3 อันดับสายงานที่ตรงกับคุณ">${cardsHTML}</div>
            <div class="qr-tip-card">
              <div class="qr-tip-icon" aria-hidden="true">💡</div>
              <div>
                <h3 class="qr-tip-title" style="margin-top:0;">พร้อมก้าวต่อไปแล้วหรือยัง?</h3>
                <div class="qr-tip-text">
                  ค้นหาข้อมูลเชิงลึกของสายงานที่ใช่สำหรับคุณ — ดูเงินเดือนเฉลี่ย, โอกาสเติบโต
                  และตำแหน่งงานที่รับสมัครอยู่ตอนนี้ได้เลยที่หน้าหลัก!
                </div>
              </div>
            </div>
            <div class="qr-actions">
              <button type="button" class="qr-btn-restart" onclick="restartQuiz()">🔄 ทำใหม่</button>
              <button type="button" class="qr-btn-share"   onclick="shareQuizResult()">📤 แชร์ผล</button>
              <button type="button" class="qr-btn-explore" onclick="typeof goHome === 'function' ? goHome() : window.location.href='/'">
                🔍 สำรวจอาชีพ →
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
}

// ════ ACTIONS ════

function startQuiz() {
  quizState = { step: "quiz", current: 0, scores: {}, answers: [] };
  renderQuiz();
}

function selectQuizAnswer(i) {
  quizState.answers[quizState.current] = i;
  renderQuiz();
}

function prevQuizQuestion() {
  if (quizState.current === 0) return;
  quizState.current--;
  quizState.direction = 'prev';
  renderQuiz();
  _scrollToProgress();
}

function nextQuizQuestion() {
  const s = quizState;
  const currentAnswer = s.answers[s.current] ?? null;
  if (currentAnswer === null) return;

  if (s.current + 1 >= QUIZ_QUESTIONS.length) {
    finishQuiz();
  } else {
    s.current++;
    s.direction = 'next';
    renderQuiz();
    _scrollToProgress();
  }
}

function _scrollToProgress() {
  requestAnimationFrame(() => {
    const el = document.querySelector('.qp-progress-section') || document.querySelector('.qp-container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < 0) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function finishQuiz() {
  const s = quizState;

  const firstUnanswered = QUIZ_QUESTIONS.findIndex((_, i) => s.answers[i] == null);
  if (firstUnanswered !== -1) {
    s.current = firstUnanswered;
    renderQuiz();
    _scrollToProgress();
    return;
  }

  const rawScores = {};
  const appearances = {}; 

  QUIZ_QUESTIONS.forEach(q => {
    const seen = new Set();
    q.choices.forEach(c => {
      Object.keys(c.scores).forEach(cat => {
        if (!seen.has(cat)) {
          appearances[cat] = (appearances[cat] || 0) + 1;
          seen.add(cat);
        }
      });
    });
  });

  QUIZ_QUESTIONS.forEach((q, qi) => {
    const ans = s.answers[qi];
    if (ans == null) return;
    const choice = q.choices[ans];
    Object.entries(choice.scores).forEach(([cat, pts]) => {
      rawScores[cat] = (rawScores[cat] || 0) + pts;
    });
  });

  const normalizedScores = {};
  Object.entries(rawScores).forEach(([cat, sc]) => {
    normalizedScores[cat] = sc / (appearances[cat] || 1);
  });

  s.scores = normalizedScores;
  s.step   = "result";
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderQuiz();
}

function restartQuiz() {
  quizState = { step: "intro", current: 0, scores: {}, answers: [] };
  renderQuiz();
}

function shareQuizResult() {
  const text = quizState.shareText || 'ลองทำแบบทดสอบสายอาชีพที่ Career Explorer Pro ดูนะ!';
  if (navigator.share) {
    navigator.share({ title: 'ผลแบบทดสอบสายอาชีพ', text }).catch(() => {});
  } else {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showShareToast('✅ คัดลอกผลลัพธ์แล้ว! วางในแชทได้เลย 🎉'))
        .catch(() => copyViaExecCommand(text));
    } else {
      copyViaExecCommand(text);
    }
  }
}

function copyViaExecCommand(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    showShareToast('✅ คัดลอกผลลัพธ์แล้ว! วางในแชทได้เลย 🎉');
  } catch {
    showShareToast('⚠️ ไม่สามารถคัดลอกได้ กรุณาลองใหม่');
  }
  document.body.removeChild(textarea);
}

function showShareToast(msg) {
  const old = document.querySelector('.quiz-share-toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.className = 'quiz-share-toast';
  toast.setAttribute('role', 'alert'); /* a11y: แจ้งเตือน Screen Reader */
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

document.addEventListener('DOMContentLoaded', () => {
  const origRouter = window.showPage;
  window.showPage = function(pageId, addToHistory = true) {
    if (typeof origRouter === 'function') origRouter(pageId, addToHistory);
    if (pageId === 'page-quiz') {
      quizState = { step: "intro", current: 0, scores: {}, answers: [] };
      setTimeout(renderQuiz, 100);
    }
  };
});