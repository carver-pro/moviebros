import { useState, useEffect } from "react";

// ── CONSTANTS ─────────────────────────────────────────────────
const BROS = ["craig", "jake", "mike", "tyler"];
const BRO_COLORS = { craig: "#E8B84B", jake: "#4ECDC4", mike: "#FF6B6B", tyler: "#A78BFA" };
const BRO_INITIALS = { craig: "C", jake: "J", mike: "M", tyler: "T" };
const FONT = "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

// ── THEMES ────────────────────────────────────────────────────
const DARK = {
  bg: "#07070f", surface: "#0f0f1a", surfaceAlt: "#0a0a15",
  border: "#1e1e32", borderLight: "#12121f",
  text: "#ffffff", textMuted: "#555555", textSub: "#333333",
  navBg: "rgba(7,7,15,0.97)", headerBg: "rgba(7,7,15,0.95)",
  cardBg: "linear-gradient(160deg, #0f0f1a, #1a1a2e)",
  rowPressed: "#13132a", inputBg: "#0f0f1a",
  posterBg: "#1a1a2e", scoreTrack: "#1a1a2e",
  sheetBg: "#0d0d1e", sheetHandle: "#2a2a3e",
  beefCard: "#110808", tabActive: "#1e1e3a", tabActiveBorder: "#2a2a4e",
};
const LIGHT = {
  bg: "#f5f5f0", surface: "#ffffff", surfaceAlt: "#f0f0ea",
  border: "#e0e0d8", borderLight: "#e8e8e0",
  text: "#111111", textMuted: "#888888", textSub: "#bbbbbb",
  navBg: "rgba(245,245,240,0.97)", headerBg: "rgba(245,245,240,0.95)",
  cardBg: "linear-gradient(160deg, #ffffff, #f5f5f0)",
  rowPressed: "#ebebE3", inputBg: "#ffffff",
  posterBg: "#e0e0d8", scoreTrack: "#e8e8e0",
  sheetBg: "#ffffff", sheetHandle: "#d8d8d0",
  beefCard: "#fff5f5", tabActive: "#f0f0ff", tabActiveBorder: "#d0d0e8",
};

// ── DATA ──────────────────────────────────────────────────────
const MOVIES = [
  {
    id: 1, title: "Oppenheimer", year: 2023, genre: "Drama", type: "movie", tmdbId: 872585,
    ratings: {
      craig: { hype: 9, bro: 8.5, rewatch: 7 }, jake: { hype: 10, bro: 9, rewatch: 8.5 },
      mike: { hype: 7, bro: 6.5, rewatch: 5 }, tyler: { hype: 8.5, bro: 9, rewatch: 7 },
    },
    reviews: {
      craig: "Three hours felt like thirty minutes. Nolan cooked.",
      jake: "IMAX was insane. Top 5 all time.",
      mike: "Too long. Still good though.",
      tyler: "Cillian Murphy carried the whole thing.",
    },
  },
  {
    id: 2, title: "The Batman", year: 2022, genre: "Action", type: "movie", tmdbId: 414906,
    ratings: {
      craig: { hype: 8.5, bro: 9, rewatch: 9 }, jake: { hype: 7, bro: 8.5, rewatch: 8 },
      mike: { hype: 9, bro: 10, rewatch: 10 }, tyler: { hype: 6.5, bro: 7, rewatch: 6 },
    },
    reviews: {
      craig: "Best Batman movie ever made. Pattinson surprised everyone.",
      jake: "Riddler was terrifying. Great detective story.",
      mike: "I've seen this 4 times. Zero regrets.",
      tyler: "Too dark and rainy but the action was clean.",
    },
  },
  {
    id: 3, title: "Top Gun: Maverick", year: 2022, genre: "Action", type: "movie", tmdbId: 361743,
    ratings: {
      craig: { hype: 10, bro: 10, rewatch: 10 }, jake: { hype: 9, bro: 10, rewatch: 9 },
      mike: { hype: 8, bro: 9, rewatch: 8 }, tyler: { hype: 10, bro: 10, rewatch: 10 },
    },
    reviews: {
      craig: "Perfect movie. Doesn't exist.", jake: "Cinema saved.",
      mike: "Cruise is actually insane for doing this.",
      tyler: "We saw this twice opening weekend.",
    },
  },
  {
    id: 4, title: "Dune: Part Two", year: 2024, genre: "Sci-Fi", type: "movie", tmdbId: 693134,
    ratings: {
      craig: { hype: 8, bro: 7.5, rewatch: 6 }, jake: { hype: 9, bro: 8, rewatch: 7.5 },
      mike: { hype: 6, bro: 4.5, rewatch: 4 }, tyler: { hype: 8.5, bro: 7, rewatch: 6 },
    },
    reviews: {
      craig: "Visually insane. Story gets dense.",
      jake: "Feyd-Rautha is the best villain in years.",
      mike: "I fell asleep. Sorry.", tyler: "IMAX was worth every penny.",
    },
  },
  {
    id: 5, title: "The Last of Us", year: 2023, genre: "Drama", type: "tv", tmdbId: 100088,
    ratings: {
      craig: { hype: 10, bro: 10, rewatch: 9 }, jake: { hype: 9.5, bro: 9, rewatch: 8.5 },
      mike: { hype: 8, bro: 8.5, rewatch: 7 }, tyler: { hype: 9, bro: 9.5, rewatch: 8 },
    },
    reviews: {
      craig: "Episode 3 broke me. Best TV in years.",
      jake: "Pedro Pascal is untouchable right now.",
      mike: "Cried twice. Won't admit it again.",
      tyler: "Game fans and non-fans both loved it.",
    },
  },
  {
    id: 6, title: "Severance", year: 2022, genre: "Thriller", type: "tv", tmdbId: 95396,
    ratings: {
      craig: { hype: 9, bro: 8.5, rewatch: 7.5 }, jake: { hype: 8, bro: 9, rewatch: 8 },
      mike: { hype: 7.5, bro: 7, rewatch: 6 }, tyler: { hype: 9.5, bro: 9, rewatch: 8.5 },
    },
    reviews: {
      craig: "Nothing like it on TV. Absolutely wild concept.",
      jake: "Season 2 ending had me spiral for a week.",
      mike: "Too slow for me but I get the hype.",
      tyler: "Adam Scott deserves every award.",
    },
  },
  {
    id: 7, title: "Shogun", year: 2024, genre: "Drama", type: "tv", tmdbId: 126308,
    ratings: {
      craig: { hype: 8.5, bro: 9, rewatch: 8 }, jake: { hype: 9, bro: 9.5, rewatch: 9 },
      mike: { hype: 7, bro: 8, rewatch: 6.5 }, tyler: { hype: 8, bro: 8.5, rewatch: 7.5 },
    },
    reviews: {
      craig: "Slow burn masterpiece. Rewarded patience.",
      jake: "Best new show of 2024 by a mile.",
      mike: "Read subtitles the whole time but worth it.",
      tyler: "Hiroyuki Sanada is a legend.",
    },
  },
];

const COMING_SOON = [
  { id: "cs1", title: "Mandalorian & Grogu", releaseDate: "2026-05-22", emoji: "⭐", type: "movie", tmdbId: 1228710 },
  { id: "cs2", title: "Toy Story 5", releaseDate: "2026-06-19", emoji: "🎸", type: "movie", tmdbId: 1084244 },
  { id: "cs3", title: "Supergirl", releaseDate: "2026-06-26", emoji: "🦸‍♀️", type: "movie", tmdbId: 1081003 },
  { id: "cs4", title: "The Odyssey", releaseDate: "2026-07-17", emoji: "⚔️", type: "movie", tmdbId: 1124487 },
  { id: "cs5", title: "Spider-Man: Brand New Day", releaseDate: "2026-07-24", emoji: "🕷️", type: "movie", tmdbId: 1129793 },
  { id: "cs6", title: "Avengers: Doomsday", releaseDate: "2026-12-18", emoji: "🦾", type: "movie", tmdbId: 986056 },
];

// ── HELPERS ───────────────────────────────────────────────────
function roundHalf(v) { return Math.round(v * 2) / 2; }
function broScore(ratings) {
  const vals = Object.values(ratings).map(r => (r.hype + r.bro + r.rewatch) / 3);
  return roundHalf(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}
function userScore(r) { return roundHalf((r.hype + r.bro + r.rewatch) / 3).toFixed(1); }
function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T12:00:00"); target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

// ── TMDB POSTER HOOK ──────────────────────────────────────────
function useTMDBPoster(tmdbId, type) {
  const [poster, setPoster] = useState(null);
  useEffect(() => {
    if (!tmdbId || !TMDB_KEY) return;
    const endpoint = type === "tv"
      ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_KEY}`
      : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}`;
    fetch(endpoint)
      .then(r => r.json())
      .then(data => {
        if (data.poster_path) {
          setPoster(`https://image.tmdb.org/t/p/w300${data.poster_path}`);
        }
      })
      .catch(() => {});
  }, [tmdbId, type]);
  return poster;
}

// ── POSTER IMAGE ──────────────────────────────────────────────
function TMDBPoster({ tmdbId, type, alt, style, emoji = "🎬" }) {
  const poster = useTMDBPoster(tmdbId, type);
  const t_style = { background: "#1a1a2e", ...style };

  if (!poster) {
    return (
      <div style={{ ...t_style, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
        {emoji}
      </div>
    );
  }
  return (
    <img src={poster} alt={alt}
      style={{ ...t_style, objectFit: "cover", display: "block" }}
      onError={e => { e.target.style.display = "none"; }} />
  );
}

// ── SCORE RING ────────────────────────────────────────────────
function ScoreRing({ score, color, size = 52, t }) {
  const sw = 5, r = (size - sw * 2) / 2, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.scoreTrack} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - parseFloat(score) / 10)}
          strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: size * 0.27, fontWeight: 900, color: t.text }}>
        {score}
      </div>
    </div>
  );
}

// ── HALF-POINT SLIDER ─────────────────────────────────────────
function HalfPointSlider({ value, onChange, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <input type="range" min={0} max={10} step={0.5} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#aaa" }}>
        <span>0</span><span>5</span><span>10</span>
      </div>
    </div>
  );
}

// ── TYPE BADGE ────────────────────────────────────────────────
function TypeBadge({ type }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 5, flexShrink: 0,
      background: type === "tv" ? "#A78BFA22" : "#4ECDC422",
      color: type === "tv" ? "#A78BFA" : "#4ECDC4",
      border: `1px solid ${type === "tv" ? "#A78BFA44" : "#4ECDC444"}`,
    }}>
      {type === "tv" ? "TV" : "Film"}
    </span>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────
function BottomNav({ tab, setTab, t }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60,
      background: t.navBg, backdropFilter: "blur(20px)",
      borderTop: `1px solid ${t.border}`, display: "flex",
      paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      {[{ id: "vault", icon: "🎬", label: "Vault" },
        { id: "leaderboard", icon: "🏆", label: "Rankings" },
        { id: "beef", icon: "🥩", label: "Beef" }].map(item => (
        <button key={item.id} onClick={() => setTab(item.id)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          padding: "12px 0 8px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 3, fontFamily: FONT,
          WebkitTapHighlightColor: "transparent" }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
            textTransform: "uppercase",
            color: tab === item.id ? "#E8B84B" : t.textMuted }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── COMING SOON STRIP ─────────────────────────────────────────
function ComingSoonStrip({ t }) {
  return (
    <div style={{ borderBottom: `1px solid ${t.borderLight}`, paddingBottom: 16 }}>
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>🎟️</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: t.textMuted,
          textTransform: "uppercase", letterSpacing: 1.5 }}>Coming Soon</span>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto",
        paddingLeft: 16, paddingRight: 16, scrollbarWidth: "none" }}>
        {COMING_SOON.map(film => {
          const days = daysUntil(film.releaseDate);
          const isClose = days <= 30, isSoon = days <= 7;
          return (
            <div key={film.id} style={{ flexShrink: 0, width: 110 }}>
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden",
                marginBottom: 8, background: t.posterBg, width: 110, height: 155 }}>
                <TMDBPoster tmdbId={film.tmdbId} type={film.type} alt={film.title}
                  emoji={film.emoji}
                  style={{ width: 110, height: 155, borderRadius: 12 }} />
                <div style={{ position: "absolute", inset: 0,
                  background: `linear-gradient(to top, ${t.bg} 0%, transparent 55%)` }} />
                <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
                  <div style={{ display: "inline-block", borderRadius: 20, padding: "3px 10px",
                    background: isSoon ? "#FF6B6B" : isClose ? "#E8B84B" : "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(6px)" }}>
                    <span style={{ fontSize: 11, fontWeight: 900,
                      color: isSoon || isClose ? "#000" : "#fff" }}>
                      {days === 0 ? "TODAY" : days === 1 ? "TOMORROW" : `${days}d`}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.text, lineHeight: 1.3,
                textAlign: "center", overflow: "hidden",
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" }}>{film.title}</div>
              <div style={{ fontSize: 10, color: t.textMuted, textAlign: "center", marginTop: 3 }}>
                {new Date(film.releaseDate + "T12:00:00").toLocaleDateString("en-US",
                  { month: "short", day: "numeric" })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MOVIE / SHOW ROW ──────────────────────────────────────────
function MediaRow({ item, onSelect, t }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)} onClick={() => onSelect(item)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
        background: pressed ? t.rowPressed : "transparent",
        borderBottom: `1px solid ${t.borderLight}`,
        cursor: "pointer", transition: "background 0.1s", WebkitTapHighlightColor: "transparent" }}>
      <TMDBPoster tmdbId={item.tmdbId} type={item.type} alt={item.title} emoji="🎬"
        style={{ width: 54, height: 78, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: t.text,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            flex: 1, minWidth: 0 }}>{item.title}</div>
          <TypeBadge type={item.type} />
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>{item.year} · {item.genre}</div>
        <div style={{ display: "flex", gap: 5 }}>
          {BROS.map(b => (
            <div key={b} style={{ width: 26, height: 26, borderRadius: "50%",
              background: BRO_COLORS[b], display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#000" }}>
              {BRO_INITIALS[b]}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <ScoreRing score={broScore(item.ratings)} color="#E8B84B" size={48} t={t} />
        <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Bros</div>
      </div>
    </div>
  );
}

// ── VAULT SCREEN ──────────────────────────────────────────────
function VaultScreen({ onSelect, t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  coconst filtered = MOVIES.filter(m => {
  const matchSearch = search === "" || m.title.toLowerCase().includes(search.toLowerCase());
  const matchType = filter === "all" || m.type === filter;
  return matchSearch && matchType;
});

  const movies = MOVIES.filter(m => m.type === "movie");
  const shows = MOVIES.filter(m => m.type === "tv");
  const allAvg = (MOVIES.map(m => parseFloat(broScore(m.ratings))).reduce((a,b)=>a+b,0)/MOVIES.length).toFixed(1);

  return (
    <div>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.borderLight}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.inputBg,
          borderRadius: 12, padding: "10px 14px", border: `1px solid ${t.border}` }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search the vault..."
            style={{ flex: 1, background: "none", border: "none", outline: "none",
              color: t.text, fontSize: 15, fontFamily: FONT }} />
        </div>
      </div>

      <div style={{ display: "flex", padding: "10px 16px", borderBottom: `1px solid ${t.borderLight}` }}>
        {[{ id: "all", label: "All" }, { id: "movie", label: "🎬 Films" },
          { id: "tv", label: "📺 Shows" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            flex: 1, padding: "9px 0", background: filter === f.id ? "#E8B84B" : t.surface,
            border: `1px solid ${filter === f.id ? "#E8B84B" : t.border}`,
            borderRadius: f.id === "all" ? "10px 0 0 10px" : f.id === "tv" ? "0 10px 10px 0" : "0",
            color: filter === f.id ? "#000" : t.textMuted,
            fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
            WebkitTapHighlightColor: "transparent", transition: "all 0.15s" }}>
            {f.label}
          </button>
        ))}
      </div>

      <ComingSoonStrip t={t} />

      <div style={{ display: "flex", padding: "10px 16px", gap: 8,
        borderBottom: `1px solid ${t.borderLight}`, overflowX: "auto" }}>
        {[{ label: "Films", value: movies.length },
          { label: "Shows", value: shows.length },
          { label: "Avg Score", value: allAvg, color: "#E8B84B" },
          { label: "Top Pick", value: "Maverick" },
          { label: "Hardest Critic", value: "Mike", color: BRO_COLORS.mike }].map((s, i) => (
          <div key={i} style={{ flexShrink: 0, background: t.surface, borderRadius: 10,
            padding: "8px 14px", border: `1px solid ${t.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: s.color || t.text }}>{s.value}</div>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase",
              letterSpacing: 0.8, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>{filtered.map(m => <MediaRow key={m.id} item={m} onSelect={onSelect} t={t} />)}</div>
      <div style={{ height: 100 }} />

      <div style={{ position: "fixed", bottom: 72, right: 20, zIndex: 50 }}>
        <button style={{ width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #E8B84B, #c9932a)", border: "none",
          cursor: "pointer", fontSize: 26, display: "flex", alignItems: "center",
          justifyContent: "center", boxShadow: "0 4px 20px rgba(232,184,75,0.45)",
          WebkitTapHighlightColor: "transparent", color: "#000", fontWeight: 900 }}>+</button>
      </div>
    </div>
  );
}

// ── LEADERBOARD SCREEN ────────────────────────────────────────
function LeaderboardScreen({ t }) {
  const [filter, setFilter] = useState("all");
  const items = filter === "all" ? MOVIES : MOVIES.filter(m => m.type === filter);

  const stats = BROS.map(bro => {
    const scores = items.map(m => parseFloat(userScore(m.ratings[bro])));
    if (!scores.length) return { bro, avg: 0, catAvgs: ["0","0","0"], watched: 0 };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const catAvgs = ["hype", "bro", "rewatch"].map(cat => {
      const vals = items.map(m => m.ratings[bro][cat]);
      return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    });
    return { bro, avg: parseFloat(avg.toFixed(2)), catAvgs, watched: items.length };
  }).sort((a, b) => b.avg - a.avg);

  const medals = ["🥇", "🥈", "🥉", "4️⃣"];
  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: t.text, marginBottom: 4 }}>Rankings</div>
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Who's got the best taste?</div>

      <div style={{ display: "flex", marginBottom: 20 }}>
        {[{ id: "all", label: "All" }, { id: "movie", label: "🎬 Films" },
          { id: "tv", label: "📺 Shows" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            flex: 1, padding: "9px 0", background: filter === f.id ? "#E8B84B" : t.surface,
            border: `1px solid ${filter === f.id ? "#E8B84B" : t.border}`,
            borderRadius: f.id === "all" ? "10px 0 0 10px" : f.id === "tv" ? "0 10px 10px 0" : "0",
            color: filter === f.id ? "#000" : t.textMuted,
            fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
            WebkitTapHighlightColor: "transparent" }}>
            {f.label}
          </button>
        ))}
      </div>

      {stats.map((s, i) => (
        <div key={s.bro} style={{
          background: t.cardBg,
          border: `1px solid ${i === 0 ? "#E8B84B44" : t.border}`,
          borderRadius: 18, padding: 18, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{medals[i]}</span>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: BRO_COLORS[s.bro],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "#000" }}>{BRO_INITIALS[s.bro]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: t.text,
                textTransform: "capitalize" }}>{s.bro}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{s.watched} titles rated</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: BRO_COLORS[s.bro] }}>{s.avg}</div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>avg</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🍿 Hype", "🎬 Bro", "🔁 Rewatch"].map((label, ci) => (
              <div key={ci} style={{ flex: 1, background: t.surfaceAlt, borderRadius: 10,
                padding: "8px 6px", textAlign: "center", border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: BRO_COLORS[s.bro] }}>{s.catAvgs[ci]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── BEEF SCREEN ───────────────────────────────────────────────
function BeefScreen({ t }) {
  const [bro1, setBro1] = useState("craig");
  const [bro2, setBro2] = useState("mike");
  const [filter, setFilter] = useState("all");

  const items = filter === "all" ? MOVIES : MOVIES.filter(m => m.type === filter);

  const disagreements = items.map(m => ({
    movie: m,
    s1: parseFloat(userScore(m.ratings[bro1])),
    s2: parseFloat(userScore(m.ratings[bro2])),
    gap: Math.abs(parseFloat(userScore(m.ratings[bro1])) - parseFloat(userScore(m.ratings[bro2]))),
  })).sort((a, b) => b.gap - a.gap);

  const agreements = items.filter(m =>
    Math.abs(parseFloat(userScore(m.ratings[bro1])) - parseFloat(userScore(m.ratings[bro2]))) <= 0.5
  );

  const b1avg = items.length ? (items.map(m => parseFloat(userScore(m.ratings[bro1]))).reduce((a,b)=>a+b,0)/items.length).toFixed(1) : "0.0";
  const b2avg = items.length ? (items.map(m => parseFloat(userScore(m.ratings[bro2]))).reduce((a,b)=>a+b,0)/items.length).toFixed(1) : "0.0";

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: t.text, marginBottom: 4 }}>Beef Report</div>
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Who disagrees the most?</div>

      <div style={{ display: "flex", marginBottom: 16 }}>
        {[{ id: "all", label: "All" }, { id: "movie", label: "🎬 Films" },
          { id: "tv", label: "📺 Shows" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            flex: 1, padding: "9px 0", background: filter === f.id ? "#E8B84B" : t.surface,
            border: `1px solid ${filter === f.id ? "#E8B84B" : t.border}`,
            borderRadius: f.id === "all" ? "10px 0 0 10px" : f.id === "tv" ? "0 10px 10px 0" : "0",
            color: filter === f.id ? "#000" : t.textMuted,
            fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
            WebkitTapHighlightColor: "transparent" }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase",
            letterSpacing: 1, marginBottom: 6 }}>Bro 1</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BROS.map(b => (
              <button key={b} onClick={() => b !== bro2 && setBro1(b)} style={{
                padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: bro1 === b ? BRO_COLORS[b] : t.surface,
                color: bro1 === b ? "#000" : t.textMuted,
                fontSize: 12, fontWeight: 800, fontFamily: FONT,
                textTransform: "capitalize", WebkitTapHighlightColor: "transparent",
                outline: bro1 === b ? "none" : `1px solid ${t.border}` }}>{b}</button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 18, color: "#FF6B6B", fontWeight: 900, marginTop: 22 }}>vs</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: "uppercase",
            letterSpacing: 1, marginBottom: 6 }}>Bro 2</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BROS.map(b => (
              <button key={b} onClick={() => b !== bro1 && setBro2(b)} style={{
                padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: bro2 === b ? BRO_COLORS[b] : t.surface,
                color: bro2 === b ? "#000" : t.textMuted,
                fontSize: 12, fontWeight: 800, fontFamily: FONT,
                textTransform: "capitalize", WebkitTapHighlightColor: "transparent",
                outline: bro2 === b ? "none" : `1px solid ${t.border}` }}>{b}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: t.beefCard, border: "1px solid #FF6B6B33",
        borderRadius: 18, padding: 18, marginBottom: 16, display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: BRO_COLORS[bro1],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 900, color: "#000", margin: "0 auto 6px" }}>
            {BRO_INITIALS[bro1]}
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: BRO_COLORS[bro1] }}>{b1avg}</div>
          <div style={{ fontSize: 12, color: t.textMuted, textTransform: "capitalize" }}>{bro1}</div>
        </div>
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <div style={{ fontSize: 11, color: "#FF6B6B", fontWeight: 700, letterSpacing: 1 }}>BEEF</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#FF6B6B" }}>
            {Math.abs(parseFloat(b1avg) - parseFloat(b2avg)).toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: t.textMuted }}>pt gap</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: BRO_COLORS[bro2],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 900, color: "#000", margin: "0 auto 6px" }}>
            {BRO_INITIALS[bro2]}
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: BRO_COLORS[bro2] }}>{b2avg}</div>
          <div style={{ fontSize: 12, color: t.textMuted, textTransform: "capitalize" }}>{bro2}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: t.textMuted, textTransform: "uppercase",
        letterSpacing: 1.2, marginBottom: 10 }}>🥩 Biggest Disagreements</div>
      {disagreements.map(({ movie, s1, s2, gap }) => (
        <div key={movie.id} style={{ background: t.surface, borderRadius: 14,
          padding: "14px 16px", marginBottom: 10,
          border: `1px solid ${gap >= 2 ? "#FF6B6B44" : t.border}`,
          display: "flex", alignItems: "center", gap: 14 }}>
          <TMDBPoster tmdbId={movie.tmdbId} type={movie.type} alt={movie.title} emoji="🎬"
            style={{ width: 44, height: 60, borderRadius: 6, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 6,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: BRO_COLORS[bro1] }}>{s1}</span>
              <div style={{ flex: 1, height: 4, background: t.scoreTrack, borderRadius: 2,
                position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: `${Math.min(s1,s2)*10}%`,
                  width: `${gap*10}%`, height: "100%",
                  background: gap >= 2 ? "#FF6B6B" : t.textMuted, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: BRO_COLORS[bro2] }}>{s2}</span>
            </div>
          </div>
          <div style={{ flexShrink: 0, fontSize: 13, fontWeight: 900,
            color: gap >= 2 ? "#FF6B6B" : t.textMuted,
            background: gap >= 2 ? "#FF6B6B15" : t.surfaceAlt,
            padding: "4px 10px", borderRadius: 8 }}>{gap.toFixed(1)} pts</div>
        </div>
      ))}

      {agreements.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 800, color: t.textMuted, textTransform: "uppercase",
            letterSpacing: 1.2, margin: "20px 0 10px" }}>🤝 Actually Agree On</div>
          {agreements.map(m => (
            <div key={m.id} style={{ background: t.surface, borderRadius: 14, padding: "12px 16px",
              marginBottom: 10, border: "1px solid #4ECDC433",
              display: "flex", alignItems: "center", gap: 12 }}>
              <TMDBPoster tmdbId={m.tmdbId} type={m.type} alt={m.title} emoji="🎬"
                style={{ width: 36, height: 50, borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                <TypeBadge type={m.type} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#4ECDC4" }}>
                {userScore(m.ratings[bro1])}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── DETAIL SHEET ──────────────────────────────────────────────
function DetailSheet({ item, onClose, t }) {
  const [tab, setTab] = useState("scores");
  const [localRatings, setLocalRatings] = useState(() => {
    const copy = {};
    BROS.forEach(b => { copy[b] = { ...item.ratings[b] }; });
    return copy;
  });

  function updateRating(bro, cat, val) {
    setLocalRatings(prev => ({ ...prev, [bro]: { ...prev[bro], [cat]: val } }));
  }

  const allScores = BROS.map(b => ({ bro: b, score: parseFloat(userScore(localRatings[b])) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxHeight: "90vh",
        background: t.sheetBg, borderRadius: "24px 24px 0 0",
        border: `1px solid ${t.border}`, borderBottom: "none", overflowY: "auto",
        paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>

        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, background: t.sheetHandle, borderRadius: 2 }} />
        </div>

        <div style={{ display: "flex", gap: 16, padding: "16px 20px 20px" }}>
          <TMDBPoster tmdbId={item.tmdbId} type={item.type} alt={item.title} emoji="🎬"
            style={{ width: 70, height: 100, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: t.text, lineHeight: 1.2 }}>{item.title}</div>
              <TypeBadge type={item.type} />
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 14 }}>{item.year} · {item.genre}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ScoreRing score={broScore(localRatings)} color="#E8B84B" size={50} t={t} />
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Bros Rating</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#E8B84B" }}>Group Average</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", margin: "0 16px 20px", background: t.surfaceAlt,
          borderRadius: 12, padding: 4, border: `1px solid ${t.border}` }}>
          {[{ id: "scores", label: "📊 Scores" }, { id: "reviews", label: "💬 Takes" },
            { id: "beef", label: "🥩 Beef" }].map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              flex: 1, padding: "10px 0",
              background: tab === tb.id ? t.tabActive : "transparent",
              border: tab === tb.id ? `1px solid ${t.tabActiveBorder}` : "1px solid transparent",
              borderRadius: 9, color: tab === tb.id ? t.text : t.textMuted,
              fontSize: 12, fontWeight: 800, cursor: "pointer",
              fontFamily: FONT, transition: "all 0.15s",
              WebkitTapHighlightColor: "transparent" }}>{tb.label}</button>
          ))}
        </div>

        <div style={{ padding: "0 16px 24px" }}>
          {tab === "scores" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BROS.map(bro => (
                <div key={bro} style={{ background: t.surfaceAlt, borderRadius: 16, padding: 16,
                  border: `1px solid ${BRO_COLORS[bro]}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%",
                      background: BRO_COLORS[bro], display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#000" }}>
                      {BRO_INITIALS[bro]}
                    </div>
                    <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: t.text,
                      textTransform: "capitalize" }}>{bro}</div>
                    <ScoreRing score={userScore(localRatings[bro])} color={BRO_COLORS[bro]} size={46} t={t} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["hype","🍿 Hype"], ["bro","🎬 Bro Score"], ["rewatch","🔁 Rewatch"]].map(([cat, label]) => (
                      <div key={cat} style={{ background: t.surface, borderRadius: 10,
                        padding: "10px 14px", border: `1px solid ${t.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 700 }}>{label}</div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: BRO_COLORS[bro] }}>
                            {localRatings[bro][cat].toFixed(1)}
                          </div>
                        </div>
                        <HalfPointSlider value={localRatings[bro][cat]}
                          onChange={val => updateRating(bro, cat, val)}
                          color={BRO_COLORS[bro]} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BROS.map(bro => (
                <div key={bro} style={{ background: t.surfaceAlt, borderRadius: 16, padding: 16,
                  border: `1px solid ${BRO_COLORS[bro]}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%",
                      background: BRO_COLORS[bro], display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#000" }}>
                      {BRO_INITIALS[bro]}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: t.text,
                      textTransform: "capitalize", flex: 1 }}>{bro}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: BRO_COLORS[bro] }}>
                      {userScore(localRatings[bro])}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.6, fontStyle: "italic",
                    background: t.surface, borderRadius: 10, padding: "10px 14px",
                    border: `1px solid ${t.border}` }}>
                    "{item.reviews[bro]}"
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "beef" && (
            <div>
              <div style={{ background: t.beefCard, borderRadius: 16, padding: 18,
                border: "1px solid #FF6B6B33", marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase",
                  letterSpacing: 1, marginBottom: 12 }}>The Biggest Beef</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                  {[allScores[0], allScores[allScores.length - 1]].map((s, i) => (
                    <div key={s.bro} style={{ textAlign: "center" }}>
                      <div style={{ width: 50, height: 50, borderRadius: "50%",
                        background: BRO_COLORS[s.bro], display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#000",
                        margin: "0 auto 8px" }}>{BRO_INITIALS[s.bro]}</div>
                      <div style={{ fontSize: 24, fontWeight: 900,
                        color: i === 0 ? "#4ECDC4" : "#FF6B6B" }}>{s.score.toFixed(1)}</div>
                      <div style={{ fontSize: 11, color: t.textMuted,
                        textTransform: "capitalize" }}>{s.bro}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: t.textMuted }}>
                  {(allScores[0].score - allScores[allScores.length-1].score).toFixed(1)} pt gap ·{" "}
                  {allScores[0].score - allScores[allScores.length-1].score >= 2
                    ? "🥩 This is beef." : "Mild shade only."}
                </div>
              </div>
              {allScores.map(({ bro, score }) => (
                <div key={bro} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%",
                    background: BRO_COLORS[bro], display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#000",
                    flexShrink: 0 }}>{BRO_INITIALS[bro]}</div>
                  <div style={{ flex: 1, height: 10, background: t.scoreTrack, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${score * 10}%`, height: "100%",
                      background: `linear-gradient(90deg, ${BRO_COLORS[bro]}88, ${BRO_COLORS[bro]})`,
                      borderRadius: 5, transition: "width 0.3s ease" }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: BRO_COLORS[bro],
                    width: 36, textAlign: "right" }}>{score.toFixed(1)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────
export default function MovieBros() {
  const [navTab, setNavTab] = useState("vault");
  const [selected, setSelected] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const t = darkMode ? DARK : LIGHT;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: FONT,
      color: t.text, maxWidth: 430, margin: "0 auto", position: "relative",
      transition: "background 0.25s, color 0.25s" }}>

      <div style={{ position: "sticky", top: 0, zIndex: 50,
        background: t.headerBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.border}`, padding: "14px 20px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9,
            background: "linear-gradient(135deg, #E8B84B, #b8780a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, boxShadow: "0 2px 12px rgba(232,184,75,0.4)" }}>🎬</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Movie<span style={{ color: "#E8B84B" }}>Bros</span>
            </div>
            <div style={{ fontSize: 9, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
              Private Screening Club
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setDarkMode(d => !d)} style={{
            width: 44, height: 26, borderRadius: 13,
            background: darkMode ? "#E8B84B" : t.border,
            border: "none", cursor: "pointer", position: "relative",
            transition: "background 0.25s", flexShrink: 0,
            WebkitTapHighlightColor: "transparent" }}>
            <div style={{
              position: "absolute", top: 3,
              left: darkMode ? 21 : 3,
              width: 20, height: 20, borderRadius: "50%",
              background: darkMode ? "#000" : "#fff",
              transition: "left 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
              {darkMode ? "🌙" : "☀️"}
            </div>
          </button>
          <div style={{ display: "flex", gap: 5 }}>
            {BROS.map(bro => (
              <div key={bro} style={{ width: 28, height: 28, borderRadius: "50%",
                background: BRO_COLORS[bro], display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#000",
                border: `2px solid ${t.bg}` }}>{BRO_INITIALS[bro]}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingBottom: 80 }}>
        {navTab === "vault" && <VaultScreen onSelect={setSelected} t={t} />}
        {navTab === "leaderboard" && <LeaderboardScreen t={t} />}
        {navTab === "beef" && <BeefScreen t={t} />}
      </div>

      <BottomNav tab={navTab} setTab={setNavTab} t={t} />
      {selected && <DetailSheet item={selected} onClose={() => setSelected(null)} t={t} />}
    </div>
  );
}