"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./page.module.css";

type MessageRole = "usuario" | "nexus";

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  vibeIndex: number;
  timestamp: string;
};

const VIBES = [
  {
    label: "ÓRBITA EMPÁTICA",
    accent: "rgba(0, 255, 198, 0.7)",
    glow: "0 0 34px rgba(0, 255, 198, 0.55)",
    border: "linear-gradient(120deg, rgba(0, 255, 198, 0.42), rgba(114, 73, 255, 0.28))"
  },
  {
    label: "VISIÓN SINTÉTICA",
    accent: "rgba(114, 73, 255, 0.75)",
    glow: "0 0 34px rgba(114, 73, 255, 0.55)",
    border: "linear-gradient(120deg, rgba(114, 73, 255, 0.4), rgba(255, 115, 250, 0.3))"
  },
  {
    label: "PULSO NARRATIVO",
    accent: "rgba(255, 115, 250, 0.75)",
    glow: "0 0 34px rgba(255, 115, 250, 0.45)",
    border: "linear-gradient(120deg, rgba(255, 115, 250, 0.45), rgba(0, 255, 198, 0.3))"
  },
  {
    label: "TRAZA ANALÍTICA",
    accent: "rgba(88, 154, 255, 0.75)",
    glow: "0 0 34px rgba(88, 154, 255, 0.5)",
    border: "linear-gradient(120deg, rgba(88, 154, 255, 0.42), rgba(135, 211, 255, 0.26))"
  }
];

type Orbit = {
  radius: number;
  angle: number;
  elevation: number;
  tilt: number;
  float: number;
};

const ORBITS: Orbit[] = [
  { radius: 240, angle: -22, elevation: -70, tilt: -8, float: 0 },
  { radius: 320, angle: 15, elevation: -120, tilt: 12, float: 12 },
  { radius: 260, angle: 42, elevation: -20, tilt: -16, float: -14 },
  { radius: 300, angle: -58, elevation: 60, tilt: 18, float: 16 },
  { radius: 210, angle: 78, elevation: 110, tilt: -12, float: -8 },
  { radius: 340, angle: -102, elevation: -140, tilt: 22, float: 18 }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "seed-1",
    role: "nexus",
    content:
      "Bienvenida al Atrio Neuronal. Las memorias sintéticas orbitan esperando la próxima conexión humana.",
    vibeIndex: 1,
    timestamp: "00:01"
  },
  {
    id: "seed-2",
    role: "usuario",
    content:
      "Quiero una lluvia de ideas para diseñar una experiencia multisensorial que sorprenda a toda la galaxia.",
    vibeIndex: 0,
    timestamp: "00:18"
  },
  {
    id: "seed-3",
    role: "nexus",
    content:
      "Proyectemos: nubes hápticas, sonido binaural modulable y luz líquida que reacciona a la intención humana.",
    vibeIndex: 2,
    timestamp: "00:27"
  }
];

const WAVE_POINTS = 52;

function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function synthesizeResponse(prompt: string): string {
  const seeds = [
    "Proyectemos un relato donde tus palabras generen ecos cromáticos que envolvieron a la audiencia.",
    "Diseñemos patrones sonoros que caen como meteoros suaves sobre la percepción colectiva.",
    "Imagina cápsulas de aroma inteligente sincronizadas con micromovimientos de luz.",
    "Podemos cultivar avatares líquidos que se fragmentan en partículas de ideas cuando los tocas.",
    "Activemos un pergamino de datos que se pliega siguiendo la emoción dominante en la sala."
  ];

  const catalyst = prompt
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 140)
    .toLowerCase();

  if (!catalyst) {
    return seeds[Math.floor(Math.random() * seeds.length)];
  }

  const fragments = catalyst
    .split(" ")
    .filter(Boolean)
    .slice(0, 6)
    .map((fragment, index) =>
      fragment.length > 6
        ? fragment.slice(0, 4) + "·" + fragment.slice(4, 6 + (index % 3))
        : fragment
    );

  const hybrids = [
    `Entretejamos ${fragments[0] ?? "ideas"} con partículas lumínicas que respondan a tus gestos.`,
    `Amplifiquemos ${fragments[1] ?? "impulsos"} con ondas sónicas que abracen las paredes del espacio.`,
    `Sincronizaremos ${fragments[2] ?? "emociones"} con nubes cinéticas que respiran contigo.`
  ];

  const blueprint = seeds[Math.floor(Math.random() * seeds.length)];

  return `${hybrids[Math.floor(Math.random() * hybrids.length)]} ${blueprint}`;
}

function computeOrbit(index: number, total: number) {
  const orbit = ORBITS[index % ORBITS.length];
  const depthFactor = (total - index) / total;
  const angleRad = (orbit.angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * orbit.radius;
  const z = Math.sin(angleRad) * orbit.radius * 0.52;
  const y = orbit.elevation;
  const translate = `translate3d(${x}px, ${y}px, ${z}px)`;
  const rotate = `rotateY(${orbit.angle * -0.6}deg) rotateX(${orbit.tilt}deg)`;
  const scale = `scale(${0.92 + depthFactor * 0.18})`;
  return `${translate} ${rotate} ${scale}`;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [spectrum, setSpectrum] = useState<number[]>(() =>
    Array.from({ length: WAVE_POINTS }, () => Math.random())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSpectrum(prev =>
        prev.map((value, index) => {
          const drift = Math.sin(Date.now() / 520 + index) * 0.25;
          const base = Math.random() * 0.85 + 0.15;
          return Math.min(1, Math.max(0.15, value * 0.6 + base * 0.4 + drift * 0.1));
        })
      );
    }, 220);

    return () => clearInterval(interval);
  }, []);

  const timeline = useMemo(() => {
    return messages.slice(-4).map(entry => {
      const descriptor = entry.role === "usuario" ? "Humana" : "Nexus";
      const excerpt = entry.content.length > 42 ? `${entry.content.slice(0, 42)}…` : entry.content;
      return `${descriptor}: ${excerpt}`;
    });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "usuario",
      content: trimmed,
      vibeIndex: Math.floor(Math.random() * VIBES.length),
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    const thinkingDelay = 1000 + Math.random() * 1200;

    window.setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "nexus",
        content: synthesizeResponse(trimmed),
        vibeIndex: Math.floor(Math.random() * VIBES.length),
        timestamp: formatTimestamp()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, thinkingDelay);
  };

  return (
    <main className={styles.mainCanvas}>
      <div className={styles.plasma} />
      <div className="noise-overlay" />

      <div className={styles.interface}>
        <span
          data-index="1"
          className={styles.floatingWisp}
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <span
          data-index="2"
          className={styles.floatingWisp}
          style={{ animation: "float 12s ease-in-out infinite", animationDelay: "-2s" }}
        />
        <span
          data-index="3"
          className={styles.floatingWisp}
          style={{ animation: "float 10s ease-in-out infinite", animationDelay: "1.6s" }}
        />

        <div className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <span className={styles.badge}>
                <span>PROTOCOLO</span>
                <span>∞</span>
                <span>RESONANTE</span>
              </span>
              <h1 className={styles.title}>Aurelia Nexus</h1>
              <p className={styles.subtitle}>
                Un portal conversacional que reimagina el intercambio humano-IA como una danza de
                partículas, luz y narrativa viva. Cada mensaje se desplaza en tres dimensiones y deja una
                traza sensorial única.
              </p>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusOrb} />
              <span className={styles.statusLabel}>ESTADO</span>
              <span className={styles.statusValue}>{isThinking ? "sintetizando" : "a la escucha"}</span>
            </div>
          </header>

          <section className={styles.orbitalMatrix}>
            <div className={styles.haloFrame}>
              <motion.div
                className={styles.core}
                animate={{ rotateZ: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
              >
                <div className={styles.spectrum}>
                  {spectrum.map((value, index) => (
                    <motion.span
                      key={`spectrum-${index}`}
                      className={styles.spectrumBar}
                      animate={{ height: `${value * 90 + 10}px` }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.div>

              <AnimatePresence>
                {messages.map((message, index) => {
                  const vibe = VIBES[message.vibeIndex % VIBES.length];
                  const total = messages.length;
                  return (
                    <motion.article
                      key={message.id}
                      className={styles.messageOrbit}
                      initial={{ opacity: 0, scale: 0.72 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{
                        transform: computeOrbit(index, total),
                        filter: `drop-shadow(${vibe.glow})`
                      }}
                    >
                      <motion.div
                        className={styles.messageCard}
                        style={{
                          boxShadow: `0 20px 40px rgba(7, 3, 25, 0.32), 0 0 22px ${vibe.accent}`,
                          background:
                            message.role === "nexus"
                              ? "linear-gradient(140deg, rgba(19, 11, 52, 0.88), rgba(26, 16, 64, 0.78))"
                              : "linear-gradient(140deg, rgba(10, 6, 40, 0.86), rgba(25, 18, 58, 0.72))"
                        }}
                        whileHover={{ translateZ: 24, rotateX: 6, rotateY: -4 }}
                      >
                        <div className={styles.messageHeader}>
                          <span className={styles.roleLabel}>
                            {message.role === "usuario" ? "Exploradora" : "Núcleo"}
                          </span>
                          <span className={styles.timestamp}>{message.timestamp}</span>
                        </div>
                        <p className={styles.messageBody}>{message.content}</p>
                        <span className={styles.vibeTag}>{vibe.label}</span>
                      </motion.div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className={styles.timeline}>
              <div className={styles.timelineTrack}>
                <div className={styles.timelinePulse}>
                  <span className={styles.pulseDot} />
                  <span className={styles.timelineLabel}>Flujo conversacional</span>
                </div>
                <div className={styles.timelineSteps}>
                  {timeline.map(item => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <span className={styles.statusValue}>
                {isThinking ? "Calculando convergencias" : "Listo para tu próxima visión"}
              </span>
            </div>
          </section>

          <footer className={styles.inputDock}>
            <div className={styles.inputFieldset}>
              <div className={styles.inputLabelRow}>
                <span>CANAL ORBITAL ENTRANTE</span>
                <div className={styles.sensoryModes}>
                  <span className={styles.modeChip}>
                    <span>◈</span>
                    <span>Visión</span>
                  </span>
                  <span className={styles.modeChip}>
                    <span>❖</span>
                    <span>Sonoridad</span>
                  </span>
                  <span className={styles.modeChip}>
                    <span>✶</span>
                    <span>Háptico</span>
                  </span>
                </div>
              </div>
              <textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Describe la experiencia imposible que deseas desbloquear…"
                className={styles.inputSurface}
              />
            </div>

            <motion.button
              type="button"
              className={styles.hologramButton}
              whileTap={{ scale: 0.96 }}
              onClick={handleSend}
            >
              <span>{isThinking ? "..." : "Emitir"}</span>
            </motion.button>
          </footer>
        </div>

        <span className={styles.mobileNote}>
          La interfaz holográfica adapta la experiencia al gesto táctil.
        </span>
      </div>
    </main>
  );
}
