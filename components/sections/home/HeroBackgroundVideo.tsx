"use client";

import { useState } from "react";

type HeroBackgroundVideoProps = {
  src: string;
};

/**
 * Decorative full-bleed background video for the home hero.
 *
 * Self-contained: renders both the <video> element and the readability
 * scrim above it. When the source fails to load (e.g. the file isn't
 * in `/public` yet), both layers hide together so the hero falls back
 * to its plain cream-canvas treatment without a floating empty
 * overlay.
 *
 * Stacking — the section that hosts this component must apply
 * `relative isolate overflow-hidden`, and the content sibling
 * (Container + heading + lead + CTA) must sit on `relative z-10`.
 * Video and scrim are pushed below via `-z-10` inside the new
 * stacking context that `isolate` creates.
 *
 * Scrim — `bg-ink/55` is a dark scrim sized for a premium dark hero
 * treatment. The hero section itself carries `bg-ink` as the always-on
 * base, so when the video file is missing this component returns null
 * and the section stays cleanly dark (not a half-state with scrim but
 * no video). The 55% opacity strikes a balance: video texture stays
 * visible enough to read as motion, white display text keeps reliable
 * contrast across whatever footage gets dropped in. Tunable in one
 * place if a different feel is wanted.
 *
 * Playback flags follow the video-as-decoration convention: muted +
 * autoPlay so it starts unprompted, loop so it never ends, playsInline
 * so iOS doesn't punt to fullscreen, preload="metadata" so we fetch
 * only what's needed to start. `aria-hidden` because it's purely
 * decorative — screen readers ignore it.
 */
export function HeroBackgroundVideo({ src }: HeroBackgroundVideoProps) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;

  return (
    <>
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      >
        <source
          src={src}
          type="video/mp4"
          onError={() => setHasError(true)}
        />
      </video>
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/55" />
    </>
  );
}
