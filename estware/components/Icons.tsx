// Line icons used across the site. All share the stroke styles set in globals.css.
type IconProps = { className?: string };

const svg = (className: string | undefined, children: React.ReactNode) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);

export const ArrowIcon = () => svg(undefined, <path d="M5 12h14M13 6l6 6-6 6" />);

export const TickIcon = () => svg(undefined, <path d="M5 12.5l4.5 4.5L19 7.5" />);

export const MenuIcon = () => svg(undefined, <path d="M4 7h16M4 12h16M4 17h16" />);

export const WebIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M7 6.5h.01M10 6.5h.01" />
    </>
  );

export const MobileIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  );

export const GlobeIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </>
  );

export const ReceiptIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" />
      <path d="M9 7.5h6M9 11h6M9 14.5h4" />
    </>
  );

export const BoxIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </>
  );

export const WrenchIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5l3 3 5.8-5.8a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
  );

export const BagIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <path d="M5 8h14l-1.2 12.5H6.2z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  );

export const TruckIcon = ({ className = "ico" }: IconProps) =>
  svg(
    className,
    <>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 9.5h4l3 3.2v2.8h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  );

export const RingsIcon = () =>
  svg(
    undefined,
    <>
      <circle cx="9" cy="14" r="5.5" />
      <circle cx="15" cy="14" r="5.5" />
      <path d="M12 3.5l2 2.5-2 2.5-2-2.5z" />
    </>
  );

export const PinIcon = () =>
  svg(
    undefined,
    <>
      <path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </>
  );

export const ClockIcon = () =>
  svg(
    undefined,
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  );
