// Paper Coast style reminder: keep content editable, specific, and editorial; never scatter wedding data across UI components.

export type EventKind = "Akad" | "Resepsi";

export type GuestbookEntry = {
  id: string;
  name: string;
  attendance: string;
  message: string;
  createdAt: string;
};

export const weddingConfig = {
  theme: {
    name: "Paper Coast",
    signatureColor: "#1f4b5b",
    accentColor: "#b46b4b",
  },
  couple: {
    names: "Nadia & Raka",
    firstName: "Nadia",
    secondName: "Raka",
    parents: "Putri dari Bapak Adi Pranata & Ibu Sari Wulandari, serta putra dari Bapak Bima Santosa & Ibu Maya Lestari",
    storyLead: "Dua arah perjalanan, satu rumah untuk pulang.",
  },
  event: {
    date: "2026-11-21T15:30:00+07:00",
    dateLabel: "Sabtu, 21 November 2026",
    shortDate: "21 · 11 · 26",
    ceremony: {
      kind: "Akad" as EventKind,
      time: "15.30 — 16.30 WIB",
      venue: "Masjid Al-Hikmah",
      address: "Jl. Kemang Raya No. 18, Jakarta Selatan",
    },
    reception: {
      kind: "Resepsi" as EventKind,
      time: "18.30 — 21.00 WIB",
      venue: "Rumah Kayu Senopati",
      address: "Jl. Tulodong Atas No. 7, Jakarta Selatan",
    },
    mapsUrl: "https://maps.google.com/?q=Rumah+Kayu+Senopati+Jakarta",
    timezone: "Asia/Jakarta",
  },
  music: {
    label: "Paper Coast / ambient",
    note: "Musik instrumental lembut · volume 25%",
  },
  payment: {
    isExample: true,
    ewalletProvider: "DANA",
    ewalletNumber: "0812 3456 7890",
    accountName: "Nadia Prameswari",
    bank: "BCA",
    accountNumber: "123 456 7890",
    paymentLink: "https://link.dana.id/minta/081234567890",
    qrPayload: "DANA 081234567890 a.n. Nadia Prameswari",
  },
} as const;

export const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=88",
    alt: "Pasangan berjalan bersama di tepi pantai dalam cahaya sore",
    caption: "01 / toward the horizon",
    ratio: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=88",
    alt: "Detail busana dan bunga putih pada sesi foto pernikahan",
    caption: "02 / the quiet details",
    ratio: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=88",
    alt: "Pasangan tersenyum dalam suasana hangat dan intim",
    caption: "03 / a soft afternoon",
    ratio: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=88",
    alt: "Potret editorial dengan nuansa biru dan cahaya alami",
    caption: "04 / in blue hour",
    ratio: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=88",
    alt: "Dua tangan saling menggenggam sebagai simbol perjalanan bersama",
    caption: "05 / held close",
    ratio: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1100&q=88",
    alt: "Pasangan duduk berdampingan menikmati pemandangan sore",
    caption: "06 / the long way home",
    ratio: "tall",
  },
] as const;

export const formatCountdown = (target: string, now = Date.now()) => {
  const remaining = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  return { days, hours, minutes, seconds, finished: remaining === 0 };
};

export const createCalendarUrl = () => {
  const start = new Date("2026-11-21T15:30:00+07:00");
  const end = new Date("2026-11-21T21:00:00+07:00");
  const toCalendarDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Pernikahan Nadia & Raka",
    dates: `${toCalendarDate(start)}/${toCalendarDate(end)}`,
    details: "Akad dan resepsi Nadia & Raka. Sampai jumpa di hari yang kami nantikan.",
    location: `${weddingConfig.event.reception.venue}, ${weddingConfig.event.reception.address}`,
    ctz: weddingConfig.event.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const getGuestName = () => {
  const value = new URLSearchParams(window.location.search).get("to");
  if (!value) return "Tamu undangan";
  return value.trim().replace(/\s+/g, " ").slice(0, 72) || "Tamu undangan";
};

export const getStoredGuestbook = (): GuestbookEntry[] => {
  try {
    const stored = localStorage.getItem("paper-coast-guestbook");
    return stored ? (JSON.parse(stored) as GuestbookEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveGuestbook = (entries: GuestbookEntry[]) => {
  try {
    localStorage.setItem("paper-coast-guestbook", JSON.stringify(entries));
  } catch {
    // Local storage may be disabled; the UI still shows the current-session entry.
  }
};
