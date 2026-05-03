/**
 * SmartYouTubeEmbed — YouTube embed with facade pattern for performance.
 *
 * Features:
 * - FACADE: Shows lightweight thumbnail + play button first (no iframe loaded)
 * - Only loads YouTube iframe on user click → saves 1-2MB JS per video
 * - Auto-pauses when another video starts playing
 * - Auto-pauses when scrolled out of viewport
 */
import { useEffect, useRef, useCallback, useState } from "react";
import { Play } from "lucide-react";

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
  autoFacade?: boolean; // default true — show thumbnail first, load on click
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
  autoFacade = true,
}: SmartYouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const instanceId = useRef(`yt-${videoId}-${++idCounter}`);
  const [activated, setActivated] = useState(!autoFacade);
  const [isReady, setIsReady] = useState(false);

  const pauseVideo = useCallback(() => {
    try {
      playerRef.current?.pauseVideo?.();
    } catch {
      // Player may not be ready
    }
  }, []);

  // Initialize YouTube player only after activation
  useEffect(() => {
    if (!activated) return;
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
          autoplay: autoFacade ? 1 : 0, // auto-play after facade click
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
  }, [videoId, pauseVideo, activated, autoFacade]);

  // IntersectionObserver — pause when scrolled out of view
  useEffect(() => {
    if (!activated) return;
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
  }, [pauseVideo, activated]);

  return (
    <div ref={containerRef} className={`${aspectClass} ${className} relative bg-black overflow-hidden`}>
      {/* Facade: lightweight thumbnail + play button */}
      {!activated && (
        <button
          onClick={() => setActivated(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer z-10"
          aria-label={`Play ${title || "video"}`}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4A843]/90 group-hover:bg-[#D4A843] flex items-center justify-center shadow-[0_0_30px_rgba(212,168,67,0.4)] group-hover:scale-110 transition-all duration-300">
              <Play className="size-7 sm:size-9 text-[#0a0a0a] ml-1" fill="currentColor" />
            </div>
          </div>
        </button>
      )}

      {/* Loading spinner (shows briefly after click, before player is ready) */}
      {activated && !isReady && (
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

      {/* YouTube player injected here only after activation */}
      {activated && <div ref={playerDivRef} className="w-full h-full" />}
    </div>
  );
}
