"use client"
import { useEffect, useRef, useState } from 'react';

const WHATSAPP_NUMBER = '2349090366306';
const WHATSAPP_MESSAGE =
  "Hi Daniel, I saw The Cove's digital menu and I'd like a similar menu for my business.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// How far a guest scrolls before the slim WhatsApp bar slides in.
const REVEAL_AFTER_PX = 900;

function WhatsAppLink() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-sm text-cream underline decoration-brass/60 underline-offset-4 hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}

/**
 * The menu is long, so besides the footer at the very end, a slim bar slides up
 * once the guest has scrolled a while. It hides again when the real footer is
 * on screen, and the guest can close it.
 */
const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledEnough(window.scrollY > REVEAL_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showBar = scrolledEnough && !footerInView && !closed;

  return (
    <>
      <footer ref={footerRef} className="border-t border-brass/15 px-6 py-8 text-center text-sm text-mist">
        <p>
          Want a menu like this for your business? <WhatsAppLink />
        </p>
      </footer>

      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-brass/20 bg-ink/90 backdrop-blur-md transition-transform duration-500 ease-out motion-reduce:transition-none ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] text-[13px] text-mist">
          <p className="min-w-0 truncate">
            <span className="hidden sm:inline">Want a menu like this for your business? </span>
            <span className="sm:hidden">Want a menu like this? </span>
          </p>
          <WhatsAppLink />
          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="Hide"
            className="ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-mist hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="h-3.5 w-3.5 stroke-current" strokeWidth={1.8} strokeLinecap="round">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Footer;
