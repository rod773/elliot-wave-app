"use client";

import { useEffect, useRef, useState } from "react";
import pages from "@/pages.json";

export default function Home() {
  const [i, setI] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [volume, setVolume] = useState(1);
  const reading = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices().filter((x) => /^es/i.test(x.lang));
      setVoices(v);
      setVoiceName((prev) => prev || v.find((x) => /albert/i.test(x.name))?.name || v[0]?.name || "");
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);
  const page = pages[i];
  const speakPage = (idx: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (idx >= pages.length) { reading.current = false; return; }
    reading.current = true;
    setI(idx);
    window.speechSynthesis.cancel();
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.name === voiceName) ||
        voices.find((v) => /albert/i.test(v.name)) ||
        voices.find((v) => /es/i.test(v.lang) && /male|pablo|diego|jorge|carlos|miguel/i.test(v.name));
      const u = new SpeechSynthesisUtterance(pages[idx].text);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang || "es-ES";
      } else {
        u.lang = "es-ES";
      }
      u.volume = volume;
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = pick;
    } else {
      pick();
    }
  };
  const speak = () => speakPage(i);
  const stop = () => { reading.current = false; window.speechSynthesis.cancel(); };
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Principio de las Ondas de Elliott</h1>
      <div className="flex gap-2 items-center">
        <button disabled={i===0} onClick={()=>setI(i-1)} className="px-3 py-1 border rounded">Anterior</button>
        <span>Página {page.page} / {pages.length}</span>
        <button disabled={i===pages.length-1} onClick={()=>setI(i+1)} className="px-3 py-1 border rounded">Siguiente</button>
        <select value={voiceName} onChange={(e)=>setVoiceName(e.target.value)} className="border rounded px-2 py-1 text-sm">
          {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
        </select>
        <button onClick={speak} className="px-3 py-1 border rounded">Leer</button>
        <button onClick={stop} className="px-3 py-1 border rounded">Detener</button>
      </div>
      <img src={`/pages/page-${page.page}.png`} alt={`Página ${page.page}`} className="max-w-full border" />
      <textarea readOnly value={page.text} className="w-full max-w-4xl h-48 border p-2 text-sm" />
    </main>
  );
}
