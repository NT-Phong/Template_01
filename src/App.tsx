import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

const GRASS_GREEN = '#213138';
const FULL_TEXT = 'Velar.';
const HOUSE_IMG = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780471903/building_bzziky.png';
const BG_IMG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260603_073200_7082add5-f1f8-4873-8696-d6f78a44089b.png&w=1920&q=85';

const GALLERY_VIDEOS = [
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154759_4cdc8175-8261-497c-b688-9477c76545d4.mp4',
    title: 'The Bel-Air Promontory',
    tag: '01 / Los Angeles',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154751_39b1b9bb-2708-4211-b6a2-d39f93309e52.mp4',
    title: 'Villa Seraphine',
    tag: '02 / Lake Como',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154737_eba7900c-0313-483c-a30a-632c747ccc42.mp4',
    title: 'Kyoto Pavilion',
    tag: '03 / Kyoto',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_144009_4348fe33-f885-4345-8e92-3fe1c2625d32.mp4',
    title: 'Engadin Alpine Sanctuary',
    tag: '04 / St. Moritz',
  },
  {
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_145337_e44eaa8c-6bb1-4a6e-a70f-ed0231cbaccb.mp4',
    title: 'Amalfi Cliffside Keep',
    tag: '05 / Positano',
  },
];

interface CountUpProps {
  end: number;
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const duration = 2000;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Easing: 1 - (1 - t)^3
              const eased = 1 - Math.pow(1 - progress, 3);
              setVal(Math.round(eased * end));

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
};

export default function App() {
  // Preloader typewriter & animation state
  const [typedCount, setTypedCount] = useState<number>(0);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [lifting, setLifting] = useState<boolean>(false);
  const [heroTextVisible, setHeroTextVisible] = useState<boolean>(false);
  const [liftDone, setLiftDone] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>('/building.png');

  // Navigation state
  const [navOnDark, setNavOnDark] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Section references for scroll calculation and dark detection
  const heroRef = useRef<HTMLElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const houseWrapperRef = useRef<HTMLDivElement>(null);
  const houseInnerRef = useRef<HTMLDivElement>(null);
  const houseImgRef = useRef<HTMLImageElement>(null);

  // Preloader sequence
  useEffect(() => {
    const CHAR_INTERVAL = 140;
    const TYPE_START = 600;
    const LIFT_AT = TYPE_START + 6 * CHAR_INTERVAL + 700; // 2140ms

    // Typewriter effect: reveal letters one at a time
    for (let i = 0; i < FULL_TEXT.length; i++) {
      setTimeout(() => {
        setTypedCount(i + 1);
      }, TYPE_START + i * CHAR_INTERVAL);
    }

    // Hide cursor 150ms before lift
    const hideCursorTimer = setTimeout(() => {
      setShowCursor(false);
    }, LIFT_AT - 150);

    // Lift overlay
    const liftTimer = setTimeout(() => {
      setLifting(true);
    }, LIFT_AT);

    // Fade in hero text
    const heroTextTimer = setTimeout(() => {
      setHeroTextVisible(true);
    }, LIFT_AT + 1300);

    // Lift complete
    const liftDoneTimer = setTimeout(() => {
      setLiftDone(true);
    }, LIFT_AT + 2100);

    return () => {
      clearTimeout(hideCursorTimer);
      clearTimeout(liftTimer);
      clearTimeout(heroTextTimer);
      clearTimeout(liftDoneTimer);
    };
  }, []);

  // House scroll-driven positioning calculation
  const updateHousePosition = useCallback(() => {
    if (!liftDone) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseW = Math.max(vw, 1400);

    if (
      !heroRef.current ||
      !section5Ref.current ||
      !houseImgRef.current ||
      !houseWrapperRef.current
    ) {
      return;
    }

    const heroRect = heroRef.current.getBoundingClientRect();
    const darkRect = section5Ref.current.getBoundingClientRect();
    const heroH = heroRect.height || vh;
    const imgH = houseImgRef.current.getBoundingClientRect().height || baseW * 0.45;

    const triggerPoint = -(heroH * 0.3);
    const endPoint = heroRect.top - (darkRect.bottom - vh);

    const progress =
      endPoint !== triggerPoint
        ? Math.max(0, Math.min(1, (heroRect.top - triggerPoint) / (endPoint - triggerPoint)))
        : 0;

    const smoothstep = (x: number) => {
      const c = Math.max(0, Math.min(1, x));
      return c * c * (3 - 2 * c);
    };
    const t = smoothstep(smoothstep(progress));

    const startX = (vw - baseW) / 2;
    const startY = vh - imgH;

    const finalScale = 1.45;
    const finalX = (vw - baseW * finalScale) / 2;
    const mobileOffset = vw < 1024 ? -250 : 4;
    const finalY = darkRect.bottom - imgH * finalScale + 500 + mobileOffset;

    const currentX = startX + (finalX - startX) * t;
    const currentY = startY + (finalY - startY) * t;
    const currentScale = 1 + (finalScale - 1) * t;

    if (progress <= 0) {
      houseWrapperRef.current.style.top = 'auto';
      houseWrapperRef.current.style.bottom = '0';
      houseWrapperRef.current.style.left = '50%';
      houseWrapperRef.current.style.transform = 'translateX(-50%)';
      houseWrapperRef.current.style.transformOrigin = 'center bottom';
    } else {
      houseWrapperRef.current.style.bottom = 'auto';
      houseWrapperRef.current.style.top = '0';
      houseWrapperRef.current.style.left = '0';
      houseWrapperRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
      houseWrapperRef.current.style.transformOrigin = 'top left';
    }
  }, [liftDone]);

  // Track nav color when over dark sections
  const updateNavColor = useCallback(() => {
    const darkSections = [section5Ref.current, section6Ref.current];
    const isDark = darkSections.some((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > 0;
    });
    setNavOnDark(isDark);
  }, []);

  // Scroll and resize listener
  useEffect(() => {
    let ticking = false;
    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHousePosition();
          updateNavColor();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Initial check
    handleScrollOrResize();

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [updateHousePosition, updateNavColor]);

  // Whenever liftDone changes, re-run house positioning
  useEffect(() => {
    if (liftDone) {
      updateHousePosition();
      updateNavColor();
    }
  }, [liftDone, updateHousePosition, updateNavColor]);

  const navColor = navOnDark ? '#ffffff' : GRASS_GREEN;

  return (
    <div className="relative min-h-screen bg-[#f5f0ea] text-[#213138] overflow-x-clip font-inter selection:bg-[#213138] selection:text-white">
      {/* Inline Styles & Responsive Type Rules */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@400;700;800;900&display=swap');

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .preloader-cursor {
          display: inline-block;
          width: 3px;
          height: 1.1em;
          background-color: #ffffff;
          border-radius: 1px;
          vertical-align: -0.15em;
          margin-left: 2px;
          animation: blink 0.7s step-end infinite;
        }

        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-track {
          display: flex;
          white-space: nowrap;
          animation: tickerScroll 40s linear infinite;
          will-change: transform;
        }

        /* Hero Responsive Type Sizes */
        @media (max-width: 639px) {
          .hero-subtitle-desktop { display: none !important; }
          .hero-subtitle-mobile  { display: block !important; }
          .hero-text-block { padding-top: 90px !important; }
          .hero-heading-top { justify-content: flex-start !important; }
          .hero-own-the { font-size: 7.5vw !important; }
          .hero-extraordinary { font-size: 14.5vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-subtitle-desktop { display: none !important; }
          .hero-subtitle-mobile  { display: block !important; }
          .hero-text-block { padding-top: 110px !important; }
          .hero-heading-top { justify-content: flex-start !important; }
          .hero-own-the { font-size: 5.5vw !important; }
          .hero-extraordinary { font-size: 11vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
        }
        @media (min-width: 1024px) {
          .hero-subtitle-desktop { display: block !important; }
          .hero-subtitle-mobile  { display: none !important; }
          .hero-text-block { padding-top: calc(28vh - 50px) !important; }
          .hero-own-the { font-size: 3vw !important; }
          .hero-extraordinary { font-size: clamp(52px, 6.5vw, 9vw) !important; white-space: nowrap !important; line-height: 0.88 !important; }
        }

        /* Section 5 Tablet & Mobile Rules */
        @media (max-width: 767px) {
          .s2-statement-wrap, .s2-stats-row {
            padding-left: 0 !important;
          }
          .s2-statement {
            white-space: normal !important;
          }
          .s2-stats-row {
            flex-direction: column !important;
            gap: 28px !important;
          }
          .s2-stats-item {
            border-left: none !important;
            padding-left: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .s2-statement-wrap, .s2-stats-row {
            padding-left: 15% !important;
          }
          .s2-section {
            min-height: 70vh !important;
          }
        }

        /* Gallery Desktop & Mobile Rules */
        @media (min-width: 1024px) {
          .s3-gallery-section {
            position: relative;
            z-index: 25;
            margin-top: -100vh;
            background: #1a1a1a;
            height: 100vh;
            overflow: hidden;
          }
          .s3-gallery-content {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: clamp(24px, 4vw, 60px);
          }
          .gallery-expand-row {
            display: flex;
            gap: 6px;
            height: 70%;
            width: 100%;
            max-width: 1200px;
          }
          .gallery-expand-item {
            flex: 1 1 0%;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: flex 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .gallery-expand-row:hover .gallery-expand-item {
            flex: 1 1 0%;
          }
          .gallery-expand-row .gallery-expand-item:hover {
            flex: 4 1 0%;
          }
        }

        @media (max-width: 1023px) {
          .s3-gallery-section {
            height: auto;
            min-height: 100vh;
            overflow: visible;
            margin-top: 0 !important;
          }
          .s3-ticker-wrap {
            position: sticky;
            top: 0;
            height: 100vh;
            width: 100%;
            margin-bottom: -100vh;
          }
          .s3-gallery-content {
            height: auto;
            align-items: flex-start;
            padding: 80px 16px 60px;
          }
          .gallery-expand-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            height: auto;
            width: 100%;
            max-width: 700px;
          }
          .gallery-expand-item {
            flex: none;
            height: auto;
            aspect-ratio: 4/5;
            border-radius: 10px;
            transition: transform 0.3s ease;
          }
          .gallery-expand-item:hover {
            flex: none;
            transform: scale(1.02);
          }
          .gallery-expand-item:last-child:nth-child(odd) {
            grid-column: 1 / -1;
            max-width: calc(50% - 4px);
            justify-self: center;
          }
        }

        @media (max-width: 479px) {
          .s3-gallery-content {
            padding: 60px 12px 48px;
          }
          .gallery-expand-row {
            gap: 6px;
          }
        }
      `}</style>

      {/* Section 1 — Preloader / Intro Overlay */}
      <div
        id="preloader-overlay"
        aria-hidden={liftDone}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#213138]"
        style={{
          transform: lifting ? 'translateY(-100%)' : 'translateY(0)',
          transition: liftDone ? 'none' : 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)',
          pointerEvents: liftDone ? 'none' : 'auto',
          visibility: liftDone ? 'hidden' : 'visible',
        }}
      >
        <div
          className="font-syne text-white tracking-[-0.02em] select-none"
          style={{ fontSize: '2.6rem' }}
        >
          {FULL_TEXT.slice(0, typedCount)
            .split('')
            .map((char, i) => (
              <span key={i} style={{ fontWeight: char === '.' ? 900 : 700 }}>
                {char}
              </span>
            ))}
          {showCursor && <span className="preloader-cursor" />}
        </div>
      </div>

      {/* Section 2 — Fixed Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 py-5 md:py-6 pointer-events-auto"
        role="navigation"
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <a
          href="#"
          className="font-syne text-xl tracking-[-0.02em] transition-colors duration-350 select-none"
          style={{ color: menuOpen ? '#213138' : navColor, transition: 'color 0.35s ease' }}
        >
          <span className="font-bold">Velar</span>
          <span className="font-black">.</span>
        </a>

        {/* Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="group relative flex flex-col justify-center items-end w-7 h-6 cursor-pointer focus:outline-none z-50"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          style={{ color: menuOpen ? '#213138' : navColor, transition: 'color 0.35s ease' }}
        >
          {menuOpen ? (
            <X size={24} color="#213138" />
          ) : (
            <div className="flex flex-col items-end gap-[7px]">
              <span
                className="block h-[1px] w-7 transition-all duration-200 group-hover:w-5"
                style={{
                  backgroundColor: navColor,
                  transition: 'width 0.2s ease, background-color 0.35s ease',
                }}
              />
              <span
                className="block h-[1px] w-7"
                style={{
                  backgroundColor: navColor,
                  transition: 'background-color 0.35s ease',
                }}
              />
            </div>
          )}
        </button>
      </nav>

      {/* Mobile / Full-Screen Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#f5f0ea] flex flex-col items-center justify-center space-y-8 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {['Residences', 'Story', 'Listings', 'Inquire'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                if (item === 'Listings' && section6Ref.current) {
                  section6Ref.current.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'Story' && section5Ref.current) {
                  section5Ref.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="font-syne text-4xl font-light tracking-widest uppercase text-black hover:text-gray-500 transition-colors duration-200 cursor-pointer"
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* Section 3 — Hero */}
      <section
        ref={heroRef}
        id="hero-section"
        className="relative min-h-screen overflow-visible"
        style={{
          backgroundImage: `url('${BG_IMG}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className="hero-text-block relative z-10"
          style={{
            opacity: heroTextVisible ? 1 : 0,
            transform: heroTextVisible ? 'translateY(0)' : 'translateY(-28px)',
            transition:
              'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
          }}
        >
          {/* Top Row: Left 'LIVE IN', Right subtitle desktop */}
          <div
            className="hero-heading-top flex items-end justify-between px-6 md:px-10 lg:px-16"
            style={{ marginBottom: '-0.04em' }}
          >
            <h1 className="hero-own-the font-syne font-extrabold text-black uppercase leading-none tracking-[-0.03em]">
              LIVE IN
            </h1>
            <p
              className="hero-subtitle-desktop font-syne font-bold text-right text-black opacity-70 leading-[1.6] tracking-[0.02em]"
              style={{
                maxWidth: '300px',
                marginBottom: '0.2em',
                fontSize: 'clamp(10px, 0.95vw, 14px)',
              }}
            >
              Stately homes built with vision,
              <br />
              scope, and architectural finesse.
            </p>
          </div>

          {/* Headline Row: IRREPLACEABLE */}
          <div className="overflow-hidden px-6 md:px-10 lg:px-16">
            <div className="hero-extraordinary font-syne font-extrabold text-black uppercase tracking-[-0.03em]">
              IRREPLACEABLE
            </div>
          </div>

          {/* Mobile / Tablet Subtitle */}
          <p
            className="hero-subtitle-mobile font-syne font-semibold text-black opacity-[0.65] px-6"
            style={{
              marginTop: '0.9em',
              fontSize: 'clamp(12px, 3vw, 15px)',
            }}
          >
            Premium real estate with vision,
            <br />
            depth, and architectural clarity.
          </p>
        </div>
      </section>

      {/* Section 4 — Scroll-Driven House Animation (The Centerpiece) */}
      <div
        ref={houseWrapperRef}
        id="scroll-house-wrapper"
        className="fixed z-[22] pointer-events-none will-change-transform"
        style={{
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          minWidth: '1400px',
        }}
      >
        <div
          ref={houseInnerRef}
          style={{
            transform: !lifting ? 'translateY(102vh)' : 'translateY(0)',
            transition:
              !liftDone && lifting
                ? 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1) 0.4s'
                : 'none',
          }}
        >
          <img
            ref={houseImgRef}
            src={imgSrc}
            onError={() => {
              if (imgSrc !== '/building.png') {
                setImgSrc('/building.png');
              }
            }}
            alt=""
            width="100%"
            aria-hidden="true"
            className="w-full h-auto block select-none pointer-events-none"
            onLoad={() => {
              if (liftDone) updateHousePosition();
            }}
          />
        </div>
      </div>

      {/* Section 5 — Dark Statement + Stats (Sticky) */}
      <div
        ref={section5Ref}
        id="statement-section"
        className="relative z-20"
        style={{ height: '200vh' }}
      >
        {/* Tiny 4vh scroll spacer */}
        <div style={{ height: '4vh', backgroundColor: '#1a1a1a' }} />

        {/* Sticky 100vh inner section */}
        <div
          className="s2-section sticky top-0 h-screen bg-[#1a1a1a] overflow-hidden flex flex-col justify-center"
        >
          <div
            className="s2-content w-full flex flex-col justify-center px-6 md:px-10 lg:px-16"
            style={{
              paddingTop: 'clamp(30px, 4vw, 60px)',
              paddingBottom: 'clamp(60px, 8vw, 120px)',
            }}
          >
            {/* Statement text */}
            <div
              className="s2-statement-wrap w-full mx-auto"
              style={{
                maxWidth: '1200px',
                paddingLeft: '25%',
              }}
            >
              <h2
                className="s2-statement font-inter font-light text-[#e8e4df] tracking-[-0.02em] leading-[1.35] whitespace-nowrap"
                style={{ fontSize: 'clamp(22px, 2.6vw, 42px)' }}
              >
                Every estate we present is hand-chosen
                <br />
                through a frame of permanence, refinement,
                <br />
                and timeless detail. Standards are not
                <br />
                a flourish. It is our discipline.
              </h2>
            </div>

            {/* Stats row */}
            <div
              className="s2-stats-row flex items-stretch w-full mx-auto"
              style={{
                maxWidth: '1200px',
                paddingLeft: '25%',
                marginTop: 'clamp(48px, 6vw, 80px)',
              }}
            >
              {/* Stat 1 */}
              <div className="s2-stats-item flex-1">
                <div
                  className="font-inter font-light text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(36px, 4.5vw, 72px)' }}
                >
                  <CountUp end={120} suffix="+" />
                </div>
                <div
                  className="font-inter font-normal text-white/60 tracking-[0.01em]"
                  style={{
                    fontSize: 'clamp(12px, 1.1vw, 16px)',
                    marginTop: 'clamp(4px, 0.5vw, 8px)',
                  }}
                >
                  Portfolio Holdings
                </div>
              </div>

              {/* Stat 2 */}
              <div
                className="s2-stats-item flex-1 border-l border-white/20"
                style={{ paddingLeft: 'clamp(20px, 2.5vw, 40px)' }}
              >
                <div
                  className="font-inter font-light text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(36px, 4.5vw, 72px)' }}
                >
                  <CountUp end={12} suffix="" />
                </div>
                <div
                  className="font-inter font-normal text-white/60 tracking-[0.01em]"
                  style={{
                    fontSize: 'clamp(12px, 1.1vw, 16px)',
                    marginTop: 'clamp(4px, 0.5vw, 8px)',
                  }}
                >
                  Global Locations
                </div>
              </div>

              {/* Stat 3 */}
              <div
                className="s2-stats-item flex-1 border-l border-white/20"
                style={{ paddingLeft: 'clamp(20px, 2.5vw, 40px)' }}
              >
                <div
                  className="font-inter font-light text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(36px, 4.5vw, 72px)' }}
                >
                  <CountUp end={98} suffix="%" />
                </div>
                <div
                  className="font-inter font-normal text-white/60 tracking-[0.01em]"
                  style={{
                    fontSize: 'clamp(12px, 1.1vw, 16px)',
                    marginTop: 'clamp(4px, 0.5vw, 8px)',
                  }}
                >
                  Patron Loyalty Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6 — Hover-Expand Gallery (Slides Over Section 5) */}
      <section
        ref={section6Ref}
        id="gallery-section"
        className="s3-gallery-section"
      >
        {/* Background Ticker */}
        <div className="s3-ticker-wrap absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
          <div className="ticker-track">
            {[0, 1].map((copyIndex) => (
              <span
                key={copyIndex}
                className="font-syne font-extrabold text-white tracking-[-0.02em] select-none uppercase inline-block whitespace-nowrap"
                style={{
                  fontSize: 'clamp(100px, 14vw, 220px)',
                  paddingRight: '0.3em',
                }}
              >
                Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Gallery Content */}
        <div className="s3-gallery-content relative z-10 w-full">
          <div className="gallery-expand-row mx-auto">
            {GALLERY_VIDEOS.map((item, idx) => (
              <div
                key={idx}
                className="gallery-expand-item group relative shadow-2xl"
              >
                <video
                  src={item.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export { HOUSE_IMG, BG_IMG, GRASS_GREEN, FULL_TEXT };
