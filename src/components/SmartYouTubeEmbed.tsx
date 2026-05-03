/**
 * SmartYouTubeEmbed — YouTube embed with smart playback control
 * using the official YouTube IFrame Player API.
 *
 * Features:
 * - Auto-pauses when another video starts playing
 * - Auto-pauses when scrolled out of viewport
 */
import { useEffect, useRef, useCallback, useState } from "react";

/* ── Global YouTube IFrame API loader ─────────────────────── */
let ytApiReady = false;
let ytApiLoading = false;
const ytReadyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (ytApiReady && window.YT?.Player) {
      resolve();
      return;
    }
    ytReadyCallbacks.push(resolve);
    if (ytApiLoading) return;
    ytApiLoading = true;

    // The API calls this global when ready
    (window as any).onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      ytReadyCallbacks.forEach((cb) => cb());
      ytReadyCallbacks.length = 0;
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
}

/* ── Global player registry ───────────────────────────────── */
const allPlayers = new Map<string, { player: any; pause: () => void }>();

function pauseAllExcept(activeId: string) {
  allPlayers.forEach((entry, id) => {
    if (id !== activeId) {
      entry.pause();
    }
  });
}

/* ── Unique ID counter ────────────────────────────────────── */
let idCounter = 0;

/* ── Component ────────────────────────────────────────────── */
interface SmartYouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
  aspectClass?: string;
}

declare global {
  interface Window {
    YT: any;
  }
}

export function SmartYouTubeEmbed({
  videoId,
  title = "",
  className = "",
  aspectClass = "aspect-video",
}: SmartYouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const instanceId = useRef(`yt-${videoId}-${++idCounter}`);
  const [isReady, setIsReady] = useState(false);

  const pauseVideo = useCallback(() => {
    try {
      playerRef.current?.pauseVideo?.();
    } catch {
      // Player may not be ready
    }
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    const id = instanceId.current;
    let destroyed = false;

    loadYouTubeAPI().then(() => {
      if (destroyed || !playerDivRef.current) return;

      const player = new window.YT.Player(playerDivRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            if (!destroyed) {
              playerRef.current = player;
              allPlayers.set(id, { player, pause: pauseVideo });
              setIsReady(true);
            }
          },
          onStateChange: (event: any) => {
            if (destroyed) return;
            // YT.PlayerState.PLAYING === 1
            if (event.data === 1) {
              pauseAllExcept(id);
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      allPlayers.delete(id);
      try {
        playerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [videoId, pauseVideo]);

  // IntersectionObserver — pause when scrolled out of view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pauseVideo();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [pauseVideo]);

  return (
    <div ref={containerRef} className={`${aspectClass} ${className} relative bg-black`}>
      {/* Placeholder while loading */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      {/* YouTube player will be injected here */}
      <div ref={playerDivRef} className="w-full h-full" />
    </div>
  );
}
