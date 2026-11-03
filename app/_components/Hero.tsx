import Link from "next/link";
import CoveMark from "./CoveMark";
import ThemeToggle from "./ThemeToggle";

type Props = {
    path: string
    title: string
    lounge?: string
}

function Hero({ path, title, lounge }: Props) {
  return (
    <header className="relative isolate">
      <div className="absolute inset-x-0 top-0 z-10 lg:static">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-10 lg:py-6">
          <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink/80 ring-1 ring-brass/30 backdrop-blur-sm">
              <CoveMark className="h-6 w-6" />
            </span>
            <span className="hidden font-display text-lg text-cream lg:inline">The Cove</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl lg:grid-cols-[1fr_auto] lg:items-center lg:gap-20 lg:px-10 lg:pb-14 lg:pt-4">
        {/* Capped height: a short crop on phones, a framed portrait on desktop */}
        <div className="relative lg:order-2">
          <div className="pointer-events-none absolute -inset-3 hidden rounded-[6px] border border-brass/40 lg:block" aria-hidden />
          <div className="cove-settle relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[4/5] lg:h-[min(60vh,540px)] lg:w-auto lg:rounded-[3px]">
            <img
              src={path}
              alt="The reception lounge at The Cove"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
            />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink/60 to-transparent lg:hidden" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent lg:hidden" aria-hidden />
          </div>
        </div>

        <div className="cove-rise relative -mt-12 px-6 pb-10 [animation-delay:150ms] lg:mt-0 lg:px-0 lg:pb-0">
          <h1 className="font-display text-[3.25rem] font-medium leading-[0.95] tracking-[-0.02em] text-cream sm:text-7xl lg:text-[6rem]">
            The Cove
          </h1>
          {lounge ? <p className="mt-3 text-lg tracking-[0.04em] text-brass lg:text-xl">{lounge}</p> : null}
          <div className="mt-6 flex items-center gap-3 text-brass/70 lg:mt-8" aria-hidden>
            <span className="h-px w-12 bg-current" />
            <span className="h-1.5 w-1.5 rotate-45 bg-current" />
            <span className="h-px w-12 bg-current" />
          </div>
          <p className="mt-5 max-w-xs font-display text-lg italic leading-snug text-mist lg:text-xl">{title}</p>
        </div>
      </div>
    </header>
  )
}

export default Hero
