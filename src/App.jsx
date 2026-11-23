import { useEffect, useMemo, useRef, useState } from "react";



const THEMES = {
  sky: {
    name: "Sky Blue",
    bg: "from-sky-50 via-white to-[#dff3ff]",
    card: "bg-white/85 border-sky-100",
    panel: "bg-sky-950/5",
    accent: "bg-[#A1DAFF] hover:bg-[#83cfff]",
    actionText: "text-slate-900",
    text: "text-slate-800",
    muted: "text-slate-500",
    chip: "bg-[#e1f4ff] text-sky-800",
    ring: "stroke-[#76c7fa]",
    swatch: "bg-[#A1DAFF]",
  },
  lunar: {
    name: "NASA Study Mode",
    bg: "from-slate-950 via-blue-950 to-indigo-950",
    card: "bg-white/10 border-white/10 backdrop-blur-xl",
    panel: "bg-white/10",
    accent: "bg-indigo-500 hover:bg-indigo-600",
    actionText: "text-white",
    swatch: "bg-[#6e87f5]",
    text: "text-white",
    muted: "text-blue-100/70",
    chip: "bg-white/10 text-blue-100",
    ring: "stroke-indigo-300",
  },
  matcha: {
    name: "Matcha Cafe",
    bg: "from-lime-50 via-white to-emerald-100",
    card: "bg-white/80 border-emerald-100",
    panel: "bg-emerald-950/5",
    accent: "bg-emerald-500 hover:bg-emerald-600",
    actionText: "text-white",
    swatch: "bg-[#7abf98]",
    text: "text-slate-800",
    muted: "text-slate-500",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "stroke-emerald-400",
  },
  sunset: {
    name: "Soft Sunset",
    bg: "from-orange-50 via-rose-50 to-pink-100",
    card: "bg-white/80 border-rose-100",
    panel: "bg-rose-950/5",
    accent: "bg-rose-500 hover:bg-rose-600",
    actionText: "text-white",
    swatch: "bg-[#ed9aa6]",
    text: "text-slate-800",
    muted: "text-slate-500",
    chip: "bg-rose-100 text-rose-700",
    ring: "stroke-rose-400",
  },
  hero: {
    name: "San Fransokyo Tech",
    bg: "from-[#f2faff] via-[#eaf7ff] to-[#ffeef1]",
    card: "bg-white/90 border-cyan-200/80 backdrop-blur-xl",
    panel: "bg-[#e6f6ff] border border-cyan-200/60",
    accent: "bg-[#ed5468] hover:bg-[#d94156]",
    actionText: "text-white",
    swatch: "bg-[#ed5468]",
    text: "text-[#193553]",
    muted: "text-[#56708b]",
    chip: "bg-[#d8f4ff] text-[#176b99]",
    ring: "stroke-[#2bbbe7]",
  },
  survival: {
    name: "Deep Space Survival",
    bg: "from-[#080d12] via-[#111e20] to-[#161819]",
    card: "bg-[#111c1d]/95 border-[#3d6755]/45 backdrop-blur-xl",
    panel: "bg-[#12251e] border border-[#40654b]/40",
    accent: "bg-[#88db9a] hover:bg-[#a8eeb2]",
    actionText: "text-[#0c1b15]",
    swatch: "bg-[#88db9a]",
    text: "text-[#d2edda]",
    muted: "text-[#8aaa9b]",
    chip: "bg-[#213d2e] text-[#9be2a8]",
    ring: "stroke-[#9be2a8]",
  },
};

const QUOTES = [
  "One tiny study sprint for you, one giant leap for your GPA.",
  "Big goals are built one focused session at a time.",
  "Make time for what matters to you.",
  "Progress counts, even when it's quiet.",
  "Houston, we have motivation.",
  "You are not behind. You're just in your training montage.",
  "Small steps move big projects forward.",
  "Stay curious. Keep going.",
  "Study like your dream internship is reading the logs.",
  "A focused 25 minutes beats a chaotic 3-hour spiral.",
];

const MODES = {
  focus: { label: "Focus", defaultMinutes: 25 },
  shortBreak: { label: "Short Break", defaultMinutes: 5 },
  longBreak: { label: "Long Break", defaultMinutes: 15 },
  emergency: { label: "Quick Reset", defaultMinutes: 3 },
};

function pad(num) {
  return String(num).padStart(2, "0");
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

// Local sounds are loaded when the user interacts with the timer.
function playCompletionSound() {
  const audio = new Audio(`${import.meta.env.BASE_URL}sounds/sweetpeaceful.mp3`);
  audio.volume = 0.5;
  audio.play().catch((error) => console.log("Complete sound failed:", error));
}

function Button({
  children,
  className = "",
  onClick,
  soundOn = true,
  ...props
}) {

  function handleClick(event) {

    // PLAY CLICK SOUND
    if (soundOn) {

      const clickAudio = new Audio(`${import.meta.env.BASE_URL}sounds/SweetUIButton.wav`);

      clickAudio.volume = 0.4;

      clickAudio.play().catch((error) => {
        console.log("Click sound failed:", error);
      });
    }

    // RUN ORIGINAL BUTTON FUNCTION
    if (onClick) {
      onClick(event);
    }
  }

  return (
    <button
      className={`rounded-2xl px-4 py-2 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 disabled:opacity-50 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`border shadow-xl ${className}`}>{children}</div>;
}

// All illustrations are original SVG/CSS artwork, so no franchise assets are needed.
function ThemeScene({ themeKey }) {
  if (themeKey !== "hero" && themeKey !== "survival") return null;

  if (themeKey === "hero") {
    return (
      <section className="theme-scene scene-hero relative mb-5 overflow-hidden rounded-[2rem] border px-6 py-6 sm:px-9" aria-label="San Fransokyo Tech theme scene">
        <div className="relative z-10 max-w-[60%] sm:max-w-[65%]">
          <p className="scene-eyebrow mb-2 text-xs font-bold tracking-[0.24em]">HERO LAB / SYSTEM ONLINE</p>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Build something brilliant.</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed">A bright robotics lab, friendly tech, and a little neon-city energy for your next great idea.</p>
          <span className="scene-status mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-widest"><span className="status-light" /> SYSTEMS READY</span>
        </div>
        <svg className="scene-art scene-art-hero" viewBox="0 0 420 186" role="img" aria-label="Stylized futuristic city skyline with a cyan robotics orbit">
          <defs><linearGradient id="heroCity" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6dbfeb" stopOpacity=".7"/><stop offset="1" stopColor="#8ccce6" stopOpacity=".10"/></linearGradient></defs>
          <circle cx="290" cy="80" r="63" fill="#ffffff" fillOpacity=".7" stroke="#49bde9" strokeWidth="2"/>
          <circle cx="290" cy="80" r="48" fill="none" stroke="#b9ecfa" strokeWidth="7" strokeDasharray="4 7"/>
          <circle cx="290" cy="80" r="22" fill="#f8feff" stroke="#ed5468" strokeWidth="4"/>
          <path d="M278 80h24M290 68v24" stroke="#ed5468" strokeWidth="3" strokeLinecap="round"/>
          <path d="M8 181v-56h33v-36h34v92h16v-70h33v-31h24v101h14v-44h34v44h18v-78h38v78h17v-48h32v48h14v-61h37v61h17v-83h33v83" stroke="#69c4e5" strokeWidth="2" fill="url(#heroCity)"/>
          <path d="M26 137h9M26 150h9M58 109h9M58 124h9M104 127h10M104 141h10M171 150h10M321 138h10M365 113h9M365 131h9" stroke="#ffffff" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="215" cy="28" r="4" fill="#ed5468"/><circle cx="390" cy="47" r="3" fill="#39c9ec"/>
        </svg>
      </section>
    );
  }

  return (
    <section className="theme-scene scene-survival relative mb-5 overflow-hidden rounded-[1rem] border px-6 py-6 sm:px-9" aria-label="Deep Space Survival theme scene">
      <div className="scene-corner scene-corner-tl" aria-hidden="true"/><div className="scene-corner scene-corner-br" aria-hidden="true"/>
      <div className="relative z-10 max-w-[65%]">
        <p className="scene-eyebrow mb-2 text-xs font-bold tracking-[0.23em]">VESSEL 07 // CREW TERMINAL</p>
        <h2 className="text-2xl font-bold uppercase tracking-wide sm:text-3xl">Focus protocol active.</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed">Secure your station. Silence distractions. One cycle at a time.</p>
        <span className="scene-status mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold tracking-widest"><span className="status-light" /> SIGNAL STABLE</span>
      </div>
      <svg className="scene-art scene-art-survival" viewBox="0 0 280 180" role="img" aria-label="Green radar scanner with a moving scanning beam">
        <circle cx="168" cy="90" r="72" stroke="#4c8b67" strokeOpacity=".5" fill="none"/>
        <circle cx="168" cy="90" r="50" stroke="#4c8b67" strokeOpacity=".5" fill="none"/>
        <circle cx="168" cy="90" r="26" stroke="#4c8b67" strokeOpacity=".55" fill="none"/>
        <path d="M96 90h144M168 18v144" stroke="#4c8b67" strokeOpacity=".45" strokeDasharray="4 5"/>
        <g className="radar-beam"><path d="M168 90L168 18A72 72 0 0 1 239 79Z" fill="#8ce6a7" fillOpacity=".19"/><path d="M168 90L168 18" stroke="#8ce6a7" strokeWidth="2"/></g>
        <circle cx="199" cy="62" r="4" fill="#a2f0b4"/><circle cx="137" cy="120" r="2.5" fill="#d98964"/>
        <path d="M4 164h66M5 169h44M232 164h45" stroke="#a2f0b4" strokeOpacity=".6" strokeWidth="1"/>
        <text x="7" y="17" fill="#79b68f" fontSize="10" fontFamily="monospace">SCAN 03</text>
      </svg>
      <div className="scanlines" aria-hidden="true"/>
    </section>
  );
}

export default function App() {
  const [themeKey, setThemeKey] = useState("sky");
  const theme = THEMES[themeKey];

  const [mode, setMode] = useState("focus");
  const [customMinutes, setCustomMinutes] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    emergency: 3,
  });

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [photos, setPhotos] = useState([]);

  const fileInputRef = useRef(null);

  const totalSeconds = customMinutes[mode] * 60;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, 1 - secondsLeft / totalSeconds)) : 0;
  const circumference = 2 * Math.PI * 112;
  const dashOffset = circumference * (1 - progress);

  const quote = useMemo(() => QUOTES[quoteIndex % QUOTES.length], [quoteIndex]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timeout = setTimeout(() => {
      if (secondsLeft === 1) {
        setSecondsLeft(0);
        setIsRunning(false);
        setQuoteIndex((index) => index + 1);
        if (mode === "focus") setSessionCount((count) => count + 1);
        if (soundOn) playCompletionSound();
      } else {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isRunning, secondsLeft, mode, soundOn]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setSecondsLeft(customMinutes[nextMode] * 60);
    setIsRunning(false);
  }

  function adjustMinutes(amount) {
    const next = Math.max(1, customMinutes[mode] + amount);
    setCustomMinutes((prev) => ({ ...prev, [mode]: next }));
    setSecondsLeft(next * 60);
    setIsRunning(false);
  }

  function addFiveNow() {
    setSecondsLeft((prev) => prev + 5 * 60);
  }

  function resetTimer() {
    setIsRunning(false);
    setSecondsLeft(customMinutes[mode] * 60);
  }

  function startEmergencyBreak() {
    changeMode("emergency");
  }

  function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []);

    const newPhotos = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^/.]+$/, ""),
    }));

    setPhotos((prev) => [...newPhotos, ...prev].slice(0, 8));
    event.target.value = "";
  }

  function removePhoto(id) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }

  return (
    <main className={`focus-app theme-${themeKey} min-h-screen bg-gradient-to-br ${theme.bg} ${theme.text} p-4 transition-colors duration-500 sm:p-8`}>
      <div className="mx-auto max-w-6xl py-5">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-fade-in">
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${theme.chip}`}>
              YOUR SPACE TO FOCUS
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Focus Studio
            </h1>

            <p className={`mt-2 max-w-xl text-sm sm:text-base ${theme.muted}`}>
              A calm space for focused work, intentional breaks, and the things that inspire you.
            </p>
          </div>

          <Card className={`rounded-3xl ${theme.card} sm:min-w-[395px]`}>
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold"><span>Appearance</span><span className={`text-xs font-normal ${theme.muted}`}>Choose your mood</span></div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(THEMES).map(([key, item]) => (
                  <Button
                    key={key}
                    className={`flex min-h-[47px] min-w-0 items-center justify-center gap-2 px-3 py-2 text-center text-xs sm:text-sm ${themeKey === key ? `${theme.accent} ${theme.actionText}` : "bg-white/70 text-slate-700"}`}
                    onClick={() => setThemeKey(key)}
                    aria-pressed={themeKey === key}
                  >
                    <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full border border-black/10 ${item.swatch}`} />
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </header>

        <ThemeScene themeKey={themeKey} />

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className={`timer-card overflow-hidden rounded-[2rem] ${theme.card}`}>
            <div className="p-5 sm:p-8">
              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(MODES).map(([key, item]) => (
                  <Button
                    key={key}
                    className={`h-14 text-sm ${mode === key ? `${theme.accent} ${theme.actionText}` : "bg-white/70 text-slate-700"}`}
                    onClick={() => changeMode(key)}
                    aria-pressed={mode === key}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="grid gap-8 md:grid-cols-[1fr_0.85fr] md:items-center">
                <div className="timer-dial relative mx-auto flex aspect-square w-full max-w-[330px] items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 260 260">
                    <circle cx="130" cy="130" r="112" fill="none" stroke="currentColor" strokeWidth="14" className="opacity-10" />
                    <circle
                      cx="130"
                      cy="130"
                      r="112"
                      fill="none"
                      strokeWidth="14"
                      strokeLinecap="round"
                      className={theme.ring}
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{ transition: "stroke-dashoffset 0.4s ease" }}
                    />
                  </svg>

                  <div className="timer-readout text-center">
                    <div className={`mx-auto mb-4 w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${theme.chip}`}>
                      {MODES[mode].label}
                    </div>
                    <div className="text-6xl font-black tabular-nums tracking-tight sm:text-7xl">
                      {formatTime(secondsLeft)}
                    </div>
                    <p className={`mt-3 text-sm font-medium ${theme.muted}`}>{isRunning ? "Session in progress" : "Ready when you are"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`rounded-3xl p-4 shadow-none ${theme.panel}`}>
                    <div className="mb-2 flex items-center gap-2 font-bold">A little motivation</div>
                    <p className={`text-sm leading-relaxed ${theme.muted}`}>{quote}</p>
                    {themeKey === "hero" && <p className="mt-3 text-[11px] font-bold tracking-[0.15em] text-cyan-700">LAB NOTE · PROGRESS IS BUILT, NOT FOUND</p>}
                    {themeKey === "survival" && <p className="mt-3 font-mono text-[11px] tracking-[0.15em] text-[#a2dcae]">&gt; DISTRACTIONS: QUARANTINED</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button className={`h-14 text-base ${theme.accent} ${theme.actionText}`} onClick={() => setIsRunning((r) => !r)}>
                      {isRunning ? "Pause" : "Start timer"}
                    </Button>
                    <Button className="h-14 bg-white/70 text-base text-slate-700" onClick={resetTimer}>
                      Reset
                    </Button>
                    <Button className="h-12 bg-white/70 text-slate-700" onClick={addFiveNow}>
                      + 5 minutes
                    </Button>
                    <Button className="h-12 bg-white/70 text-slate-700" onClick={startEmergencyBreak}>
                      Take a break
                    </Button>
                  </div>

                  <div className={`flex items-center justify-between rounded-3xl p-3 ${theme.panel}`}>
                    <span className="text-sm font-semibold">Timer length: {customMinutes[mode]} min</span>
                    <div className="flex gap-2">
                      <Button className="bg-white/70 px-3 text-slate-700" onClick={() => adjustMinutes(-1)}>
                        −
                      </Button>
                      <Button className="bg-white/70 px-3 text-slate-700" onClick={() => adjustMinutes(1)}>
                        +
                      </Button>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between rounded-3xl p-3 ${theme.panel}`}>
                    <span className="text-sm font-semibold">End sound</span>
                    <Button className="bg-white/70 px-3 text-slate-700" onClick={() => setSoundOn((s) => !s)}>
                      {soundOn ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className={`rounded-[2rem] ${theme.card}`}>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">Inspiration board</h2>
                    <p className={`text-sm ${theme.muted}`}>
                      Collect images, goals, or little reminders of what you are working toward.
                    </p>
                  </div>

                  <Button className={`${theme.accent} ${theme.actionText}`} onClick={() => fileInputRef.current?.click()}>
                    Add photos
                  </Button>

                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </div>

                {photos.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-current/20 p-8 text-center">
                    <div aria-hidden="true" className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${theme.chip}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                    <p className="font-bold">Your dream board is waiting.</p>
                    <p className={`mt-1 text-sm ${theme.muted}`}>Upload photos to make this feel personal and motivating.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="group relative rounded-2xl bg-white p-2 shadow-lg transition-transform hover:scale-105"
                        style={{ transform: `rotate(${index % 2 ? 2 : -2}deg)` }}
                      >
                        <div className="absolute -top-2 left-1/2 z-10 h-5 w-12 -translate-x-1/2 rounded-sm bg-amber-100/80 shadow-sm" />
                        <img src={photo.url} alt={photo.caption} className="h-28 w-full rounded-xl object-cover" />
                        <p className="mt-2 truncate text-center text-xs font-semibold text-slate-600">{photo.caption}</p>
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-700 shadow opacity-80 transition-opacity hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                          aria-label="Remove photo"
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" /><path d="M10 10v6m4-6v6" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className={`rounded-[2rem] ${theme.card}`}>
              <div className="p-5">
                <h2 className="mb-3 text-xl font-black">Session overview</h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className={`rounded-3xl p-4 ${theme.panel}`}>
                    <div className="text-2xl font-black">{sessionCount}</div>
                    <div className={`text-xs ${theme.muted}`}>completed</div>
                  </div>
                  <div className={`rounded-3xl p-4 ${theme.panel}`}>
                    <div className="text-2xl font-black">{Math.round(progress * 100)}%</div>
                    <div className={`text-xs ${theme.muted}`}>progress</div>
                  </div>
                  <div className={`rounded-3xl p-4 ${theme.panel}`}>
                    <div className="text-2xl font-black">{soundOn ? "on" : "off"}</div>
                    <div className={`text-xs ${theme.muted}`}>sound</div>
                  </div>
                </div>

                <div className={`mt-4 rounded-3xl p-4 ${theme.panel}`}>
                  <div className="mb-2 flex items-center gap-2 font-bold">Suggested rhythm</div>
                  <p className={`text-sm ${theme.muted}`}>
                    Try four focus sessions with short breaks in between, followed by a longer break. Adjust the pace to work for you.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
