// pages/web3.jsx
import Head from "next/head";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";

/** Env with safe fallbacks */
const CHAIN_HEX =
  (process.env.NEXT_PUBLIC_CHAIN_ID || "0xaa36a7") // hex ok
    .toString()
    .startsWith("0x")
    ? process.env.NEXT_PUBLIC_CHAIN_ID
    : "0x" + Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111).toString(16);

const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || "Sepolia";
const DEFAULT_TIP_TO =
  process.env.NEXT_PUBLIC_PLATFORM_OWNER ||
  process.env.NEXT_PUBLIC_SUPERCHAT_TREASURY ||
  ""; // fill in if you want a default

const SUPERCHAT_CONTRACT =
  process.env.NEXT_PUBLIC_SUPERCHAT_CONTRACT ||
  "0xD699d61Ce1554d4f7ef4b853283845F354f8a9Db";

function Web3Page() {
  // UI state
  const [haveMM, setHaveMM] = useState(false);
  const [addr, setAddr] = useState("");
  const [network, setNetwork] = useState("Not Connected");
  const [balanceEth, setBalanceEth] = useState("0.00");
  const [status, setStatus] = useState({ text: "", kind: "" });
  const [streamer, setStreamer] = useState(
    DEFAULT_TIP_TO || "0xFAe3D0fD8Ce589278000A4fDbe30A769E6c4cC1b"
  );
  const [amount, setAmount] = useState("0.001");

  const ethersReady = () =>
    typeof window !== "undefined" && !!window.ethers && !!window.ethereum;

  // Helpers
  const show = (text, kind = "info") => setStatus({ text, kind });

  const ensureChain = useCallback(async () => {
    if (!ethersReady()) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_HEX }],
      });
    } catch (e) {
      if (e?.code === 4902) {
        // add chain if missing
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: CHAIN_HEX,
              chainName: `${NETWORK_NAME} Testnet`,
              nativeCurrency: { name: `${NETWORK_NAME}ETH`, symbol: "ETH", decimals: 18 },
              rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ],
        });
      } else {
        throw e;
      }
    }
  }, []);

  const refreshBalance = useCallback(async (address) => {
    if (!ethersReady() || !address) return;
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const wei = await provider.getBalance(address);
    setBalanceEth(window.ethers.utils.formatEther(wei).slice(0, 8));
  }, []);

  const connect = useCallback(async () => {
    if (!ethersReady()) {
      show("Please install MetaMask to use Web3 features", "error");
      return;
    }
    try {
      show("Connecting to MetaMask…", "info");
      await ensureChain();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts?.[0] || "";
      setAddr(address);
      setNetwork(`${NETWORK_NAME} Testnet`);
      await refreshBalance(address);
      show("Wallet connected!", "success");
    } catch (e) {
      console.error(e);
      show(`Failed to connect: ${e.message || e}`, "error");
    }
  }, [ensureChain, refreshBalance]);

  const disconnect = () => {
    setAddr("");
    setNetwork("Not Connected");
    setBalanceEth("0.00");
    show("Wallet disconnected", "info");
  };

  const sendTip = async () => {
    if (!ethersReady()) return show("MetaMask not available", "error");
    if (!addr) return show("Connect wallet first", "error");
    if (!window.ethers.utils.isAddress(streamer)) return show("Invalid address", "error");
    try {
      show("Sending transaction…", "info");
      const provider = new window.ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: streamer,
        value: window.ethers.utils.parseEther(amount || "0.001"),
      });
      show("Waiting for confirmation…", "info");
      await tx.wait();
      show(`✅ Tip sent! Tx: ${tx.hash.slice(0, 10)}…`, "success");
      await refreshBalance(addr);
    } catch (e) {
      console.error(e);
      show(`Transaction failed: ${e.message || e}`, "error");
    }
  };

  const startEarning = () => {
    if (!addr) return show("Connect wallet to start earning", "error");
    show(`Your earning address: ${addr}`, "success");
    setTimeout(() => (window.location.href = "/stream"), 800);
  };

  const mintNFT = () => {
    show("NFT minting coming soon (will connect to your NFT contract).", "info");
  };

  // MM listeners
  useEffect(() => {
    setHaveMM(typeof window !== "undefined" && !!window.ethereum);
    if (typeof window !== "undefined" && window.ethereum) {
      const onAccounts = (accounts) => (accounts?.length ? connect() : disconnect());
      const onChain = () => window.location.reload();
      window.ethereum.on("accountsChanged", onAccounts);
      window.ethereum.on("chainChanged", onChain);
      return () => {
        window.ethereum.removeListener("accountsChanged", onAccounts);
        window.ethereum.removeListener("chainChanged", onChain);
      };
    }
  }, [connect]);

  return (
    <>
      <Head>
        <title>Web3 | BlueTubeTV</title>
      </Head>

      {/* Ethers v5 via CDN so we don’t add deps */}
      <Script
        src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"
        strategy="afterInteractive"
      />

      <main style={{ minHeight: "100vh", padding: "2rem",
        background: "linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#3b82c4 100%)",
        color: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <header style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{
              fontSize: 48, margin: 0,
              background: "linear-gradient(135deg,#60a5fa,#93c5fd)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              🚁 BlueTubeTV Web3
            </h1>
            <p>Decentralized Drone Streaming & NFT Marketplace</p>
          </header>

          {/* Wallet */}
          <section style={{
            background: "rgba(30,58,95,.9)", padding: 24, borderRadius: 20,
            border: "1px solid rgba(96,165,250,.3)", marginBottom: 24
          }}>
            <h2 style={{ marginBottom: 12 }}>💳 Wallet Connection</h2>
            <div style={{
              display: "grid", gap: 12,
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))"
            }}>
              <Card label="Network" value={network} />
              <Card label="Wallet Address" value={addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : "Click Connect"} />
              <Card label="ETH Balance" value={`${balanceEth} ETH`} />
            </div>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              {!addr ? (
                <button className="btn" onClick={connect} disabled={!haveMM}>Connect MetaMask</button>
              ) : (
                <button className="btn" onClick={disconnect}>Disconnect</button>
              )}
            </div>
          </section>

          {/* Contract */}
          <section style={{
            background: "rgba(30,58,95,.9)", padding: 24, borderRadius: 20,
            border: "1px solid rgba(96,165,250,.3)", marginBottom: 24
          }}>
            <h2 style={{ marginBottom: 12 }}>📜 Smart Contract</h2>
            <Card label="SuperChat Contract" value={SUPERCHAT_CONTRACT} />
            <div style={{ height: 8 }} />
            <Card label="Network" value={NETWORK_NAME} />
          </section>

          {/* Features */}
          <div style={{
            display: "grid", gap: 16,
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))"
          }}>
            <Feature
              icon="🎬"
              title="Stream to Earn"
              desc="Get paid in ETH for live drone streams. Viewers tip you directly."
              action="Start Earning"
              onClick={startEarning}
            />
            <Feature
              icon="🎨"
              title="Mint Stream NFTs"
              desc="Turn your best drone footage into NFTs and sell exclusive content."
              action="Mint NFT"
              onClick={mintNFT}
            />
            <Feature
              icon="💰"
              title="Crypto Tips"
              desc="Accept tips in ETH and stablecoins. Instant settlement."
              action="Send Tip"
              onClick={() => document.getElementById("tipAmount").focus()}
            />
          </div>

          {/* Tip form */}
          <section style={{
            background: "rgba(10,22,40,.8)", padding: 24, borderRadius: 16,
            marginTop: 24
          }}>
            <h2 style={{ marginBottom: 16 }}>💸 Send Tips to Streamers</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <LabeledInput
                label="Streamer Address"
                value={streamer}
                onChange={(e) => setStreamer(e.target.value)}
                placeholder="0x…"
              />
              <LabeledInput
                label="Tip Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.001"
                id="tipAmount"
              />
              <button className="btn" onClick={sendTip}>Send Tip 💰</button>
            </div>
            {!!status.text && (
              <div
                style={{
                  marginTop: 12, padding: 12, borderRadius: 8, textAlign: "center",
                  background:
                    status.kind === "success"
                      ? "rgba(34,197,94,.2)"
                      : status.kind === "error"
                      ? "rgba(239,68,68,.2)"
                      : "rgba(59,130,196,.2)",
                  border:
                    status.kind === "success"
                      ? "1px solid rgba(34,197,94,.5)"
                      : status.kind === "error"
                      ? "1px solid rgba(239,68,68,.5)"
                      : "1px solid rgba(59,130,196,.5)",
                }}
              >
                {status.text}
              </div>
            )}
          </section>
        </div>
      </main>

      <style jsx>{`
        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          color: white;
          background: linear-gradient(135deg, #3b82c4, #60a5fa);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,196,.5); }
      `}</style>
    </>
  );
}

/** Small UI helpers */
function Card({ label, value }) {
  return (
    <div style={{
      background: "rgba(10,22,40,.6)", padding: 16, borderRadius: 12,
      border: "1px solid rgba(59,130,196,.3)"
    }}>
      <div style={{ color: "#93c5fd", fontSize: 14, opacity: .9 }}>{label}</div>
      <div style={{ color: "#60a5fa", fontWeight: 700, wordBreak: "break-all" }}>{value}</div>
    </div>
  );
}

function Feature({ icon, title, desc, action, onClick }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(30,58,95,.7), rgba(59,130,196,.3))",
      padding: 16, borderRadius: 15, border: "1px solid rgba(96,165,250,.3)"
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: "#93c5fd", fontSize: 18, marginBottom: 6 }}>{title}</div>
      <div style={{ color: "#cbd5e1", marginBottom: 12 }}>{desc}</div>
      <button className="btn" onClick={onClick} style={{ width: "100%" }}>{action}</button>
    </div>
  );
}

function LabeledInput(props) {
  const { label, ...rest } = props;
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "#93c5fd" }}>{label}</span>
      <input
        {...rest}
        style={{
          padding: "12px 14px",
          borderRadius: 8,
          border: "1px solid rgba(96,165,250,.3)",
          background: "rgba(30,58,95,.5)",
          color: "white",
        }}
      />
    </label>
  );
}

export default dynamic(() => Promise.resolve(Web3Page), { ssr: false });
