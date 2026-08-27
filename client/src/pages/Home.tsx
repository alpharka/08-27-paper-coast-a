// Paper Coast style reminder: compose this page like an editorial travel journal—quiet luxury, asymmetry, paper texture, and warm personal copy.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Copy,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Music2,
  Navigation,
  Send,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import {
  createCalendarUrl,
  formatCountdown,
  galleryItems,
  getGuestName,
  getStoredGuestbook,
  saveGuestbook,
  weddingConfig,
  type GuestbookEntry,
} from "@/lib/weddingConfig";
import { Reveal, SectionHeading, SocialRule, Stamp, WaveEmblem } from "@/components/WeddingPrimitives";

const navItems = [
  { label: "Cerita", href: "#cerita" },
  { label: "Detail acara", href: "#acara" },
  { label: "Galeri", href: "#galeri" },
  { label: "RSVP", href: "#rsvp" },
  { label: "Tanda kasih", href: "#tanda-kasih" },
];

const mobileNavItems = [
  { label: "Awal", href: "#awal", icon: Navigation },
  { label: "Cerita", href: "#cerita", icon: Heart },
  { label: "Acara", href: "#acara", icon: CalendarDays },
  { label: "Galeri", href: "#galeri", icon: ImageIcon },
  { label: "RSVP", href: "#rsvp", icon: Mail },
];

function scrollToId(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);
  return formatCountdown(target, now);
}

function useAmbientMusic() {
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    contextRef.current?.close().catch(() => undefined);
    contextRef.current = null;
    setIsPlaying(false);
  };

  const play = () => {
    if (contextRef.current) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    contextRef.current = context;
    const progression = [
      [261.63, 329.63, 392.0],
      [293.66, 349.23, 440.0],
      [220.0, 277.18, 329.63],
      [246.94, 311.13, 369.99],
    ];
    let chordIndex = 0;
    const playChord = () => {
      const chord = progression[chordIndex % progression.length];
      chord.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 1 ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 4.6);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 4.8);
      });
      chordIndex += 1;
      timerRef.current = window.setTimeout(playChord, 4_000);
    };
    context.resume().then(() => {
      setIsPlaying(true);
      playChord();
    }).catch(() => stop());
  };

  useEffect(() => () => stop(), []);
  return { isPlaying, play, stop };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const input = document.createElement("textarea");
        input.value = value;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button className="copy-button" type="button" onClick={handleCopy} aria-label={`${label}: ${value}`}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? "Tersalin" : label}</span>
    </button>
  );
}

function EventBlock({ kind, time, venue, address }: { kind: string; time: string; venue: string; address: string }) {
  return (
    <article className="event-block reveal">
      <div className="event-block__number">0{kind === "Akad" ? 1 : 2}</div>
      <div className="event-block__content">
        <p className="event-block__kind">{kind}</p>
        <h3>{venue}</h3>
        <p className="event-block__time">{time}</p>
        <div className="event-block__address"><MapPin size={15} /> <span>{address}</span></div>
      </div>
    </article>
  );
}

export default function Home() {
  const guestName = useMemo(getGuestName, []);
  const [coverOpen, setCoverOpen] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(getStoredGuestbook);
  const [rsvpStatus, setRsvpStatus] = useState("Saya akan hadir");
  const [rsvpName, setRsvpName] = useState(guestName === "Tamu undangan" ? "" : guestName);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSent, setRsvpSent] = useState(false);
  const [activeNav, setActiveNav] = useState("#awal");
  const countdown = useCountdown(weddingConfig.event.date);
  const music = useAmbientMusic();

  useEffect(() => {
    if (!coverOpen) {
      document.body.classList.add("cover-locked");
      return () => document.body.classList.remove("cover-locked");
    }
    const timeout = window.setTimeout(() => setContentReady(true), 760);
    return () => window.clearTimeout(timeout);
  }, [coverOpen]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.classList.add("lightbox-locked");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((current) => current === null ? 0 : (current + 1) % galleryItems.length);
      if (event.key === "ArrowLeft") setLightboxIndex((current) => current === null ? 0 : (current - 1 + galleryItems.length) % galleryItems.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("lightbox-locked");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  useEffect(() => {
    const sections = ["awal", "cerita", "acara", "galeri", "rsvp", "tanda-kasih"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveNav(`#${visible.target.id}`);
    }, { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [contentReady]);

  const openInvitation = () => {
    setCoverOpen(true);
    window.setTimeout(() => music.play(), 180);
  };

  const submitRsvp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rsvpName.trim() || rsvpMessage.trim().length < 4) {
      setRsvpError("Mohon isi nama dan pesan singkat sebelum mengirim.");
      setRsvpSent(false);
      return;
    }
    const nextEntry: GuestbookEntry = {
      id: `${Date.now()}`,
      name: rsvpName.trim().slice(0, 72),
      attendance: rsvpStatus,
      message: rsvpMessage.trim().slice(0, 280),
      createdAt: new Date().toISOString(),
    };
    const nextGuestbook = [nextEntry, ...guestbook];
    setGuestbook(nextGuestbook);
    saveGuestbook(nextGuestbook);
    setRsvpError("");
    setRsvpSent(true);
    setRsvpMessage("");
  };

  return (
    <div className={`site-shell ${contentReady ? "site-shell--ready" : ""}`}>
      <div className={`cover ${coverOpen ? "cover--open" : ""}`} aria-hidden={coverOpen}>
        <div className="cover__image" />
        <div className="cover__grain" />
        <div className="cover__content">
          <div className="cover__topline"><span>sebuah undangan</span><span>{weddingConfig.event.shortDate}</span></div>
          <div className="cover__center">
            <WaveEmblem className="cover__emblem" />
            <p className="cover__kicker">The wedding of</p>
            <h1><span>{weddingConfig.couple.firstName}</span><em>&</em><span>{weddingConfig.couple.secondName}</span></h1>
            <div className="cover__rule"><span /><small>{weddingConfig.event.dateLabel}</small><span /></div>
          </div>
          <div className="cover__bottom">
            <p>Untuk</p>
            <strong>{guestName}</strong>
            <button className="cover__button" type="button" onClick={openInvitation}>
              <span>Buka undangan</span><ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <header className="site-header" aria-label="Navigasi utama">
        <a className="brand-lockup" href="#awal" onClick={(event) => { event.preventDefault(); scrollToId("#awal"); }}>
          <WaveEmblem className="brand-lockup__emblem" />
          <span><strong>N <i>&</i> R</strong><small>21 · 11 · 26</small></span>
        </a>
        <nav className="desktop-nav">
          {navItems.map((item) => <a key={item.href} className={activeNav === item.href ? "is-active" : ""} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-date"><span>Jakarta</span><strong>21.11.2026</strong></div>
      </header>

      <main>
        <section id="awal" className="hero-section">
          <div className="hero-section__blueprint" aria-hidden="true"><span>06°14'32.8\"S</span><span>106°48'10.2\"E</span></div>
          <div className="hero-section__portrait-wrap reveal">
            <div className="hero-section__portrait" />
            <span className="photo-label">N + R / 2026</span>
          </div>
          <div className="hero-section__copy reveal">
            <Stamp>save the date</Stamp>
            <p className="eyebrow"><span className="eyebrow-dot" />Jakarta · Indonesia</p>
            <h1><span>Two roads.</span><span>One <i>home.</i></span></h1>
            <p className="hero-section__description">Kami menemukan bahwa rumah bukan selalu sebuah tempat. Kadang ia adalah seseorang yang membuat setiap perjalanan terasa layak ditempuh.</p>
            <button className="text-link" type="button" onClick={() => scrollToId("#cerita")}><span>Ikuti ceritanya</span><ArrowDown size={16} /></button>
          </div>
          <div className="hero-section__side-note">A note from<br />Nadia & Raka</div>
        </section>

        <section id="cerita" className="story-section section-paper">
          <div className="section-index">01 <span>—</span> our story</div>
          <div className="story-section__inner">
            <SectionHeading eyebrow="Catatan perjalanan" title={<>Dari satu <i>kebetulan</i><br />menjadi rumah.</>} description="Kami tidak merencanakan pertemuan pertama itu. Tetapi sejak hari itu, kami terus memilih untuk berjalan ke arah yang sama." />
            <div className="story-section__body">
              <Reveal className="story-section__note"><span className="quote-mark">“</span><p>Di antara jalan pulang, kopi sore, dan pesan-pesan yang tak pernah benar-benar selesai, kami belajar bahwa cinta tumbuh dari hal-hal sederhana yang terus dipilih.</p><small>— Nadia, tentang Raka</small></Reveal>
              <Reveal className="story-section__image-wrap"><div className="story-section__image" /><span className="image-caption">01 / a quiet beginning</span></Reveal>
            </div>
            <div className="story-section__footer"><SocialRule /><p>Semoga hari ini menjadi halaman yang ingin kita baca ulang.</p></div>
          </div>
        </section>

        <section id="acara" className="event-section">
          <div className="event-section__mapline" aria-hidden="true"><svg viewBox="0 0 400 400"><path d="M0 314C64 272 84 320 140 276C196 232 224 260 280 206C334 154 358 182 400 124" /><path d="M0 352C64 310 84 358 140 314C196 270 224 298 280 244C334 192 358 220 400 162" /></svg></div>
          <div className="event-section__intro">
            <div className="section-index">02 <span>—</span> mark the day</div>
            <SectionHeading eyebrow="Hari yang kami nantikan" title={<>Mari bertemu<br /><i>di sana.</i></>} description="Kami akan senang sekali bila Anda hadir, mengisi sore dengan doa baik, dan ikut merayakan langkah baru kami." />
            <a className="outline-link" href={weddingConfig.event.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Lihat lokasi di peta <ExternalLink size={14} /></a>
          </div>
          <div className="event-section__details">
            <div className="event-date-card reveal"><span className="event-date-card__month">NOVEMBER</span><strong>21</strong><span className="event-date-card__weekday">SABTU · 2026</span></div>
            <div className="event-timeline"><EventBlock {...weddingConfig.event.ceremony} /><div className="event-timeline__line" /><EventBlock {...weddingConfig.event.reception} /></div>
            <a className="calendar-link" href={createCalendarUrl()} target="_blank" rel="noreferrer"><CalendarDays size={17} /> Simpan tanggal ke Google Calendar <ArrowUpRight size={16} /></a>
          </div>
          <div className="countdown-block reveal">
            <div className="eyebrow"><span className="eyebrow-dot" />Counting the days</div>
            <div className="countdown-grid">
              {[{ label: "hari", value: countdown.days }, { label: "jam", value: countdown.hours }, { label: "menit", value: countdown.minutes }, { label: "detik", value: countdown.seconds }].map((item) => <div key={item.label}><strong>{String(item.value).padStart(2, "0")}</strong><span>{item.label}</span></div>)}
            </div>
          </div>
        </section>

        <section id="galeri" className="gallery-section section-paper">
          <div className="section-index">03 <span>—</span> in frames</div>
          <div className="gallery-section__header">
            <SectionHeading eyebrow="Potongan hari-hari kami" title={<>The places<br /><i>we keep.</i></>} description="Beberapa momen kecil yang kami simpan sepanjang perjalanan. Klik untuk melihat lebih dekat." />
            <div className="gallery-count"><span>06</span><small>frames<br />of us</small></div>
          </div>
          <div className="masonry-grid">
            {galleryItems.map((item, index) => <button key={item.src} data-caption={item.caption} className={`gallery-item gallery-item--${item.ratio} reveal`} type="button" onClick={() => setLightboxIndex(index)} aria-label={`Lihat foto ${item.caption}`}>
              <img src={item.src} alt={item.alt} loading="eager" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement?.classList.add("gallery-item--paper"); }} />
              <span className="gallery-item__veil"><span>{item.caption}</span><span className="gallery-item__zoom">+</span></span>
            </button>)}
          </div>
        </section>

        <section id="rsvp" className="rsvp-section">
          <div className="rsvp-section__coordinate" aria-hidden="true">06°14'32.8\"S / 106°48'10.2\"E · POSTMARK 04</div>
          <div className="section-index">04 <span>—</span> leave a note</div>
          <div className="rsvp-section__grid">
            <div className="rsvp-section__intro">
              <SectionHeading eyebrow="Konfirmasi kehadiran" title={<>Satu pesan kecil<br />dari <i>Anda.</i></>} description="Titipkan kabar kecil untuk kami. Jawaban dan pesan Anda tersimpan di perangkat ini, seperti catatan yang diselipkan di halaman perjalanan." />
              <div className="rsvp-section__postmark"><WaveEmblem /><span>with love<br />N + R</span></div>
            </div>
            <div className="rsvp-form-wrap">
              <form className="rsvp-form" onSubmit={submitRsvp} noValidate>
                <label className="field-label" htmlFor="guest-name">Nama lengkap</label>
                <input id="guest-name" value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} placeholder="Tulis nama Anda" autoComplete="name" />
                <fieldset>
                  <legend className="field-label">Kehadiran</legend>
                  <div className="attendance-options">
                    {["Saya akan hadir", "Belum bisa memastikan", "Tidak dapat hadir"].map((option) => <label key={option} className={`attendance-option ${rsvpStatus === option ? "is-selected" : ""}`}><input type="radio" name="attendance" value={option} checked={rsvpStatus === option} onChange={(event) => setRsvpStatus(event.target.value)} /><span>{option}</span></label>)}
                  </div>
                </fieldset>
                <label className="field-label" htmlFor="guest-message">Pesan dan doa</label>
                <textarea id="guest-message" value={rsvpMessage} onChange={(event) => setRsvpMessage(event.target.value)} placeholder="Tulis doa baik untuk kami..." rows={4} />
                {rsvpError ? <p className="form-feedback form-feedback--error" role="alert">{rsvpError}</p> : null}
                {rsvpSent ? <p className="form-feedback form-feedback--success" role="status"><Check size={15} /> Terima kasih, pesan Anda sudah kami terima di perangkat ini.</p> : null}
                <button className="solid-link" type="submit"><span>Kirim kabar</span><Send size={16} /></button>
              </form>
              <div className="guestbook">
                <div className="guestbook__header"><span>Surat yang sampai</span><small>{guestbook.length ? `${guestbook.length} pesan` : "Belum ada pesan"}</small></div>
                {guestbook.length === 0 ? <div className="guestbook__empty"><Mail size={17} /><p>Pesan baik Anda akan kami baca di sini setelah dikirim.</p></div> : <div className="guestbook__entries">{guestbook.map((entry) => <article key={entry.id} className="guestbook__entry"><div><strong>{entry.name}</strong><span>{entry.attendance}</span></div><p>{entry.message}</p></article>)}</div>}
              </div>
            </div>
          </div>
        </section>

        <section id="tanda-kasih" className="gift-section section-paper">
          <div className="gift-section__contour" aria-hidden="true"><span /><span /><span /></div>
          <div className="section-index">05 <span>—</span> a little gesture</div>
          <div className="gift-section__header"><SectionHeading eyebrow="Tanda kasih" title={<>Jika ingin meninggalkan<br /><i>hangat</i> untuk kami.</>} description="Doa dan kehadiran Anda adalah hadiah yang paling berarti. Bila ingin menitipkan hangat untuk perjalanan baru kami, detailnya ada di bawah ini." /></div>
          <div className="gift-section__grid">
            <div className="qr-card reveal"><Stamp>postal note / 05</Stamp><div className="qr-card__top"><span>send with care</span><Sparkles size={16} /></div><img src={`https://quickchart.io/qr?text=${encodeURIComponent(weddingConfig.payment.qrPayload)}&size=240&margin=1`} alt="QR code untuk tanda kasih melalui DANA" /><span className="qr-card__caption">{weddingConfig.payment.isExample ? "Data contoh — ganti sebelum undangan dibagikan" : "Terima kasih atas tanda kasih Anda"}</span></div>
            <div className="payment-details reveal">
              <div className="payment-details__item"><span className="payment-details__label">E-wallet · {weddingConfig.payment.ewalletProvider}</span><strong>{weddingConfig.payment.ewalletNumber}</strong><p>a.n. {weddingConfig.payment.accountName}</p><CopyButton value={weddingConfig.payment.ewalletNumber} label="Salin nomor e-wallet" /></div>
              <div className="payment-details__item"><span className="payment-details__label">Transfer bank · {weddingConfig.payment.bank}</span><strong>{weddingConfig.payment.accountNumber}</strong><p>a.n. {weddingConfig.payment.accountName}</p><CopyButton value={weddingConfig.payment.accountNumber} label="Salin nomor rekening" /></div>
              <a className="payment-link" href={weddingConfig.payment.paymentLink} target="_blank" rel="noreferrer"><Volume2 size={15} /> Buka link pembayaran <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <WaveEmblem className="site-footer__emblem" />
        <p className="site-footer__small">A new chapter, written together.</p>
        <h2>Nadia <i>&</i> Raka</h2>
        <div className="site-footer__bottom"><span>21 · 11 · 2026</span><span>Made with a little sea air.</span><a href="#awal" onClick={(event) => { event.preventDefault(); scrollToId("#awal"); }}><ArrowUp size={15} /> back to top</a></div>
      </footer>

      <div className="music-control-wrap">
        <button className="music-control" type="button" onClick={music.isPlaying ? music.stop : music.play} aria-label={music.isPlaying ? "Jeda musik" : "Putar musik"}>
          {music.isPlaying ? <CirclePause size={19} /> : <CirclePlay size={19} />}
          <span>{music.isPlaying ? "Jeda musik" : "Putar musik"}</span>
        </button>
      </div>

      <nav className={`mobile-nav ${contentReady ? "mobile-nav--visible" : ""}`} aria-label="Navigasi mobile">
        {mobileNavItems.map(({ label, href, icon: Icon }) => <a key={href} className={activeNav === href ? "is-active" : ""} href={href}><Icon size={17} /><span>{label}</span></a>)}
      </nav>

      {lightboxIndex !== null ? <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setLightboxIndex(null)}>
        <button className="lightbox__close" type="button" onClick={() => setLightboxIndex(null)} aria-label="Tutup galeri"><X size={22} /></button>
        <button className="lightbox__arrow lightbox__arrow--left" type="button" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length); }} aria-label="Foto sebelumnya"><ChevronLeft size={28} /></button>
        <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}><img src={galleryItems[lightboxIndex].src} alt={galleryItems[lightboxIndex].alt} /><figcaption>{galleryItems[lightboxIndex].caption}</figcaption></figure>
        <button className="lightbox__arrow lightbox__arrow--right" type="button" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % galleryItems.length); }} aria-label="Foto berikutnya"><ChevronRight size={28} /></button>
      </div> : null}
    </div>
  );
}
