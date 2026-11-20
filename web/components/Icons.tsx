type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const SearchIcon = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const WalletIcon = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1" />
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 13.5h2" />
  </svg>
);
export const UserIcon = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const ChevronLeft = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="m15 18-6-6 6-6" /></svg>
);
export const ChevronRight = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="m9 18 6-6-6-6" /></svg>
);
export const ChevronDown = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}><path d="m6 9 6 6 6-6" /></svg>
);
export const BoltIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
);
export const CloseIcon = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const HeartIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
  </svg>
);
export const LockIcon = ({ className = "size-4" }: P) => (
  <svg {...base} className={className}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
