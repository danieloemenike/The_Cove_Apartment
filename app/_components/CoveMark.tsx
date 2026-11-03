/** The Cove "C" mark, redrawn from public/TheCove.jpg so it works on light and dark backgrounds. */
export default function CoveMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="320 180 415 510" className={className} role="img" aria-label="The Cove">
      <g fill="#ff4d00" fillRule="evenodd">
        <path d="M345 300 543 187 745 302 655 366 543 305 437 366Z" />
        <path d="M330 325 437 392 437 495 543 557 630 510 725 577 543 683 330 560Z" />
        <path d="M485 441 538 396 556 411V395H566V420L593 441H579V466C566 476 552 476 541 468 528 459 512 459 498 468V441ZM531 427H545V441H531Z" />
      </g>
    </svg>
  );
}
