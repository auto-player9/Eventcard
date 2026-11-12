"use client";

import { useEffect, useRef, useState } from "react";
import { EVENT, TEXT, type Lang, type TextKey } from "@/lib/config";

type Row = { id: number; name: string; fixed: boolean; answer: "yes" | "no" | null };

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

export default function Invitation({ guests, invite }: { guests: string[]; invite: string | null }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [bg, setBg] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rows, setRows] = useState<Row[]>(() =>
    guests.length
      ? guests.map((n, i) => ({ id: i, name: n, fixed: true, answer: null }))
      : [{ id: 0, name: "", fixed: false, answer: null }]
  );
  const [msg, setMsg] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err" | "need">("idle");
  const audio = useRef<HTMLAudioElement>(null);

  const t = (k: TextKey) => TEXT[lang][k];
  const html = (k: TextKey) => ({ dangerouslySetInnerHTML: { __html: TEXT[lang][k] } });

  /* language → <html> attributes */
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  /* loader */
  useEffect(() => {
    const done = () => setTimeout(() => setLoaded(true), 500);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    const fallback = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(fallback);
  }, []);

  /* lock scrolling until started */
  useEffect(() => {
    document.body.classList.toggle("lock", !started);
    return () => document.body.classList.remove("lock");
  }, [started]);

  /* background slideshow: change photo every 1.5s */
  useEffect(() => {
    const n = EVENT.backgrounds.length;
    const id = setInterval(() => setBg((i) => (i + 1) % n), EVENT.slideMs);
    return () => clearInterval(id);
  }, []);

  /* reveal cards on scroll */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* music */
  const fadeIn = (a: HTMLAudioElement) => {
    a.volume = 0;
    const id = setInterval(() => { a.volume = Math.min(0.6, a.volume + 0.04); if (a.volume >= 0.6) clearInterval(id); }, 120);
  };
  const play = () => {
    const a = audio.current;
    if (!a) return;
    fadeIn(a);
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) play();
    else { a.pause(); setPlaying(false); }
  };

  const start = () => {
    setStarted(true);
    window.scrollTo(0, 0);
    play();
  };

  /* RSVP */
  const setRow = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, { id: Date.now(), name: "", fixed: false, answer: null }]);

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
          message: msg,
          invite,
          lang,
          website: hp,
        }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  };

  return (
    <>
      <div id="loader" className={loaded ? "done" : ""}>
        <div className="ld">
          <div className="ld-sq">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
          Loading..
        </div>
      </div>

      {/* ============ COVER ============ */}
      <section id="cover" className={started ? "gone" : ""}>
        <div className="ph" style={{ backgroundImage: `url(${EVENT.cover})` }} />
        <button className="lang" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{t("lang")}</button>
        <div className="in">
          <Monogram color="#fff" />
          <div className="cover-names" dir="ltr">{EVENT.namesEn}</div>
          <div className="cover-date" dir="ltr">{EVENT.dateShort}</div>
          <button className="start" onClick={start}>{t("start")}</button>
        </div>
      </section>

      {/* ============ BACKGROUNDS ============ */}
      <div className="bgs">
        {EVENT.backgrounds.map((src, i) => (
          <div key={src} className={i === bg ? "on" : ""} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>

      <main className="inv-main">

        {/* invitation */}
        <section className="panel">
          <div className="card reveal">
            <Monogram color="var(--gold)" />
            <svg className="ico" style={{ width: 26, height: 26, margin: "4px auto 0", color: "var(--ink)" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M10 7H6a3 3 0 0 0-3 3v4h5v-4H5.5A1.5 1.5 0 0 1 7 8.5h3zm9 0h-4a3 3 0 0 0-3 3v4h5v-4h-2.5A1.5 1.5 0 0 1 16 8.5h3z" />
            </svg>
            <p {...html("quote")} />
            <p style={{ marginTop: 22 }} {...html("withlove")} />
            <p className="fam" {...html("families")} />
            <p {...html("invite")} />
            <div className="names" {...html("names")} />
            <p {...html("date")} />
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
            <div>{t("tz")}</div>
            <svg className="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 1a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
            <div className="venue">{EVENT.venue}</div>
            <div>{t("place")}</div>
            <a className="btn" href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer">{t("map")}</a>
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
                {g.lines.map((l, i) => <div className="gift-v" key={i}>{l}</div>)}
              </div>
            ))}
          </div>
        </section>

        {/* RSVP */}
        <section className="rsvp">
          <div className="torn-top" />
          <div className="wrap reveal">
            <h2 className="title">{t("rsvpTitle")}</h2>
            <p>{t("rsvpBy")}</p>
            <p className="label">{t("who")}</p>
            <div className="who">
              {rows.map((r) => (
                <div className="row" key={r.id}>
                  {r.fixed ? (
                    <span className="nm">{r.name}</span>
                  ) : (
                    <input className="nm" value={r.name} placeholder={t("namePh")} maxLength={80}
                      onChange={(e) => setRow(r.id, { name: e.target.value })} />
                  )}
                  <button type="button" className={`pill yes ${r.answer === "yes" ? "sel" : ""}`} onClick={() => setRow(r.id, { answer: "yes" })}>
                    ✓ <span>{t("yes")}</span>
                  </button>
                  <button type="button" className={`pill no ${r.answer === "no" ? "sel" : ""}`} onClick={() => setRow(r.id, { answer: "no" })}>
                    ✕ <span>{t("no")}</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="add" onClick={addRow}>{t("add")}</button>

            <p className="label" style={{ marginTop: 24 }}>{t("share")}</p>
            <textarea maxLength={120} value={msg} placeholder={t("msgPh")} onChange={(e) => setMsg(e.target.value)} />
            <div className="count">{msg.length} / 120</div>
            <input className="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden />

            <button className="submit" onClick={submit} disabled={status === "sending" || status === "ok"}>
              {status === "sending" ? t("sending") : t("confirm")}
            </button>
            {status === "ok" && <div className="note ok">{t("thanks")}</div>}
            {status === "err" && <div className="note err">{t("error")}</div>}
            {status === "need" && <div className="note err">{t("needAnswer")}</div>}

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

      {started && (
        <button id="music" className={playing ? "playing" : "paused"} onClick={toggleMusic} aria-label="music">
          <svg viewBox="0 0 64 64">
            <path d="M32 56S6 40 6 22A13 13 0 0 1 32 15a13 13 0 0 1 26 7c0 18-26 34-26 34z" fill="#fff" stroke="#888" strokeWidth="2.5" />
            <path d="M27 38v-12l12-3v12" fill="none" stroke="#888" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="24.5" cy="38" r="3" fill="#888" />
            <circle cx="36.5" cy="35" r="3" fill="#888" />
          </svg>
        </button>
      )}
      <audio ref={audio} src={EVENT.music} loop preload="auto" />
    </>
  );
}
