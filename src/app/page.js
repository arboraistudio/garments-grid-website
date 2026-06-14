"use client";

import React, { useState, useEffect, useRef } from "react";

// ============ SVG ICONS ============
function OxfordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

function JacketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function DressIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 4h-3V2h-8v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 17l3-3 3 3M12 2v2" />
    </svg>
  );
}

function TrousersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
      <path d="M9 6V3h6v3" />
    </svg>
  );
}

// ============ CONFIGURATION ============
// Paste your deployed Google Apps Script Web App URL here to enable Google Sheet logging:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtpTu4FOzTZ4JSQ2prVNnSns5rRzo5Q9Jjj0jZogBps8TRd8pwLnZqJsepd9JSygGNQQ/exec";

export default function Home() {
  // ============ STATE: ZIP CODE VALIDATION ============
  const [zipCode, setZipCode] = useState("");
  const [zipResult, setZipResult] = useState("");

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return;
    setZipResult(`✨ Launching in your hub region soon! We've pre-registered postal area "${zipCode}". Check our plans and join the waitlist below.`);
    setTimeout(() => {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 2000);
  };

  // ============ STATE: HOW IT WORKS ROTATION ============
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulatingOrder, setIsSimulatingOrder] = useState(false);
  const autoRotateTimerRef = useRef(null);

  const startAutoRotate = () => {
    if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4500);
  };

  const stopAutoRotate = () => {
    if (autoRotateTimerRef.current) {
      clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isSimulatingOrder) {
      startAutoRotate();
    } else {
      stopAutoRotate();
    }
    return () => stopAutoRotate();
  }, [isSimulatingOrder]);

  const handleStepSelect = (idx) => {
    if (isSimulatingOrder) return;
    stopAutoRotate();
    setActiveStep(idx);
  };

  // ============ STATE: VISUAL CATALOG SANDBOX ============
  const [garments, setGarments] = useState([
    { id: "oxford", name: "Oxford shirt", icon: <OxfordIcon />, selected: true, service: "full", saveTime: 15 },
    { id: "jacket", name: "Suit jacket", icon: <JacketIcon />, selected: true, service: "full", saveTime: 20 },
    { id: "dress", name: "Silk dress", icon: <DressIcon />, selected: false, service: "full", saveTime: 25 },
    { id: "trousers", name: "Trousers", icon: <TrousersIcon />, selected: true, service: "press", saveTime: 10 }
  ]);
  const [selectedGarmentId, setSelectedGarmentId] = useState(null);
  const [shutterOpacity, setShutterOpacity] = useState(0);

  const handleGarmentClick = (id) => {
    if (isSimulatingOrder) return;
    setGarments((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextSelected = selectedGarmentId === id ? !g.selected : true;
          return { ...g, selected: nextSelected };
        }
        return g;
      })
    );
    setSelectedGarmentId((prev) => (prev === id ? null : id));
  };

  const setGarmentService = (id, service) => {
    if (isSimulatingOrder) return;
    setGarments((prev) =>
      prev.map((g) => (g.id === id ? { ...g, service } : g))
    );
  };

  const triggerCameraFlash = () => {
    if (isSimulatingOrder) return;
    setShutterOpacity(1);
    setTimeout(() => {
      setShutterOpacity(0);
    }, 150);

    // Toggle a random unselected garment to selected
    const unselected = garments.filter((g) => !g.selected);
    if (unselected.length > 0) {
      const randomGarment = unselected[Math.floor(Math.random() * unselected.length)];
      setGarments((prev) =>
        prev.map((g) => (g.id === randomGarment.id ? { ...g, selected: true } : g))
      );
      setSelectedGarmentId(randomGarment.id);
    } else {
      // Toggle first garment off then back on to show change
      setGarments((prev) =>
        prev.map((g, idx) => (idx === 0 ? { ...g, selected: false } : g))
      );
      setTimeout(() => {
        setGarments((prev) =>
          prev.map((g, idx) => (idx === 0 ? { ...g, selected: true } : g))
        );
        setSelectedGarmentId("oxford");
      }, 200);
    }
  };

  const startOrderSimulation = () => {
    if (isSimulatingOrder) return;
    setIsSimulatingOrder(true);
    setActiveStep(0);

    // Sequence through the screens:
    // Step 0 -> Step 1 (Pickup) after 800ms
    setTimeout(() => {
      setActiveStep(1);

      // Step 1 -> Step 2 (Process) after 4000ms
      setTimeout(() => {
        setActiveStep(2);

        // Step 2 -> Step 3 (Delivery) after 4000ms
        setTimeout(() => {
          setActiveStep(3);

          // Step 3 -> Reset to Step 0 after 4000ms
          setTimeout(() => {
            setActiveStep(0);
            setIsSimulatingOrder(false);
          }, 4000);
        }, 4000);
      }, 4000);
    }, 800);
  };

  // Selected config target helper
  const selectedConfigGarment = garments.find((g) => g.id === selectedGarmentId && g.selected);

  // Totals calculations
  const selectedCount = garments.filter((g) => g.selected).length;
  const totalMinutesSaved = garments.filter((g) => g.selected).reduce((sum, g) => sum + g.saveTime, 0);

  // ============ STATE: TRI-SYNC LIVE LOG ENGINE ============
  const [logs, setLogs] = useState([
    { type: "demand", text: "Demand: New order #4912 checking in from Toronto (Financial District)", time: "09:42:00" },
    { type: "match", text: "Tri-Sync: Auto-dispatching Courier for order #4912", time: "09:42:05" },
    { type: "logistics", text: "Logistics: Courier (James L.) accepted pickup. ETA 12 mins.", time: "09:42:12" },
    { type: "processing", text: "Processing: Calgary boutique care hub checked out order #4899 (boardroom ready)", time: "09:43:01" }
  ]);

  const [activeOrders, setActiveOrders] = useState(14);
  const [couriersLive, setCouriersLive] = useState(32);
  const [workshopsLive, setWorkshopsLive] = useState(45);
  const [isFlashingOrders, setIsFlashingOrders] = useState(false);

  const cities = ["Toronto", "Montreal", "Calgary", "Winnipeg", "Washington D.C.", "New York"];
  const areas = ["Bay St.", "Plateau", "Downtown", "Capitol Hill", "Midtown"];
  const logTemplates = [
    { type: "demand", text: "Demand: New order #{id} logged from {city} ({area})" },
    { type: "match", text: "Tri-Sync: Routed Courier #{courierId} to order #{id}" },
    { type: "logistics", text: "Logistics: Courier #{courierId} locked custody of bag GG-{id}" },
    { type: "match", text: "Tri-Sync: Matched Order #{id} to Care Facility #{workshopId}" },
    { type: "processing", text: "Processing: Facility #{workshopId} checked in manifest for order #{id}" },
    { type: "processing", text: "Processing: Order #{id} - steam-press completed" },
    { type: "logistics", text: "Logistics: Courier #{courierId} dispatched for final delivery" },
    { type: "processing", text: "Processing: Order #{id} verified premium quality. ⌛ {saveTime}m saved." },
    { type: "demand", text: "Demand: Recurring family bag GG-{id} scheduled for Montreal (Plateau)" }
  ];

  const addLog = (type, text) => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => {
      const nextLogs = [...prev, { type, text, time: timeStr }];
      if (nextLogs.length > 25) {
        nextLogs.shift();
      }
      return nextLogs;
    });
  };

  const handleSimulateDemand = () => {
    const id = Math.floor(Math.random() * 8000) + 1000;
    const city = cities[Math.floor(Math.random() * cities.length)];
    addLog("demand", `✨ MANUAL INJECTION: High-priority executive demand request logged from ${city} hub. (GG-${id})`);
    
    setActiveOrders((prev) => prev + 1);
    setIsFlashingOrders(true);
    setTimeout(() => {
      setIsFlashingOrders(false);
    }, 1000);
  };

  useEffect(() => {
    const logInterval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const id = Math.floor(Math.random() * 8000) + 1000;
      const courierId = Math.floor(Math.random() * 200) + 80;
      const workshopId = Math.floor(Math.random() * 150) + 50;
      const city = cities[Math.floor(Math.random() * cities.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const saveTime = [15, 20, 25, 45, 60][Math.floor(Math.random() * 5)];

      const text = template.text
        .replace(/{id}/g, id)
        .replace(/{courierId}/g, courierId)
        .replace(/{workshopId}/g, workshopId)
        .replace(/{city}/g, city)
        .replace(/{area}/g, area)
        .replace(/{saveTime}/g, saveTime);

      addLog(template.type, text);

      // Fluctuate stats
      setActiveOrders((prev) => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
      setCouriersLive((prev) => Math.max(25, Math.min(60, prev + (Math.random() > 0.5 ? 1 : -1))));
      setWorkshopsLive((prev) => Math.max(35, Math.min(85, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);

    return () => clearInterval(logInterval);
  }, []);

  // Auto-scroll the log container to bottom
  const feedEndRef = useRef(null);
  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollTop = feedEndRef.current.scrollHeight;
    }
  }, [logs]);

  // ============ STATE: INVITATION WAITLIST ============
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistHub, setWaitlistHub] = useState("New York");
  const [waitlistInterest, setWaitlistInterest] = useState("Grid Plus");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistName.trim() || !waitlistEmail.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: waitlistName.trim(),
      email: waitlistEmail.trim(),
      hub: waitlistHub,
      tier: waitlistInterest,
    };

    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        setWaitlistSubmitted(true);
      } catch (err) {
        console.error("Submission failed:", err);
        setSubmitError("Failed to submit request. Please verify your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Simulation mode
      console.warn("GOOGLE_SCRIPT_URL is not set. Simulating form submission.");
      setTimeout(() => {
        setIsSubmitting(false);
        setWaitlistSubmitted(true);
      }, 1000);
    }
  };

  // ============ STATE: FAQ ACCORDION ============
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? -1 : idx));
  };

  // ============ STATE: FOOTER NEWSLETTER ============
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const [footerSubmitting, setFooterSubmitting] = useState(false);

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    if (!footerEmail.trim() || footerSubmitting) return;

    setFooterSubmitting(true);

    const payload = {
      name: "Newsletter Lead",
      email: footerEmail.trim(),
      hub: "General / Remote",
      tier: "General Waitlist",
    };

    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        setFooterSubmitted(true);
      } catch (err) {
        console.error("Footer submission failed:", err);
      } finally {
        setFooterSubmitting(false);
      }
    } else {
      setTimeout(() => {
        setFooterSubmitting(false);
        setFooterSubmitted(true);
      }, 800);
    }
  };

  // ============ EFFECT: REVEAL ON SCROLL ============
  useEffect(() => {
    const revealTargets = document.querySelectorAll(".reveal-init");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const viewH = window.innerHeight;
    revealTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewH) {
        el.classList.add("in");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* ============ NAV ============ */}
      <nav>
        <div className="container nav-inner">
          <a href="#" className="logo" style={{ textDecoration: "none", color: "var(--ink)" }}>
            <span className="logo-mark"></span>
            Garments Grid
          </a>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#engine">The Engine</a>
            <a href="#pricing">LaaS Subscriptions</a>
            <a href="#trust">Trust &amp; Safety</a>
            <a href="#join">Join the Grid</a>
          </div>
          <a href="#pricing" className="nav-cta">Get Started →</a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero" id="hero">
        <div className="hero-grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow-2"></div>
        <div className="container">
          <div className="hero-tag">
            <span className="dot"></span>
            Series A closing Q3 · Now serving 6 hubs
          </div>
          <h1>
            Wrinkled in the <span className="strike">boardroom</span>?<br />
            <span className="accent">The Grid</span> fixes it.
          </h1>
          <p className="hero-sub">
            Never walk into a meeting in a wrinkled shirt again. Garments Grid is the premium on-demand marketplace eliminating the <strong>10+ hours a month</strong> busy professionals waste on ironing and folding. Built for corporate and government executives, scaled for an underserved <strong>$10B headache</strong>.
          </p>

          <form className="zip-form" onSubmit={handleZipSubmit}>
            <input
              type="text"
              placeholder="Enter your zip / postal code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
            <button type="submit">
              Check availability
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>

          {zipResult && (
            <div
              style={{
                marginTop: "14px",
                fontSize: "14.5px",
                fontWeight: "600",
                color: "var(--primary)",
                lineHeight: "1.4",
              }}
            >
              {zipResult}
            </div>
          )}

          <div className="zip-cities">
            <span>Launch hubs:</span>
            <span className="city-chip active">Toronto</span>
            <span className="city-chip active">Montreal</span>
            <span className="city-chip active">Calgary</span>
            <span className="city-chip active">Winnipeg</span>
            <span className="city-chip active">Washington D.C.</span>
            <span className="city-chip active">New York</span>
          </div>

          {/* HERO VISUAL: press + momentum + testimonials */}
          <div className="hero-visual">
            {/* Launch Roadmap card */}
            <div className="hero-card hero-card-1" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)", marginBottom: "8px" }}>
                  Launch Roadmap &amp; Progress
                </div>
                <h3 className="serif" style={{ fontSize: "24px", color: "var(--ink)", marginBottom: "16px", lineHeight: "1.2", fontFamily: "var(--font-dm-serif-display)" }}>
                  Building a Frictionless Laundry Grid
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--primary)", color: "white", fontSize: "10px", display: "grid", placeItems: "center", fontWeight: "700", marginTop: "2px" }}>✓</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)" }}>Phase 1: Tri-Sync Optimization</div>
                      <div style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>Matching engine tested for dispatch telemetry &amp; live driver routing.</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--accent)", color: "white", fontSize: "10px", display: "grid", placeItems: "center", fontWeight: "700", marginTop: "2px", animation: "pulse 2s infinite" }}>•</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)" }}>Phase 2: Partner Facility Certification (Current)</div>
                      <div style={{ fontSize: "11.5px", color: "var(--ink-3)" }}>Vetting and certifying local eco-friendly boutique facilities for premium care and water-efficiency standards across Winnipeg, Toronto, Montreal, Calgary, NY, and D.C.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--bg-warm)", border: "1px solid var(--line)", color: "var(--ink-3)", fontSize: "10px", display: "grid", placeItems: "center", fontWeight: "700", marginTop: "2px" }}>3</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink-3)" }}>Phase 3: Limited Private Charter</div>
                      <div style={{ fontSize: "11.5px", color: "var(--ink-4)" }}>Early access deployment for waitlisted members in launch hubs.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "20px", borderTop: "1px solid var(--line-soft)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--ink-2)" }}>Alpha Target Launch: Q3 2026</span>
                <span className="city-chip" style={{ background: "var(--primary-soft)", color: "var(--primary)", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>Alpha 0.2</span>
              </div>
            </div>

            {/* Testimonials */}
            <div className="hero-card testi-card">
              <div className="testi-head">
                <span className="lbl">From the boardroom</span>
                <span className="stars-row">★★★★★<span className="num">4.96</span></span>
              </div>
              <div className="testi">
                <div className="quote">Boardroom Monday. My shirts arrive Saturday. I forgot laundry existed.</div>
                <div className="who">
                  <div className="avatar av-1">DK</div>
                  <div className="who-text">
                    <span className="name">David K.</span>
                    <span className="role">Managing Director · Toronto</span>
                  </div>
                </div>
              </div>
              <div className="testi">
                <div className="quote">Best $14.99 I spend each month. Period.</div>
                <div className="who">
                  <div className="avatar av-2">PM</div>
                  <div className="who-text">
                    <span className="name">Priya M.</span>
                    <span className="role">Senior Counsel · New York</span>
                  </div>
                </div>
              </div>
              <div className="testi">
                <div className="quote">I run a 40-person office. Garments Grid runs our wardrobe.</div>
                <div className="who">
                  <div className="avatar av-3">JW</div>
                  <div className="who-text">
                    <span className="name">James W.</span>
                    <span className="role">Chief of Staff · Washington DC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat bento */}
            <div className="hero-card bento-stat">
              <div className="big">4.7×</div>
              <div className="lbl"><strong>Higher order frequency</strong>for LaaS subscribers vs. one-off users across our pilot cohort.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat reveal-init">
              <div className="num">$10B<sup>+</sup></div>
              <div className="lbl"><strong>Annual North American</strong>laundry &amp; dry-clean spend ripe for disruption</div>
            </div>
            <div className="stat reveal-init">
              <div className="num">6</div>
              <div className="lbl"><strong>Launch hubs</strong>including Toronto, Montreal, Calgary, Winnipeg, D.C., and New York</div>
            </div>
            <div className="stat reveal-init">
              <div className="num">10<sup>h+</sup></div>
              <div className="lbl"><strong>Saved per month</strong>by outsourcing the tedious chore of ironing and folding</div>
            </div>
            <div className="stat reveal-init">
              <div className="num">94<sup>%</sup></div>
              <div className="lbl"><strong>Net Promoter Score</strong>across our first 1,200 power users</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ HOW IT WORKS ============ */}
      <section className="how-wrap" id="how">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">The 4-step flow</span>
              <h2 className="section-title reveal-init">From boardroom hamper to <em>crisp-pressed</em> in under 24 hours.</h2>
            </div>
            <p className="section-lede">Every step is tracked, audited, and verified by the same Tri-Sync matching engine that powers the entire logistics grid.</p>
          </div>

          <div className="steps" onMouseLeave={() => { if (!isSimulatingOrder) startAutoRotate(); }}>
            {/* Steps list */}
            <div className="step-list">
              <div
                className={`step reveal-init ${activeStep === 0 ? "active" : ""}`}
                onMouseEnter={() => handleStepSelect(0)}
                onClick={() => handleStepSelect(0)}
                data-num="1"
              >
                <h3>Visual cataloging <span className="demo-badge-inline" style={{ fontSize: "11px", color: "var(--accent)", marginLeft: "8px", fontWeight: "600", textTransform: "uppercase" }}>(Interactive Demo)</span></h3>
                <p>Snap a photo of your garments, toggle between full care or custom press &amp; fold. Our app instantly logs each item so you only pay for what you select.</p>
                <span className="meta">~ 45 seconds</span>
              </div>
              <div
                className={`step reveal-init ${activeStep === 1 ? "active" : ""}`}
                onMouseEnter={() => handleStepSelect(1)}
                onClick={() => handleStepSelect(1)}
                data-num="2"
              >
                <h3>Courier pickup</h3>
                <p>A vetted courier arrives with a secure garment bag, scans your manifest, and seals the chain of custody in-app.</p>
                <span className="meta">~ 14 min median ETA</span>
              </div>
              <div
                className={`step reveal-init ${activeStep === 2 ? "active" : ""}`}
                onMouseEnter={() => handleStepSelect(2)}
                onClick={() => handleStepSelect(2)}
                data-num="3"
              >
                <h3>Boutique Facility Care</h3>
                <p>Certified local facilities wash, press, and hand-finish your garments to professional boutique dry-clean standards.</p>
                <span className="meta">Eco-certified &amp; Insured</span>
              </div>
              <div
                className={`step reveal-init ${activeStep === 3 ? "active" : ""}`}
                onMouseEnter={() => handleStepSelect(3)}
                onClick={() => handleStepSelect(3)}
                data-num="4"
              >
                <h3>Press-to-finish delivery</h3>
                <p>Crisp, boardroom-ready garments returned right to your door on your precise schedule — locked to your calendar.</p>
                <span className="meta">Schedule-locked delivery</span>
              </div>
            </div>

            {/* Phone stage */}
            <div
              className="phone-stage"
              onMouseEnter={stopAutoRotate}
              onMouseLeave={() => {
                if (!isSimulatingOrder) startAutoRotate();
              }}
            >
              <div className="phone-notch"></div>
              <div className="phone-screen">

                {/* Step 0: Catalog (Interactive Sandbox) */}
                <div className={`phone-step ${activeStep === 0 ? "active" : ""}`} style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Camera shutter flash overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "white",
                      opacity: shutterOpacity,
                      zIndex: 100,
                      pointerEvents: "none",
                      borderRadius: "24px",
                      transition: "opacity 0.1s ease",
                    }}
                  ></div>

                  <div className="ph-eyebrow" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span>Step 01 / Catalog</span>
                    <span className="demo-badge" style={{ background: "var(--accent-soft)", color: "var(--accent)", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>Interactive Demo</span>
                    <button
                      onClick={triggerCameraFlash}
                      style={{
                        background: "var(--accent)",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontFamily: "inherit",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Snap Photo
                    </button>
                  </div>
                  <div className="ph-title" style={{ marginBottom: "10px", fontSize: "22px" }}>Digital Manifest</div>

                  <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    {garments.map((g) => {
                      const isConfigured = selectedGarmentId === g.id;
                      const serviceLabel = g.service === "full" ? "Wash" : "Press";
                      return (
                        <div
                          key={g.id}
                          className={`catalog-item ${g.selected ? "selected" : ""}`}
                          onClick={() => handleGarmentClick(g.id)}
                          style={
                            isConfigured
                              ? { borderColor: "var(--primary)", boxShadow: "0 0 0 2px var(--primary-soft)" }
                              : {}
                          }
                        >
                          <div className="garment-icon">{g.icon}</div>
                          <div className="item-name" style={{ fontSize: "11px", marginTop: "4px" }}>{g.name}</div>
                          {g.selected && (
                            <div className="service-tags">
                              <span className="service-tag">{serviceLabel}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected item config panel */}
                  {selectedConfigGarment && (
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "10px", padding: "8px", marginBottom: "8px", textAlign: "left" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--ink)" }}>
                          {selectedConfigGarment.name}
                        </span>
                        <span style={{ fontSize: "9.5px", color: "var(--accent)", fontWeight: 600 }}>
                          ~{selectedConfigGarment.saveTime}m saved
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          className={`config-service-btn ${selectedConfigGarment.service === "full" ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setGarmentService(selectedConfigGarment.id, "full");
                          }}
                          style={{
                            flex: 1,
                            border: "none",
                            fontSize: "9.5px",
                            padding: "5px",
                            borderRadius: "6px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            background: selectedConfigGarment.service === "full" ? "var(--primary)" : "var(--bg-warm)",
                            color: selectedConfigGarment.service === "full" ? "white" : "var(--ink-3)",
                          }}
                        >
                          Full Care <span style={{ display: "block", fontSize: "8px", fontWeight: 400, opacity: 0.8 }}>Wash + Press</span>
                        </button>
                        <button
                          className={`config-service-btn ${selectedConfigGarment.service === "press" ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setGarmentService(selectedConfigGarment.id, "press");
                          }}
                          style={{
                            flex: 1,
                            border: "none",
                            fontSize: "9.5px",
                            padding: "5px",
                            borderRadius: "6px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            background: selectedConfigGarment.service === "press" ? "var(--primary)" : "var(--bg-warm)",
                            color: selectedConfigGarment.service === "press" ? "white" : "var(--ink-3)",
                          }}
                        >
                          Press &amp; Fold <span style={{ display: "block", fontSize: "8px", fontWeight: 400, opacity: 0.8 }}>Iron Only</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {!selectedConfigGarment && (
                    <div style={{ background: "rgba(13, 91, 79, 0.05)", border: "1px dashed var(--primary)", borderRadius: "10px", padding: "12px", marginBottom: "8px", textAlign: "center", fontSize: "11px", color: "var(--primary-deep)", fontWeight: "500", lineHeight: 1.4 }}>
                      ✨ Click any garment card above to configure Care Plan &amp; toggle Wash / Iron services.
                    </div>
                  )}

                  <div className="ph-cta-row" style={{ marginTop: "auto", padding: "8px 12px", background: "var(--primary-soft)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ textAlign: "left" }}>
                      <div className="total" style={{ fontSize: "16px", color: "var(--primary-deep)", fontWeight: 700, fontFamily: "var(--font-dm-serif-display)", lineHeight: 1 }}>
                        {selectedCount} items selected
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 600, marginTop: "2px" }}>
                        ⌛ +{totalMinutesSaved} mins saved
                      </div>
                    </div>
                    <button
                      className="ph-button"
                      onClick={startOrderSimulation}
                      style={{ margin: 0, padding: "8px 12px", fontSize: "11.5px", borderRadius: "6px", cursor: isSimulatingOrder ? "not-allowed" : "pointer" }}
                      disabled={isSimulatingOrder}
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                {/* Step 1: Pickup */}
                <div className={`phone-step ${activeStep === 1 ? "active" : ""}`}>
                  <div className="ph-eyebrow">Step 02 / Pickup</div>
                  <div className="ph-title">Driver en route</div>
                  <div className="eta-banner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5e3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div className="big">14 min</div>
                    <div style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Live tracking on</div>
                  </div>
                  <div className="progress-line">
                    <div className="progress-fill" style={{ width: "65%" }}></div>
                  </div>
                  <div className="courier-card">
                    <div className="courier-avatar">JL</div>
                    <div className="courier-info">
                      <div className="name">James L.</div>
                      <div className="meta">Garment Handler · 4.97★ · 1,204 trips</div>
                    </div>
                    <div className="courier-rating">
                      <div className="stars">★★★★★</div>
                      <div>Vetted</div>
                    </div>
                  </div>
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "12px", padding: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                      <path d="M9 18a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6l5 5v8a2 2 0 0 1-2 2h-2" />
                    </svg>
                    <div style={{ flex: 1, fontSize: "13px", color: "var(--ink-2)" }}>
                      <strong style={{ color: "var(--ink)" }}>Protective garment bag</strong> arrives sealed &amp; tamper-evident
                    </div>
                  </div>
                  <button className="ph-button" style={{ marginTop: "auto" }}>View on map →</button>
                </div>

                {/* Step 2: Process */}
                <div className={`phone-step ${activeStep === 2 ? "active" : ""}`}>
                  <div className="ph-eyebrow">Step 03 / Process</div>
                  <div className="ph-title">At the Care Facility</div>
                  <div className="process-status">
                    <div className="proc-step done">
                      <div className="proc-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="proc-info">
                        <div className="t">Bag received</div>
                        <div className="s">9:42 AM</div>
                      </div>
                    </div>
                    <div className="proc-step done">
                      <div className="proc-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="proc-info">
                        <div className="t">Items inspected</div>
                        <div className="s">9:48 AM · 5 photos</div>
                      </div>
                    </div>
                    <div className="proc-step active">
                      <div className="proc-icon">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ animation: "spin 1.5s linear infinite" }}
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </div>
                      <div className="proc-info">
                        <div className="t">Wash cycle running</div>
                        <div className="s">Started 10:14 AM</div>
                      </div>
                    </div>
                    <div className="proc-step pending">
                      <div className="proc-icon">4</div>
                      <div className="proc-info">
                        <div className="t">Press &amp; fold</div>
                        <div className="s">ETA 12:30 PM</div>
                      </div>
                    </div>
                    <div className="proc-step pending">
                      <div className="proc-icon">5</div>
                      <div className="proc-info">
                        <div className="t">Quality check</div>
                        <div className="s">Photo proof required</div>
                      </div>
                    </div>
                  </div>
                  <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }` }} />
                </div>

                {/* Step 3: Delivery */}
                <div className={`phone-step ${activeStep === 3 ? "active" : ""}`}>
                  <div className="ph-eyebrow">Step 04 / Delivered</div>
                  <div className="ph-title">Ready, boardroom-fresh.</div>
                  <div className="deliver-card">
                    <div className="deliver-emoji">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h4>Order #GG-2841</h4>
                    <p>Delivered · 12:47 PM</p>
                    <div className="deliver-tally">
                      <div className="t">
                        <div className="v">5/5</div>
                        <div className="l">Items</div>
                      </div>
                      <div className="t">
                        <div className="v">A+</div>
                        <div className="l">Quality</div>
                      </div>
                      <div className="t">
                        <div className="v">0</div>
                        <div className="l">Claims</div>
                      </div>
                    </div>
                    <button className="ph-button" style={{ background: "var(--primary)" }}>Rate &amp; reorder</button>
                  </div>
                  <div style={{ marginTop: "12px", background: "var(--gold-soft)", borderRadius: "12px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8932a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div style={{ fontSize: "12.5px", color: "var(--gold)", fontWeight: 500 }}>Earned 180 loyalty points</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRI-SYNC ENGINE ============ */}
      <section className="engine-section" id="engine">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 80px" }}>
            <span className="section-eyebrow">The asset-light moat</span>
            <h2 className="section-title" style={{ color: "var(--bg)" }}>Three sides, one <em>Tri-Sync</em> engine.</h2>
            <p className="section-lede" style={{ marginLeft: "auto", marginRight: "auto", color: "rgba(255,255,255,0.7)" }}>Garments Grid separates pure logistics from professional processing — a marketplace architecture that scales linearly without owning a single washing machine.</p>
          </div>

          <div className="engine-grid-container">
            <div className="engine-canvas">
              <svg className="engine-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,94,58,0.6)" />
                    <stop offset="100%" stopColor="rgba(255,94,58,0)" />
                  </linearGradient>
                </defs>
                {/* connecting lines */}
                <g stroke="url(#lineGrad)" strokeWidth="1.5" fill="none">
                  <path d="M500,300 L200,150" strokeDasharray="4 4" />
                  <path d="M500,300 L800,150" strokeDasharray="4 4" />
                  <path d="M500,300 L500,500" strokeDasharray="4 4" />
                </g>
                {/* data flow pulses */}
                <circle r="4" fill="#ff5e3a">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M500,300 L200,150" />
                </circle>
                <circle r="4" fill="#ff5e3a">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M500,300 L800,150" />
                </circle>
                <circle r="4" fill="#ff5e3a">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M500,300 L500,500" />
                </circle>
                {/* subtle ring */}
                <circle cx="500" cy="300" r="160" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <circle cx="500" cy="300" r="200" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 6" />
              </svg>

              {/* Center: engine */}
              <div className="engine-center">
                <div className="name">
                  Tri-Sync<small>Matching Engine</small>
                </div>
              </div>

              {/* Top left: Customers */}
              <div className="engine-node" style={{ top: "25%", left: "20%" }}>
                <div className="engine-node-circle">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="role">Demand</div>
                <div className="name">Customers</div>
                <div className="count"><strong>32,400+</strong> active users</div>
              </div>

              {/* Top right: Couriers */}
              <div className="engine-node" style={{ top: "25%", left: "80%" }}>
                <div className="engine-node-circle">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                    <circle cx="17" cy="18" r="2" />
                    <circle cx="7" cy="18" r="2" />
                  </svg>
                </div>
                <div className="role">Logistics</div>
                <div className="name">Couriers</div>
                <div className="count"><strong>1,840</strong> vetted drivers</div>
              </div>

              {/* Bottom: Launderers */}
              <div className="engine-node" style={{ top: "75%", left: "50%" }}>
                <div className="engine-node-circle">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </div>
                <div className="role">Processing</div>
                <div className="name">Launderers</div>
                <div className="count"><strong>2,260</strong> home workshops</div>
              </div>
            </div>

            {/* Live Tri-Sync Console */}
            <div className="match-console">
              <div className="console-header">
                <div className="console-title" style={{ flexWrap: "wrap" }}>
                  <span className="console-status-dot"></span>
                  Tri-Sync Live Matcher <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", marginLeft: "4px", fontWeight: "400", textTransform: "none", letterSpacing: "normal" }}>(demonstration purpose only)</span>
                </div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>STATUS: ACTIVE</div>
              </div>

              <div className="console-stats">
                <div className="console-stat-card">
                  <div
                    className="val"
                    style={{
                      color: isFlashingOrders ? "#10b981" : "var(--accent)",
                      transition: "color 0.2s ease"
                    }}
                  >
                    {activeOrders}
                  </div>
                  <div className="lbl">Active orders</div>
                </div>
                <div className="console-stat-card">
                  <div className="val">{couriersLive}</div>
                  <div className="lbl">Couriers live</div>
                </div>
                <div className="console-stat-card">
                  <div className="val">{workshopsLive}</div>
                  <div className="lbl">Facilities Live</div>
                </div>
              </div>

              <div className="console-feed" ref={feedEndRef}>
                {logs.map((log, index) => (
                  <div className="console-log" key={index}>
                    <span className="log-time">{log.time}</span>
                    <span className={`log-tag ${log.type}`}>{log.type}</span>
                    <span className="log-text">{log.text}</span>
                  </div>
                ))}
              </div>

              <button className="console-btn" onClick={handleSimulateDemand}>
                Inject Simulated Demand
              </button>
            </div>
          </div>

          {/* Why it matters */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", marginTop: "80px" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontFamily: "var(--font-dm-serif-display)", fontSize: "32px", color: "var(--accent)", lineHeight: 1 }}>$0</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "8px", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--bg)" }}>Capex on hardware.</strong> Couriers and launderers bring their own equipment. We bring the demand.
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontFamily: "var(--font-dm-serif-display)", fontSize: "32px", color: "var(--accent)", lineHeight: 1 }}>62<sup style={{ fontSize: "0.5em" }}>%</sup></div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "8px", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--bg)" }}>Gross margin per order</strong> — multiples of legacy dry-clean, with no rent, no utilities, no inventory.
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontFamily: "var(--font-dm-serif-display)", fontSize: "32px", color: "var(--accent)", lineHeight: 1 }}>10×</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: "8px", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--bg)" }}>Faster city launch</strong> than vertical laundry competitors. New market = bring couriers, sign launderers, flip the switch.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SUBSCRIPTIONS / WAITLIST ============ */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 40px" }}>
            <span className="section-eyebrow">Laundry-as-a-Service (LaaS)</span>
            <h2 className="section-title" style={{ marginLeft: "auto", marginRight: "auto" }}>Predictable recurring revenue.</h2>
            <p className="section-lede" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "20px" }}>By converting a weekly chore into a predictable monthly utility, our subscription models unlock <strong>4.7× higher order frequency</strong>. Built to solve a $10B headache for busy homes and executives alike.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "40px", alignItems: "start", marginTop: "40px" }} className="pricing-container-grid">
            {/* Left side: Subscription models */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Card 1: Grid Plus */}
              <div className="price-card" style={{ padding: "28px", textAlign: "left" }}>
                <span className="price-badge" style={{ background: "var(--primary)", color: "white" }}>Coming Soon</span>
                <div className="price-name" style={{ color: "var(--primary)", marginBottom: "4px" }}>Grid Plus</div>
                <div className="price-headline" style={{ fontSize: "24px", marginBottom: "4px" }}>Executive Care Plan</div>
                <div className="price-amount" style={{ marginBottom: "16px" }}>
                  <span className="cur">$</span>
                  <span className="num">14.99</span>
                  <span className="per">/ mo</span>
                </div>
                <p className="price-pitch" style={{ marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", fontSize: "13.5px", lineHeight: 1.5 }}>Designed for busy corporate and government leaders in major hubs. Outsource the chore of ironing and keep your shirts boardroom-ready on autopilot.</p>
                <ul className="price-feats" style={{ fontSize: "13px", listStyle: "none" }}>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <strong>Free</strong> delivery &amp; priority courier routing
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <strong>Free 4-hour rush</strong> turnaround for last-minute boardroom meetings
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <strong>7% off</strong> all customized press, dry-clean, and wash services
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    $500 underwritten Cloth Insurance per order
                  </li>
                </ul>
              </div>

              {/* Card 2: Family Sub */}
              <div className="price-card featured" style={{ padding: "28px", textAlign: "left" }}>
                <span className="price-badge" style={{ background: "var(--accent)", color: "white" }}>Core MRR Pillar</span>
                <div className="price-name" style={{ color: "var(--accent)", marginBottom: "4px" }}>Family Subscription</div>
                <div className="price-headline" style={{ fontSize: "24px", marginBottom: "4px", color: "white" }}>Household Care Plan</div>
                <div className="price-amount" style={{ marginBottom: "16px" }}>
                  <span className="cur">$</span>
                  <span className="num">59-189</span>
                  <span className="per">/ mo flat-rate</span>
                </div>
                <p className="price-pitch" style={{ marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px", fontSize: "13.5px", lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>Our core high-margin subscription engine. A complete weekly care package for busy families with predictable limits to offload the chore completely.</p>
                <ul className="price-feats" style={{ fontSize: "13px", listStyle: "none", color: "rgba(255,255,255,0.9)" }}>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Unlimited item count per standardized weekly bag
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Up to <strong>4 weekly scheduled pickups</strong>
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Enforced household limits (up to 5 family members)
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    $1,000 underwritten Cloth Insurance included
                  </li>
                </ul>
              </div>

              {/* Card 3: Grid Scale */}
              <div className="price-card" style={{ padding: "28px", textAlign: "left" }}>
                <span className="price-badge" style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}>Flexible Tier</span>
                <div className="price-name" style={{ color: "var(--primary)", marginBottom: "4px" }}>Grid Scale</div>
                <div className="price-headline" style={{ fontSize: "24px", marginBottom: "4px" }}>Pay-by-Weight Plan</div>
                <div className="price-amount" style={{ marginBottom: "16px" }}>
                  <span className="cur">$</span>
                  <span className="num">1.99</span>
                  <span className="per">/ lb</span>
                </div>
                <p className="price-pitch" style={{ marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", fontSize: "13.5px", lineHeight: 1.5 }}>Perfect for everyday wear, activewear, sheets, and towels. Professional wash, tumble dry, and neatly folded — no pressing included.</p>
                <ul className="price-feats" style={{ fontSize: "13px", listStyle: "none" }}>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <strong>Free pickup &amp; delivery</strong> (15 lbs minimum order)
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Standard 24-hour delivery turnaround
                  </li>
                  <li style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px", marginTop: "3px", color: "var(--primary)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    $200 underwritten Cloth Insurance per order
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side: Request early access form */}
            <div className="price-card" style={{ padding: "36px 32px", border: "2px solid var(--primary)", textAlign: "left" }} id="waitlist-card">
              {!waitlistSubmitted ? (
                <>
                  <h3 className="serif" style={{ fontSize: "28px", color: "var(--ink)", marginBottom: "8px" }}>Request Invitation</h3>
                  <p style={{ fontSize: "14px", color: "var(--ink-3)", marginBottom: "24px", lineHeight: "1.4" }}>Registration is limited by local workshop capacity. Request access to lock in early charter rates.</p>

                  <form onSubmit={handleWaitlistSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-2)", marginBottom: "4px" }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="Alex Carter"
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit", fontSize: "14.5px", outline: "none", background: "var(--bg)" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-2)", marginBottom: "4px" }}>Work Email</label>
                      <input
                        type="email"
                        placeholder="alex@firm.com"
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit", fontSize: "14.5px", outline: "none", background: "var(--bg)" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-2)", marginBottom: "4px" }}>Target Launch Hub</label>
                      <select
                        value={waitlistHub}
                        onChange={(e) => setWaitlistHub(e.target.value)}
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit", fontSize: "14.5px", outline: "none", background: "var(--bg)", color: "var(--ink)", fontWeight: 500 }}
                      >
                        <option value="New York">New York</option>
                        <option value="Washington D.C.">Washington D.C.</option>
                        <option value="Toronto">Toronto</option>
                        <option value="Montreal">Montreal</option>
                        <option value="Calgary">Calgary</option>
                        <option value="Winnipeg">Winnipeg</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-2)", marginBottom: "4px" }}>Subscription Interest</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", cursor: "pointer", color: "var(--ink)" }}>
                          <input
                            type="radio"
                            name="interest"
                            value="Grid Plus"
                            checked={waitlistInterest === "Grid Plus"}
                            onChange={() => setWaitlistInterest("Grid Plus")}
                            style={{ accentColor: "var(--primary)" }}
                          />
                          Grid Plus (Executive Plan)
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", cursor: "pointer", color: "var(--ink)" }}>
                          <input
                            type="radio"
                            name="interest"
                            value="Family"
                            checked={waitlistInterest === "Family"}
                            onChange={() => setWaitlistInterest("Family")}
                            style={{ accentColor: "var(--primary)" }}
                          />
                          Family Subscription (Household)
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", cursor: "pointer", color: "var(--ink)" }}>
                          <input
                            type="radio"
                            name="interest"
                            value="Weight"
                            checked={waitlistInterest === "Weight"}
                            onChange={() => setWaitlistInterest("Weight")}
                            style={{ accentColor: "var(--primary)" }}
                          />
                          Grid Scale (Pay-by-Weight)
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="price-cta"
                      disabled={isSubmitting}
                      style={{
                        marginTop: "14px",
                        borderPreset: "none",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        borderColor: isSubmitting ? "var(--ink-3)" : "var(--primary)",
                        background: isSubmitting ? "var(--ink-3)" : "var(--primary)",
                        color: "white",
                        width: "100%",
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      {isSubmitting ? "Submitting Request..." : "Request Early Access →"}
                    </button>

                    {submitError && (
                      <p style={{ color: "var(--accent)", fontSize: "12.5px", marginTop: "10px", textAlign: "center", fontWeight: "600" }}>
                        {submitError}
                      </p>
                    )}
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 10px", animation: "fadeIn 0.4s ease" }}>
                  <h3 className="serif" style={{ fontSize: "28px", color: "var(--primary)", marginBottom: "12px" }}>Invitation Requested</h3>
                  <p style={{ color: "var(--ink-2)", fontSize: "14.5px", marginBottom: "24px", lineHeight: "1.4" }}>
                    Thank you, <strong>{waitlistName}</strong>! We&apos;ve registered your request for early charter access in <strong>{waitlistHub}</strong>.
                  </p>
                  <div style={{ background: "var(--bg-card)", padding: "18px", border: "1px solid var(--line)", borderRadius: "12px", maxWidth: "320px", margin: "0 auto", textAlign: "left", fontSize: "13.5px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>Waitlist Position: #14,842</div>
                    <div style={{ color: "var(--ink-3)", fontSize: "12px", marginBottom: "10px" }}>We&apos;ll email you the moment early access slots open up.</div>
                    <div style={{ fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-jetbrains-mono)", fontSize: "11px", letterSpacing: "0.05em" }}>
                      INVITE CODE: GG-{waitlistHub.substring(0, 3).toUpperCase()}-2026
                    </div>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "var(--ink-3)", marginTop: "24px" }}>
                    Note: Investors will see simulated network dispatch times reflect 4.7x subscriber frequencies.
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="pricing-note">Need corporate or government team pricing? <a href="#join">Talk to our enterprise team →</a></p>
        </div>
      </section>

      {/* ============ TRUST & SAFETY ============ */}
      <section className="trust" id="trust">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Trust &amp; Safety</span>
              <h2 className="section-title">We insure the wardrobe. <em>You</em> wear it.</h2>
            </div>
            <p className="section-lede">A formal bailee protection plan, strict vetting, and a 24-hour claim window that actually means something.</p>
          </div>

          <div className="trust-grid">
            <div className="trust-features">
              <div className="trust-feat reveal-init">
                <div className="trust-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h4>Formalized bailee protection</h4>
                  <p>Your clothes are legally bailed to Garments Grid the moment our courier scans them. Coverage from $200 (Starter) up to $1,000 (Family) per order — backed by a regulated insurer, not a promise.</p>
                  <span className="tag">Underwritten partner</span>
                </div>
              </div>
              <div className="trust-feat reveal-init">
                <div className="trust-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4>24-hour claim window</h4>
                  <p>Notice a problem? File in-app within 24 hours of delivery. Photo evidence is auto-attached from the care partner&apos;s quality-check log. Decisions within 48 hours, payout within 7.</p>
                  <span className="tag">No fax machines. We promise.</span>
                </div>
              </div>
              <div className="trust-feat reveal-init">
                <div className="trust-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 11h-6" />
                    <path d="m19 8 3 3-3 3" />
                  </svg>
                </div>
                <div>
                  <h4>Vetted, qualified, audited</h4>
                  <p>Every care partner passes a rigorous practical exam, background check, and on-site facility audit. Partner facilities must meet strict quality, textile care, and eco-friendly standards — we verify, not assume.</p>
                  <span className="tag">3.2% acceptance rate</span>
                </div>
              </div>
              <div className="trust-feat reveal-init">
                <div className="trust-feat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6v6H9z" />
                    <path d="M9 1v3" />
                    <path d="M15 1v3" />
                    <path d="M9 20v3" />
                    <path d="M15 20v3" />
                    <path d="M20 9h3" />
                    <path d="M20 14h3" />
                    <path d="M1 9h3" />
                    <path d="M1 14h3" />
                  </svg>
                </div>
                <div>
                  <h4>Photo proof at every step</h4>
                  <p>Every checkpoint — pickup, intake, wash, press, quality check, delivery — is photographed and time-stamped. You see the full chain of custody from the app.</p>
                  <span className="tag">Tamper-evident chain</span>
                </div>
              </div>
            </div>

            {/* Claim card */}
            <div className="trust-claim-card reveal-init">
              <span className="label">Cloth Insurance</span>
              <h3>What&apos;s covered. What isn&apos;t.</h3>
              <div className="claim-tiers">
                <div className="claim-tier">
                  <div className="amt">$200</div>
                  <div className="lbl">Starter plan</div>
                </div>
                <div className="claim-tier">
                  <div className="amt">$1,000</div>
                  <div className="lbl">Family plan</div>
                </div>
              </div>
              <div className="claim-rules">
                <div className="claim-rule">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Loss, theft, or damage while in our custody (wash, press, fold mishaps)</span>
                </div>
                <div className="claim-rule">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Misplaced items — covered up to 90 days, then invoiced at replacement cost</span>
                </div>
                <div className="claim-rule">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5e3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Items marked &quot;dry clean only&quot; processed against instructions</span>
                </div>
                <div className="claim-rule">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5e3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Normal wear and tear, pre-existing defects, undisclosed damage</span>
                </div>
                <div className="claim-rule">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5e3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Shrinkage of fabrics that recommend cold-cycle handling</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="faq">
            <h3 className="faq-title">Frequently asked, transparently answered.</h3>

            <div className={`faq-item reveal-init ${openFaq === 0 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(0)}>What happens if my clothes are damaged?</div>
              <div className="faq-a" style={{ maxHeight: openFaq === 0 ? "200px" : "0" }}>
                <div className="faq-a-inner">Open a claim in the app within 24 hours of delivery. Our system auto-pulls the care partner&apos;s photo log for that order. If the damage occurred in our custody, we repair, replace, or pay out up to your plan&apos;s coverage limit — your choice. The decision typically comes within 48 hours; payout hits your account within 7 business days.</div>
              </div>
            </div>

            <div className={`faq-item reveal-init ${openFaq === 1 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(1)}>Who has access to my home or my clothes?</div>
              <div className="faq-a" style={{ maxHeight: openFaq === 1 ? "200px" : "0" }}>
                <div className="faq-a-inner">Couriers only handle sealed, tamper-evident garment bags — they never see your wardrobe contents. Care partners process your clothes at secure, audited partner facilities, never in your home. Background checks are run on every partner; you can see their rating and trip count in-app before they arrive.</div>
              </div>
            </div>

            <div className={`faq-item reveal-init ${openFaq === 2 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(2)}>What if an item is &quot;dry clean only&quot; and I forgot to flag it?</div>
              <div className="faq-a" style={{ maxHeight: openFaq === 2 ? "200px" : "0" }}>
                <div className="faq-a-inner">Our visual catalog prompts you on every item. If you opt into wash-and-press for a &quot;dry clean only&quot; garment and we damage it, that&apos;s on us — full coverage. If you opt into wash-and-press anyway, the item isn&apos;t covered for shrinkage or dye issues. We always surface the risk before confirming.</div>
              </div>
            </div>

            <div className={`faq-item reveal-init ${openFaq === 3 ? "open" : ""}`}>
              <div className="faq-q" onClick={() => toggleFaq(3)}>Can I cancel my subscription anytime?</div>
              <div className="faq-a" style={{ maxHeight: openFaq === 3 ? "200px" : "0" }}>
                <div className="faq-a-inner">Yes. No annual lock-in. Cancel from the app; your perks stay active through the end of the billing cycle. If you&apos;re on Family Bag, we&apos;ll arrange a free pickup of the standardized bag within 5 business days.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ JOIN THE GRID ============ */}
      <section className="join" id="join">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Join the Grid</span>
              <h2 className="section-title">Earn on <em>both</em> sides of the marketplace.</h2>
            </div>
            <p className="section-lede">Whether you drive or you press, the Tri-Sync engine routes paying demand straight to you. No inventory. No franchise fees.</p>
          </div>

          <div className="join-grid">
            {/* Drive */}
            <div className="join-card driver reveal-init">
              <div className="join-eyebrow">Drive for Us · Logistics</div>
              <h3>Turn your trunk into a revenue line.</h3>
              <p className="pitch">Underutilized gig workers, weekend drivers, anyone with a valid license and an insured vehicle. Pick up bags, drop off bags, earn per trip + per-item bonuses.</p>
              <div className="earnings-banner">
                <div>
                  <div className="label">Avg. weekly earnings</div>
                  <div className="value">$640</div>
                </div>
                <div className="note">Toronto pilot · Q1 2025</div>
              </div>
              <ul className="join-reqs">
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Valid driver&apos;s license &amp; insured vehicle
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Smartphone with iOS 15+ / Android 11+
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  30-min online garment handling course
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Background check (covered by us)
                </li>
              </ul>
              <a href="#" className="join-cta">Apply to drive →</a>
            </div>

            {/* Process */}
            <div className="join-card process reveal-init">
              <div className="join-eyebrow">Process for Us · Care Partner</div>
              <h3>Your facility. Our customers. Real margin.</h3>
              <p className="pitch">Dry-cleaners, professional tailors, and independent textile care specialists with high-capacity studios. Process orders on your schedule; we handle the demand, logistics, and payments.</p>
              <div className="earnings-banner">
                <div>
                  <div className="label">Avg. profit margin</div>
                  <div className="value">62%</div>
                </div>
                <div className="note">Per order, after supplies</div>
              </div>
              <ul className="join-reqs">
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  High-capacity washing &amp; finishing equipment
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Pass our rigorous practical care exam (3.2% pass rate)
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Eco-friendly operations &amp; water-use compliance
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)", marginTop: "3px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Dedicated commercial workspace or studio
                </li>
              </ul>
              <a href="#" className="join-cta">Apply to process →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="final-cta">
        <div className="container">
          <h2>Stop folding. <em>Start scaling.</em></h2>
          <p>Whether you&apos;re a customer who&apos;s done with laundry or an investor looking at a $10B category — your move.</p>
          {footerSubmitted ? (
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "18px 24px", textAlign: "center", color: "var(--bg)", animation: "fadeIn 0.4s ease", maxWidth: "480px", margin: "0 auto" }}>
              <h4 className="serif" style={{ fontSize: "20px", color: "var(--primary-light, #c2f5e9)", marginBottom: "6px" }}>Invitation Requested</h4>
              <p style={{ fontSize: "13.5px", margin: 0, opacity: 0.8 }}>We&apos;ve added <strong>{footerEmail}</strong> to the general queue. We&apos;ll reach out as slots become available.</p>
            </div>
          ) : (
            <form className="final-cta-form" onSubmit={handleFooterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                disabled={footerSubmitting}
                required
              />
              <button type="submit" disabled={footerSubmitting} style={{ opacity: footerSubmitting ? 0.7 : 1 }}>
                {footerSubmitting ? "Submitting..." : "Get early access"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <a href="#" className="logo" style={{ textDecoration: "none", color: "var(--bg)" }}>
                <span className="logo-mark"></span>
                Garments Grid
              </a>
              <p>The on-demand, asset-light marketplace bringing professional washing, pressing, and folding to your door.</p>
            </div>
            <div className="footer-col">
              <h5>Product</h5>
              <ul>
                <li><a href="#how">How it works</a></li>
                <li><a href="#pricing">LaaS Subscriptions</a></li>
                <li><a href="#trust">Trust &amp; Safety</a></li>
                <li><a href="#">For Business</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Investors</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Get involved</h5>
              <ul>
                <li><a href="#join">Drive for us</a></li>
                <li><a href="#join">Process for us</a></li>
                <li><a href="#">Help center</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 Garments Grid Inc. All rights reserved.</div>
            <div className="markets">
              <span>Toronto</span><span>·</span><span>Montreal</span><span>·</span><span>Calgary</span><span>·</span><span>Winnipeg</span><span>·</span><span>Washington D.C.</span><span>·</span><span>New York</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
