import { FACE, MANE, WORDMARK } from "@/lib/paths";

// The lion's face, drawn white inside a mask so its features cut through.
function FaceMaskShapes() {
  return (
    <g transform="translate(50 95) scale(1.1) translate(-50 -95)">
      <path d={FACE} fill="#fff" />
      <path d="M66 64 C61 60 55 60 50 64 C55 67 61 67 66 64 Z" fill="#000" />
      <g stroke="#000" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M47 59 C54 55 62 55 70 58" strokeWidth="3.4" />
        <path d="M25 77 C27 81 27 87 25 92" strokeWidth="2.4" />
        <path d="M27 96 C32 101 35 107 37 114" strokeWidth="2.4" />
        <path d="M34 115 C44 114 54 112 62 108 C64 107 65 108 65 110" strokeWidth="3.2" />
        <path d="M70 74 C74 84 73 96 68 106" strokeWidth="2.4" />
      </g>
    </g>
  );
}

/** Estware logo: lion monogram + wordmark. `id` keeps the mask unique when used twice on a page. */
export function Logo({ id }: { id: string }) {
  const maskId = `logo-${id}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="5.6 -2 708.1085714285714 196"
      aria-hidden="true"
      focusable="false"
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
        <rect x="0" y="0" width="200" height="200" fill="#000" />
        <path d={MANE} fill="#fff" />
        <FaceMaskShapes />
      </mask>
      <rect x="0" y="0" width="200" height="200" fill="currentColor" mask={`url(#${maskId})`} />
      <path d={WORDMARK} fill="currentColor" />
    </svg>
  );
}

/** The large animated lion in the hero: the mane strands slide in one by one and sway. */
export function LionArt() {
  return (
    <svg viewBox="0 0 200 200" focusable="false">
      <defs>
        <path id="ln-mane" d={MANE} />
        <clipPath id="ln-rest">
          <rect x="0" y="0" width="118" height="200" />
        </clipPath>
        <clipPath id="ln-c1">
          <rect x="114" y="0" width="90" height="72" />
        </clipPath>
        <clipPath id="ln-c2">
          <rect x="114" y="72" width="90" height="42" />
        </clipPath>
        <clipPath id="ln-c3">
          <rect x="114" y="114" width="90" height="90" />
        </clipPath>
        <mask id="ln-face" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect width="200" height="200" fill="#000" />
          <FaceMaskShapes />
        </mask>
      </defs>
      <g className="ln-stem">
        <use href="#ln-mane" clipPath="url(#ln-rest)" fill="currentColor" />
      </g>
      <g className="ln-a1">
        <g className="ln-s1">
          <use href="#ln-mane" clipPath="url(#ln-c1)" fill="currentColor" />
        </g>
      </g>
      <g className="ln-a2">
        <g className="ln-s2">
          <use href="#ln-mane" clipPath="url(#ln-c2)" fill="currentColor" />
        </g>
      </g>
      <g className="ln-a3">
        <g className="ln-s3">
          <use href="#ln-mane" clipPath="url(#ln-c3)" fill="currentColor" />
        </g>
      </g>
      <g className="ln-face">
        <rect width="200" height="200" fill="currentColor" mask="url(#ln-face)" />
      </g>
    </svg>
  );
}
