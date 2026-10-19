import { useEffect, type ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

type MenuItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const icon = (children: ReactNode, size: number, extra: Record<string, string | number> = {}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
    {...extra}
  >
    {children}
  </svg>
);

const tiles: MenuItem[] = [
  {
    href: '#home',
    label: 'Home',
    icon: icon(<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />, 30, { strokeLinejoin: 'round' }),
  },
  {
    href: '#deposit',
    label: 'Deposit',
    icon: icon(
      <>
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <path d="M2 10h20M6 15h4" />
      </>,
      30,
      { strokeLinecap: 'round' }
    ),
  },
  {
    href: '#withdraw',
    label: 'Withdraw',
    icon: icon(
      <>
        <path d="M3 4h18M6 4v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4" />
        <path d="M12 8v9M14.3 10c-.3-.7-1.1-1.1-2.3-1.1-1.4 0-2.3.6-2.3 1.5s.9 1.3 2.3 1.6 2.3.7 2.3 1.6-.9 1.6-2.3 1.6c-1.2 0-2-.4-2.4-1.2" />
      </>,
      30,
      { strokeLinecap: 'round' }
    ),
  },
  {
    href: '#download',
    label: 'Download',
    icon: icon(<path d="M12 3v12M7 10l5 5 5-5M4 20h16" />, 30, {
      strokeWidth: 2.2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  },
  {
    href: '#vip',
    label: 'VIP',
    icon: icon(<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />, 30, { strokeLinejoin: 'round' }),
  },
  {
    href: '#ranking',
    label: 'Ranking',
    icon: icon(<path d="M3 21v-8h6v8M9 21V6h6v15M15 21v-10h6v10M2 21h20" />, 30, { strokeLinejoin: 'round' }),
  },
  {
    href: '#downline',
    label: 'Downline',
    icon: icon(
      <>
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="19" r="2.5" />
        <circle cx="12" cy="19" r="2.5" />
        <circle cx="19" cy="19" r="2.5" />
        <path d="M12 7.5v9M12 12H5v4.5M12 12h7v4.5" />
      </>,
      30,
      { strokeLinecap: 'round' }
    ),
  },
  {
    href: '#trustpilot',
    label: 'Trustpilot',
    icon: icon(<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />, 30, {
      strokeLinejoin: 'round',
    }),
  },
  {
    href: '#customize',
    label: 'Customize',
    icon: icon(<path d="M5 4v16M12 4v16M19 4v16M2.5 8h5M9.5 15h5M16.5 10h5" />, 30, { strokeLinecap: 'round' }),
  },
];

const rows: (MenuItem & { badge?: string })[] = [
  {
    href: '#partnership',
    label: 'Partnership',
    badge: 'Premium',
    icon: icon(<path d="M2 11l4-4 4 2 2-1 2 1 4-2 4 4-7 7-3-3-2 2-3-3z" />, 20, { strokeLinejoin: 'round' }),
  },
  {
    href: '#entertainment',
    label: 'Entertainment',
    icon: icon(
      <>
        <path d="M6 10h12l-1.5 11h-9z" />
        <path d="M7 10a2.5 2.5 0 0 1 3-3.5 2.5 2.5 0 0 1 4 0A2.5 2.5 0 0 1 17 10" />
      </>,
      20,
      { strokeLinejoin: 'round' }
    ),
  },
  {
    href: '#follow',
    label: 'Follow Us',
    icon: icon(
      <>
        <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
        <path d="M10 20.5a2 2 0 0 0 4 0" />
      </>,
      20,
      { strokeLinejoin: 'round' }
    ),
  },
  {
    href: '#language',
    label: 'Language',
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3.2 3.2 3.2 14.8 0 18M12 3c-3.2 3.2-3.2 14.8 0 18" />
      </>,
      20
    ),
  },
  {
    href: '#backup',
    label: 'Backup Link',
    icon: icon(
      <>
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </>,
      20,
      { strokeWidth: 2.2, strokeLinecap: 'round' }
    ),
  },
  {
    href: '#reviews',
    label: 'Reviews',
    icon: icon(<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />, 20, {
      fill: 'currentColor',
      stroke: 'none',
    }),
  },
  {
    href: '#safety',
    label: 'Safety',
    icon: icon(
      <>
        <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>,
      20,
      { strokeLinejoin: 'round', strokeLinecap: 'round' }
    ),
  },
];

const chevron = icon(<path d="M9 5l7 7-7 7" />, 16, {
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export const SideMenu = ({ open, onClose }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'visible' : 'invisible pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <nav
        aria-label="Main menu"
        className={`absolute inset-y-0 left-0 flex w-full max-w-[390px] flex-col gap-[26px] overflow-y-auto bg-h23-ground px-[22px] pb-[26px] pt-[22px] font-barlow text-white shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="relative flex flex-col items-center gap-1 pt-1.5">
          <span className="text-sm font-extrabold tracking-[1.5px] text-h23-accent">WELCOME TO</span>
          <span className="text-[44px] font-extrabold italic leading-none tracking-[-1px]">
            <span className="text-white">HAPPY</span>
            <span className="text-h23-accent">23</span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-h23-line bg-h23-surface p-0 text-h23-accent transition hover:brightness-110 active:scale-[.97]"
          >
            {icon(<path d="M6 6l12 12M18 6L6 18" />, 18, { strokeWidth: 3.2, strokeLinecap: 'round' })}
          </button>
        </header>

        <div className="flex gap-3.5">
          <a
            href="#register"
            onClick={onClose}
            className="flex h-[50px] flex-1 items-center justify-center rounded-full bg-h23-accent text-base font-extrabold tracking-[.5px] text-[#1A0B33] shadow-[inset_0_-6px_12px_rgba(0,0,0,.2),0_0_14px_rgba(244,216,3,.45)] transition hover:brightness-110 active:scale-[.97]"
          >
            REGISTER
          </a>
          <a
            href="#login"
            onClick={onClose}
            className="flex h-[50px] flex-1 items-center justify-center rounded-full border-[1.5px] border-h23-line bg-h23-surface text-base font-bold tracking-[.5px] text-white transition hover:brightness-110 active:scale-[.97]"
          >
            LOGIN
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          {tiles.map((tile) => (
            <a
              key={tile.href}
              href={tile.href}
              onClick={onClose}
              className="flex h-[100px] flex-col items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-h23-line bg-h23-surface text-[13px] font-semibold shadow-[inset_0_0_12px_rgba(155,77,255,.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(155,77,255,.55),inset_0_0_14px_rgba(155,77,255,.25)] active:scale-[.97]"
            >
              <span className="text-h23-accent">{tile.icon}</span>
              <span>{tile.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-2.5 flex flex-col gap-3">
          {rows.map((row) => (
            <a
              key={row.href}
              href={row.href}
              onClick={onClose}
              className="flex h-[58px] items-center gap-3.5 rounded-[14px] border border-h23-line bg-h23-row px-[18px] text-base font-bold transition hover:bg-[#1A1030] hover:text-white hover:shadow-[0_0_12px_rgba(155,77,255,.35)]"
            >
              <span className="text-h23-accent">{row.icon}</span>
              <span className="flex-1">{row.label}</span>
              {row.badge && (
                <span className="rounded-full border-[1.5px] border-h23-accent px-3 py-[3px] text-[13px] font-bold text-h23-accent">
                  {row.badge}
                </span>
              )}
              <span className="text-h23-accent">{chevron}</span>
            </a>
          ))}
        </div>

        <footer className="mt-auto text-center text-xs font-bold tracking-[1.5px] text-[#B98CFF]">HAPPY23.ORG</footer>
      </nav>
    </div>
  );
};
