// pages/stream.jsx
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function StreamPage() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [live, setLive] = useState(false);
  const [start, setStart] = useState(null);
  const [duration, setDuration] = useState("00:00:00");
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    let tick;
    if (live && start) {
      tick = setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        const hh = String(Math.floor(s / 3600)).padStart(2, "0");
        const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        setDuration(`${hh}:${mm}:${ss}`);
      }, 1000);
    }
    return () => clearInterval(tick);
  }, [live, start]);

  useEffect(() => {
    let t;
    if (live) {
      setViewers(1);
      t = setInterval(() => {
        setViewers((v) => Math.max(1, v + Math.floor(Math.random() * 3) - 1));
      }, 5000);
    }
    return () => clearInterval(t);
  }, [live]);

  const startStream = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: "user" },
        audio: true,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setStart(Date.now());
      setLive(true);
    } catch (e) {
      alert("Please allow camera & microphone.");
      console.error(e);
    }
  };

  const stopStream = () => {
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
    setLive(false);
    setStart(null);
    setDuration("00:00:00");
  };

  const toggleAudio = () => {
    if (!stream) return;
    const track = stream.getAudioTracks()?.[0];
    if (track) track.enabled = !track.enabled;
    alert(track?.enabled ? "Microphone ON" : "Microphone MUTED");
  };

  return (
    <>
      <Head><title>Go Live | BlueTubeTV</title></Head>

      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#3b82c4 100%)",
        color: "white"
      }}>
        <nav style={{
          padding: "16px 24px", display: "flex", justifyContent: "space-between",
          borderBottom: "1px solid rgba(59,130,196,.3)", background: "rgba(10,22,40,.95)"
        }}>
          <div style={{
            fontWeight: 800, fontSize: 20,
            background: "linear-gradient(135deg,#3b82c4,#60a5fa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>🚁 BlueTubeTV</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</a>
            <a href="/browse" style={{ color: "#94a3b8", textDecoration: "none" }}>Browse</a>
            <a href="/jobs" style={{ color: "#94a3b8", textDecoration: "none" }}>Jobs</a>
            <a href="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>Dashboard</a>
          </div>
        </nav>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
          <section style={{
            background: "linear-gradient(135deg,rgba(30,58,95,.9),rgba(59,130,196,.5))",
            padding: 24, borderRadius: 20, border: "1px solid rgba(96,165,250,.3)",
            boxShadow: "0 20px 40px rgba(0,0,0,.3)", marginBottom: 24
          }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h1 style={{
                margin: 0, fontSize: 32,
                background: "linear-gradient(135deg,#60a5fa,#93c5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>🔴 Go Live on BlueTubeTV</h1>
              <p>Professional Drone Streaming Platform</p>
            </div>

            <div id="status" style={{
              textAlign: "center", padding: 12, borderRadius: 10,
              background: live ? "rgba(239,68,68,.2)" : "rgba(10,22,40,.8)",
              border: live ? "1px solid rgba(239,68,68,.5)" : "1px solid rgba(59,130,196,.3)",
              marginBottom: 16
            }}>
              {live ? "🔴 LIVE - Stream Active" : 'Ready • Click "Start Stream"'}
            </div>

            <div style={{
              position: "relative", maxWidth: 900, margin: "0 auto 16px",
              borderRadius: 15, overflow: "hidden", background: "#0a1628",
              border: "2px solid rgba(59,130,196,.5)"
            }}>
              <video ref={videoRef} autoPlay muted style={{ width: "100%", minHeight: 500 }} />
              <div style={{ position: "absolute", top: 20, left: 20, display: "flex", gap: 12 }}>
                <div style={{
                  display: live ? "block" : "none",
                  background: "#ef4444", padding: "6px 12px",
                  borderRadius: 8, fontWeight: 800
                }}>🔴 LIVE</div>
                <div style={{ background: "rgba(10,22,40,.8)", padding: "6px 12px", borderRadius: 8 }}>
                  {viewers} viewers
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {!live ? (
                <button className="btn primary" onClick={startStream}>🎬 Start Stream</button>
              ) : (
                <button className="btn" onClick={stopStream}>⏹️ Stop Stream</button>
              )}
              <button className="btn" onClick={toggleAudio}>🎙️ Toggle Audio</button>
            </div>

            <div style={{
              marginTop: 16, background: "rgba(10,22,40,.6)", padding: 16,
              borderRadius: 12, border: "1px solid rgba(59,130,196,.3)"
            }}>
              <h3 style={{ color: "#93c5fd", margin: 0, marginBottom: 12 }}>Stream Analytics</h3>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
                <InfoItem label="Duration" value={duration} />
                <InfoItem label="Stream Quality" value="1080p HD" />
                <InfoItem label="Bitrate" value="~4500 kbps" />
                <InfoItem label="Frame Rate" value="30 fps" />
              </div>
            </div>
          </section>

          <section style={{
            background: "linear-gradient(135deg,rgba(30,58,95,.7),rgba(59,130,196,.3))",
            padding: 24, borderRadius: 15, border: "1px solid rgba(96,165,250,.3)"
          }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, color: "#93c5fd" }}>💰 Support This Stream</h2>
              <p>Show your appreciation with a tip!</p>
            </div>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
              <a className="pay" href="https://paypal.me/garlanjrobinson" target="_blank" rel="noreferrer">💳 PayPal</a>
              <a className="pay" href="https://cash.app/$Bluetubetv910" target="_blank" rel="noreferrer">💵 CashApp</a>
              <a className="pay" href="https://buymeacoffee.com/garlanjrobinson" target="_blank" rel="noreferrer">☕ Buy Me a Coffee</a>
              <a className="pay" href="/web3">🪙 Send Crypto</a>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .btn {
          padding: 1rem 2rem; border: none; border-radius: 12px;
          font-weight: 700; cursor: pointer; color: white;
          background: rgba(30,58,95,.8); border: 1px solid rgba(59,130,196,.5);
        }
        .btn.primary { background: linear-gradient(135deg,#3b82c4,#60a5fa); border: none; }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(59,130,196,.4); }
        .pay {
          padding: 1rem; text-align: center; text-decoration: none; color: white;
          border: 1px solid rgba(96,165,250,.5); border-radius: 12px;
          background: linear-gradient(135deg,rgba(59,130,196,.2),rgba(96,165,250,.2));
        }
        .pay:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(59,130,196,.3); }
      `}</style>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{
      padding: 12, borderRadius: 10,
      background: "linear-gradient(135deg,rgba(30,58,95,.5),rgba(59,130,196,.2))",
      border: "1px solid rgba(96,165,250,.2)"
    }}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
      <div style={{ color: "#93c5fd", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(StreamPage), { ssr: false });
