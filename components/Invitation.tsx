"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EVENT, TEXT, type Lang, type TextKey } from "@/lib/config";

type Row = { id: number; name: string; fixed: boolean; answer: "yes" | "no" | null };
const STORE_KEY = "rsvp-sent";
const KB = ["kbA", "kbB", "kbC", "kbD"]; // Ken Burns directions, one per slide

function Monogram({ color }: { color: string }) {
  return (
    <svg className="mono" viewBox="0 0 200 200" style={{ color }} aria-hidden>
      <circle cx="82" cy="112" r="52" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <text x="118" y="168" textAnchor="middle" fontSize="172" fill="currentColor" fontFamily="Cormorant Garamond, serif">
        {EVENT.monogram.b}
      </text>
    </svg>
  );
}

function Divider() {
  return (
    <svg className="divider" viewBox="0 0 160 14" aria-hidden>
      <path d="M0 7h62M98 7h62" stroke="currentColor" strokeWidth="1" />
      <path d="M80 1l6 6-6 6-6-6z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="80" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}

function useCountdown(target: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return { done: left === 0, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export default function Invitation({ guests, invite }: { guests: string[]; invite: string | null }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [slide, setSlide] = useState({ cur: 0, prev: -1, n: 0 });
  const [playing, setPlaying] = useState(false);
  const [rows, setRows] = useState<Row[]>(() =>
    guests.length
      ? guests.map((n, i) => ({ id: i, name: n, fixed: true, answer: null }))
      : [{ id: 0, name: "", fixed: false, answer: null }]
  );
  const [msg, setMsg] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err" | "need">("idle");
  const [replied, setReplied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showFab, setShowFab] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const wasPlaying = useRef(false);
  const rsvpRef = useRef<HTMLElement>(null);
  const cd = useCountdown(EVENT.start);

  const t = (k: TextKey) => TEXT[lang][k];
  const html = (k: TextKey) => ({ dangerouslySetInnerHTML: { __html: TEXT[lang][k] } });

  /* language → <html> attributes */
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  /* loader: wait for the cover + first slides to be decoded so nothing pops in */
  useEffect(() => {
    let cancelled = false;
    const srcs = [EVENT.cover, ...EVENT.backgrounds.slice(0, 2)];
    Promise.all(
      srcs.map((src) => new Promise<void>((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = src; }))
    ).then(() => !cancelled && setTimeout(() => setLoaded(true), 300));
    const fallback = setTimeout(() => setLoaded(true), 5000);
    // warm the rest of the photos in the background
    EVENT.backgrounds.slice(2).forEach((src) => { const i = new Image(); i.src = src; });
    return () => { cancelled = true; clearTimeout(fallback); };
  }, []);

  /* remember if this device already replied */
  useEffect(() => {
    try { if (localStorage.getItem(STORE_KEY)) setReplied(true); } catch { /* storage unavailable */ }
  }, []);

  /* lock scrolling until started */
  useEffect(() => {
    document.body.classList.toggle("lock", !started);
    return () => document.body.classList.remove("lock");
  }, [started]);

  /* background slideshow: smooth crossfade, starts after "tap to begin" */
  useEffect(() => {
    if (!started) return;
    const total = EVENT.backgrounds.length;
    const id = setInterval(
      () => setSlide((s) => ({ cur: (s.cur + 1) % total, prev: s.cur, n: s.n + 1 })),
      EVENT.slideMs
    );
    return () => clearInterval(id);
  }, [started]);

  /* reveal cards on scroll + floating RSVP button visibility */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const onScroll = () => {
      const r = rsvpRef.current?.getBoundingClientRect();
      setShowFab(scrollY > innerHeight * 0.6 && !!r && r.top > innerHeight * 0.9);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

  /* music */
  const fade = useCallback((a: HTMLAudioElement, to: number, done?: () => void) => {
    const step = to > a.volume ? 0.04 : -0.06;
    const id = setInterval(() => {
      const v = Math.min(1, Math.max(0, a.volume + step));
      a.volume = v;
      if ((step > 0 && v >= to) || (step < 0 && v <= to)) { clearInterval(id); done?.(); }
    }, 80);
  }, []);
  const play = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0;
    a.play().then(() => { setPlaying(true); fade(a, 0.6); }).catch(() => setPlaying(false));
  }, [fade]);
  const pause = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    setPlaying(false);
    fade(a, 0, () => a.pause());
  }, [fade]);
  const toggleMusic = () => (audio.current?.paused ? play() : pause());

  /* pause music when the guest leaves the tab, resume when they return */
  useEffect(() => {
    const onVis = () => {
      const a = audio.current;
      if (!a) return;
      if (document.hidden) { wasPlaying.current = !a.paused; a.pause(); }
      else if (wasPlaying.current) play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [play]);

  const start = () => {
    setStarted(true);
    window.scrollTo(0, 0);
    play();
  };

  /* helpers */
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 1800); };
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    flash(t("copied"));
  };
  const calendarHref = () => {
    if (typeof navigator !== "undefined" && /iPhone|iPad|Macintosh/.test(navigator.userAgent)) return "/calendar.ics";
    const f = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
    const q = new URLSearchParams({
      action: "TEMPLATE", text: EVENT.calendarTitle, dates: `${f(EVENT.start)}/${f(EVENT.end)}`, location: EVENT.calendarLocation,
    });
    return `https://calendar.google.com/calendar/render?${q}`;
  };

  /* RSVP */
  const setRow = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, { id: Date.now(), name: "", fixed: false, answer: null }]);
  const removeRow = (id: number) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));

  const submit = async () => {
    const answered = rows.filter((r) => r.name.trim() && r.answer);
    if (!answered.length) { setStatus("need"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guests: answered.map((r) => ({ name: r.name.trim(), attending: r.answer === "yes" })),
          message: msg, invite, lang, website: hp,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setReplied(true);
      try { localStorage.setItem(STORE_KEY, new Date().toISOString()); } catch { /* ignore */ }
    } catch {
      setStatus("err");
    }
  };

  return (
    <>
      <div id="loader" className={loaded ? "done" : ""}>
        <div className="ld">
          <Monogram color="#b9a27c" />
          <div className="ld-bar"><i /></div>
        </div>
      </div>

      {/* ============ COVER ============ */}
      <section id="cover" className={`${started ? "gone" : ""} ${loaded ? "ready" : ""}`}>
        <div className="ph" style={{ backgroundImage: `url(${EVENT.cover})` }} />
        <button className="lang" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{t("lang")}</button>
        <div className="in">
          <div className="st st1"><Monogram color="#fff" /></div>
          <div className="cover-names st st2" dir="ltr">{EVENT.namesEn}</div>
          <div className="cover-date st st3" dir="ltr">{EVENT.dateShort}</div>
          <button className="start st st4" onClick={start}>{t("start")}</button>
        </div>
      </section>

      {/* ============ BACKGROUND SLIDESHOW ============ */}
      <div className="bgs" aria-hidden>
        {EVENT.backgrounds.map((src, i) => (
          <div
            key={src}
            className={i === slide.cur ? "on" : i === slide.prev ? "prev" : ""}
            style={{
              backgroundImage: `url(${src})`,
              animationName: started && (i === slide.cur || i === slide.prev) ? KB[i % KB.length] : "none",
              animationDuration: `${EVENT.slideMs + EVENT.fadeMs + 600}ms`,
              transitionDuration: `${EVENT.fadeMs}ms`,
            }}
          />
        ))}
        <div className="bgs-shade" />
      </div>

      <main className="inv-main">
        <div className="scroll-cue" aria-hidden><span /></div>

        {/* invitation */}
        <section className="panel">
          <div className="card reveal in">
            <Monogram color="var(--gold)" />
            <svg className="ico quote-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M10 7H6a3 3 0 0 0-3 3v4h5v-4H5.5A1.5 1.5 0 0 1 7 8.5h3zm9 0h-4a3 3 0 0 0-3 3v4h5v-4h-2.5A1.5 1.5 0 0 1 16 8.5h3z" />
            </svg>
            <p className="quote" {...html("quote")} />
            <Divider />
            <p {...html("withlove")} />
            <p className="fam" {...html("families")} />
            <p {...html("invite")} />
            <div className="names" {...html("names")} />
            <p {...html("date")} />
          </div>
        </section>

        {/* countdown */}
        <section className="panel">
          <div className="card reveal">
            <h2 className="title">{t("countdown")}</h2>
            {cd?.done ? (
              <p className="big" style={{ marginTop: 12 }}>{Date.now() > new Date(EVENT.end).getTime() ? t("passed") : t("today")}</p>
            ) : (
              <div className="cd">
                {([["d", "days"], ["h", "hours"], ["m", "minutes"], ["s", "seconds"]] as const).map(([k, label]) => (
                  <div key={k}>
                    <b>{cd ? String(cd[k]).padStart(2, "0") : "--"}</b>
                    <span>{t(label)}</span>
                  </div>
                ))}
              </div>
            )}
            <a className="btn" href={calendarHref()} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" /></svg>
              {t("addCal")}
            </a>
          </div>
        </section>

        {/* celebration */}
        <section className="panel">
          <div className="card reveal">
            <h2 className="title">{t("celebration")}</h2>
            <svg className="ico" viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="11" fill="currentColor" />
              <path d="M12 6v6h4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <div className="big">{t("time")}</div>
            <div className="muted">{t("tz")}</div>
            <svg className="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 1a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
            <div className="venue">{EVENT.venue}</div>
            <div className="muted">{t("place")}</div>
            <a className="btn" href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
              {t("map")}
            </a>
          </div>
        </section>

        {/* gifts */}
        <section className="panel">
          <div className="card reveal">
            <h2 className="title">{t("gifts")}</h2>
            <p style={{ marginTop: 14 }} {...html("giftText")} />
            {EVENT.gifts.map((g) => (
              <div key={g.name}>
                <div className="gift-h">{g.name}</div>
                {g.lines.map((l, i) => {
                  const value = l.replace(/^Phone#\s*/i, "");
                  const copyable = /\d{4,}/.test(value);
                  return copyable ? (
                    <button key={i} className="gift-v copyable" onClick={() => copy(value.replace(/\s/g, ""))} title={t("copy")}>
                      {l}
                      <svg viewBox="0 0 24 24" aria-hidden><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                    </button>
                  ) : (
                    <div className="gift-v" key={i}>{l}</div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* RSVP */}
        <section className="rsvp" ref={rsvpRef} id="rsvp">
          <div className="torn-top" />
          <div className="wrap reveal">
            <h2 className="title">{t("rsvpTitle")}</h2>
            <p>{t("rsvpBy")}</p>

            {status === "ok" ? (
              <div className="done-box">
                <svg viewBox="0 0 52 52" className="check" aria-hidden>
                  <circle cx="26" cy="26" r="24" fill="none" />
                  <path d="M15 27l7 7 15-16" fill="none" />
                </svg>
                <p>{t("thanks")}</p>
                <button className="add" onClick={() => setStatus("idle")}>{t("editReply")}</button>
              </div>
            ) : (
              <>
                {replied && status === "idle" && <div className="note ok">{t("replied")}</div>}
                <p className="label">{t("who")}</p>
                <div className={`who ${status === "need" ? "shake" : ""}`}>
                  {rows.map((r) => (
                    <div className="row" key={r.id}>
                      {r.fixed ? (
                        <span className="nm">{r.name}</span>
                      ) : (
                        <input className="nm" value={r.name} placeholder={t("namePh")} maxLength={80}
                          onChange={(e) => { setRow(r.id, { name: e.target.value }); if (status === "need") setStatus("idle"); }} />
                      )}
                      <button type="button" aria-pressed={r.answer === "yes"} className={`pill yes ${r.answer === "yes" ? "sel" : ""}`}
                        onClick={() => { setRow(r.id, { answer: "yes" }); if (status === "need") setStatus("idle"); }}>
                        ✓ <span>{t("yes")}</span>
                      </button>
                      <button type="button" aria-pressed={r.answer === "no"} className={`pill no ${r.answer === "no" ? "sel" : ""}`}
                        onClick={() => { setRow(r.id, { answer: "no" }); if (status === "need") setStatus("idle"); }}>
                        ✕ <span>{t("no")}</span>
                      </button>
                      {!r.fixed && rows.length > 1 && (
                        <button type="button" className="rm" onClick={() => removeRow(r.id)} aria-label="remove">×</button>
                      )}
                    </div>
                  ))}
                </div>
                <button className="add" onClick={addRow}>{t("add")}</button>

                <p className="label" style={{ marginTop: 24 }}>{t("share")}</p>
                <textarea maxLength={120} value={msg} placeholder={t("msgPh")} onChange={(e) => setMsg(e.target.value)} />
                <div className="count">{msg.length} / 120</div>
                <input className="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden />

                <button className="submit" onClick={submit} disabled={status === "sending"}>
                  {status === "sending" ? <span className="spin" aria-hidden /> : null}
                  {status === "sending" ? t("sending") : t("confirm")}
                </button>
                {status === "err" && <div className="note err">{t("error")}</div>}
                {status === "need" && <div className="note err">{t("needAnswer")}</div>}
              </>
            )}

            <p className="kiss" {...html("kiss")} />
          </div>
        </section>

        <footer className="foot">
          <div className="pic" style={{ backgroundImage: `url(${EVENT.footer})` }} />
          <div className="always" {...html("always")} />
          <div className="powered">
            <span>Powered by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/syncly-logo.svg" alt="Syncly" width={93} height={22} />
          </div>
        </footer>
      </main>

      {/* floating RSVP shortcut */}
      <button
        className={`fab ${showFab && started ? "show" : ""}`}
        onClick={() => rsvpRef.current?.scrollIntoView({ behavior: "smooth" })}
      >
        {replied ? "✓ " : ""}{t("rsvpShort")}
      </button>

      {started && (
        <button id="music" className={playing ? "playing" : "paused"} onClick={toggleMusic} aria-label={playing ? "pause music" : "play music"}>
          <svg viewBox="0 0 64 64">
            <path d="M32 56S6 40 6 22A13 13 0 0 1 32 15a13 13 0 0 1 26 7c0 18-26 34-26 34z" fill="#fff" stroke="#9a8a6e" strokeWidth="2.5" />
            <path d="M27 38v-12l12-3v12" fill="none" stroke="#9a8a6e" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="24.5" cy="38" r="3" fill="#9a8a6e" />
            <circle cx="36.5" cy="35" r="3" fill="#9a8a6e" />
            {!playing && <path d="M14 14l36 36" stroke="#9a8a6e" strokeWidth="2.5" strokeLinecap="round" />}
          </svg>
        </button>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
      <audio ref={audio} src={EVENT.music} loop preload="auto" />
    </>
  );
}
