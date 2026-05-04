import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  ArrowLeft, Play, Pause, Volume2, VolumeX, Music,
  ShoppingCart, Download, Clock, Disc3, ExternalLink,
  Lock, ChevronDown, ChevronUp, Hash, Star, Headphones,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Constants ──────────────────────────────────────────────
const PREVIEW_DURATION = 30; // seconds

// ─── Types ──────────────────────────────────────────────────
interface StoreItem {
  _id: Id<"musicStoreItems">;
  _creationTime: number;
  title: string;
  artistName: string;
  itemType: string;
  price: number;
  description?: string;
  genre?: string;
  coverArtUrl?: string;
  previewAudioUrl?: string;
  fullAudioUrl?: string;
  downloadUrl?: string;
  duration?: string;
  bpm?: number;
  key?: string;
  releaseDate?: string;
  albumId?: Id<"musicStoreItems">;
  trackNumber?: number;
  isActive: boolean;
  isFeatured?: boolean;
  tags?: string[];
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    soundcloud?: string;
    tidal?: string;
  };
  playCount?: number;
  purchaseCount?: number;
}

// ─── Audio Player Hook ──────────────────────────────────────
function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Id<"musicStoreItems"> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Auto-stop at 30 seconds for previews
      if (audio.currentTime >= PREVIEW_DURATION) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setPreviewEnded(true);
      }
    };
    const handleLoaded = () => setDuration(Math.min(audio.duration, PREVIEW_DURATION));
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const play = useCallback((trackId: Id<"musicStoreItems">, url: string) => {
    const audio = audioRef.current!;
    if (currentTrack === trackId && !previewEnded) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      audio.src = url;
      audio.currentTime = 0;
      audio.play();
      setCurrentTrack(trackId);
      setIsPlaying(true);
      setPreviewEnded(false);
    }
  }, [currentTrack, isPlaying, previewEnded]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(time, PREVIEW_DURATION);
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const changeVolume = useCallback((v: number) => {
    if (audioRef.current) {
      audioRef.current.volume = v;
      setVolume(v);
      if (v > 0) setIsMuted(false);
    }
  }, []);

  return {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    previewEnded, play, seek, toggleMute, changeVolume,
  };
}

// ─── Format Time ────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Progress Bar Component ─────────────────────────────────
function ProgressBar({
  currentTime, duration, onSeek,
}: {
  currentTime: number; duration: number; onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / Math.min(duration, PREVIEW_DURATION)) * 100 : 0;

  const handleClick = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    onSeek(x * Math.min(duration, PREVIEW_DURATION));
  };

  return (
    <div
      ref={barRef}
      onClick={handleClick}
      className="group relative h-1.5 bg-[#2a2622] rounded-full cursor-pointer overflow-hidden hover:h-2.5 transition-all"
    >
      {/* Filled portion */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4A843] to-[#E8C767] rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
      {/* Glow dot */}
      <div
        className="absolute top-1/2 -translate-y-1/2 size-3 bg-[#D4A843] rounded-full shadow-[0_0_8px_rgba(212,168,67,0.6)] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${progress}% - 6px)` }}
      />
    </div>
  );
}

// ─── Track Card (Single / Beat) ─────────────────────────────
function TrackCard({
  item, player, onIncrementPlay,
}: {
  item: StoreItem;
  player: ReturnType<typeof useAudioPlayer>;
  onIncrementPlay: (id: Id<"musicStoreItems">) => void;
}) {
  const isActive = player.currentTrack === item._id;
  const hasPreview = !!item.previewAudioUrl;

  return (
    <div className={`group relative bg-[#141210]/80 border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,168,67,0.08)] ${
      isActive ? "border-[#D4A843]/40 shadow-[0_0_30px_rgba(212,168,67,0.12)]" : "border-[#2a2622] hover:border-[#D4A843]/20"
    }`}>
      {/* Cover Art */}
      <div className="relative aspect-square bg-gradient-to-br from-[#1a1816] to-[#0d0c0b] overflow-hidden">
        {item.coverArtUrl ? (
          <img src={item.coverArtUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Disc3 className={`size-20 text-[#D4A843]/15 ${isActive && player.isPlaying ? "animate-spin" : ""}`}
              style={{ animationDuration: "3s" }} />
          </div>
        )}

        {/* Play overlay */}
        {hasPreview && (
          <button
            onClick={() => {
              player.play(item._id, item.previewAudioUrl!);
              if (!isActive) onIncrementPlay(item._id);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="size-16 rounded-full bg-[#D4A843] flex items-center justify-center shadow-[0_0_20px_rgba(212,168,67,0.4)] transform scale-90 group-hover:scale-100 transition-transform">
              {isActive && player.isPlaying ? (
                <Pause className="size-7 text-[#0a0a0a]" />
              ) : (
                <Play className="size-7 text-[#0a0a0a] ml-1" />
              )}
            </div>
          </button>
        )}

        {/* Badge */}
        {item.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#D4A843] text-[#0a0a0a] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            <Star className="size-3" /> FEATURED
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 right-3 bg-[#0a0a0a]/80 backdrop-blur text-[9px] font-bold tracking-widest uppercase text-[#D4A843] px-2.5 py-1 rounded-full border border-[#D4A843]/20">
          {item.itemType}
        </div>

        {/* Preview label */}
        {hasPreview && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#0a0a0a]/80 backdrop-blur text-[10px] text-[#888] px-2.5 py-1 rounded-full">
            <Clock className="size-3" /> 30s preview
          </div>
        )}
      </div>

      {/* Active player bar */}
      {isActive && (
        <div className="px-4 pt-3">
          <ProgressBar
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
          />
          <div className="flex justify-between text-[10px] text-[#666] mt-1 font-mono">
            <span>{formatTime(player.currentTime)}</span>
            <span>{formatTime(Math.min(player.duration, PREVIEW_DURATION))}</span>
          </div>
          {player.previewEnded && (
            <div className="flex items-center gap-2 mt-2 p-2.5 bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-lg">
              <Lock className="size-3.5 text-[#D4A843] shrink-0" />
              <span className="text-[11px] text-[#D4A843]">Preview ended — purchase to hear the full track</span>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-4 pt-3">
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider leading-tight">{item.title}</h3>
        <p className="text-xs text-[#888078] mt-0.5">{item.artistName}</p>

        {item.genre && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[9px] font-bold tracking-widest uppercase text-[#666] bg-[#1a1816] px-2 py-0.5 rounded-full border border-[#2a2622]">
              {item.genre}
            </span>
            {item.duration && (
              <span className="text-[9px] text-[#555] flex items-center gap-1">
                <Clock className="size-2.5" /> {item.duration}
              </span>
            )}
          </div>
        )}

        {item.description && (
          <p className="text-xs text-[#666] mt-2 line-clamp-2">{item.description}</p>
        )}

        {/* Price + Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2622]">
          <div>
            <span className="font-display text-2xl text-[#D4A843]">${item.price.toFixed(2)}</span>
            <span className="text-[10px] text-[#555] ml-1.5 uppercase tracking-wider">
              {item.itemType === "album" || item.itemType === "ep" ? "full album" : "mp3"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.downloadUrl && (
              <a
                href={item.downloadUrl}
                className="flex items-center gap-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#E8C767] transition-colors"
              >
                <Download className="size-3.5" /> Buy
              </a>
            )}
            {!item.downloadUrl && (
              <button className="flex items-center gap-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#E8C767] transition-colors">
                <ShoppingCart className="size-3.5" /> Buy
              </button>
            )}
          </div>
        </div>

        {/* Streaming Links */}
        {item.streamingLinks && Object.values(item.streamingLinks).some(Boolean) && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[9px] text-[#555] tracking-wider uppercase">Stream:</span>
            {item.streamingLinks.spotify && (
              <a href={item.streamingLinks.spotify} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-green-400 hover:text-green-300 transition-colors font-medium">Spotify</a>
            )}
            {item.streamingLinks.appleMusic && (
              <a href={item.streamingLinks.appleMusic} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-pink-400 hover:text-pink-300 transition-colors font-medium">Apple</a>
            )}
            {item.streamingLinks.youtube && (
              <a href={item.streamingLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-medium">YouTube</a>
            )}
            {item.streamingLinks.soundcloud && (
              <a href={item.streamingLinks.soundcloud} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors font-medium">SoundCloud</a>
            )}
            {item.streamingLinks.tidal && (
              <a href={item.streamingLinks.tidal} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-medium">Tidal</a>
            )}
          </div>
        )}

        {/* Play count */}
        {(item.playCount ?? 0) > 0 && (
          <p className="text-[10px] text-[#444] mt-2 flex items-center gap-1">
            <Play className="size-2.5" /> {item.playCount?.toLocaleString()} previews
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Album Card (Expandable with Tracklist) ─────────────────
function AlbumCard({
  album, tracks, player, onIncrementPlay,
}: {
  album: StoreItem;
  tracks: StoreItem[];
  player: ReturnType<typeof useAudioPlayer>;
  onIncrementPlay: (id: Id<"musicStoreItems">) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sortedTracks = [...tracks].sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0));

  return (
    <div className="bg-[#141210]/80 border border-[#2a2622] rounded-xl overflow-hidden hover:border-[#D4A843]/20 transition-all">
      {/* Album Header */}
      <div className="flex gap-5 p-5">
        {/* Cover */}
        <div className="relative size-32 sm:size-40 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#1a1816] to-[#0d0c0b]">
          {album.coverArtUrl ? (
            <img src={album.coverArtUrl} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="size-16 text-[#D4A843]/15" />
            </div>
          )}
          {album.isFeatured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#D4A843] text-[#0a0a0a] text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
              <Star className="size-2.5" /> FEATURED
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold tracking-widest uppercase text-[#D4A843] bg-[#D4A843]/10 px-2 py-0.5 rounded-full">
              {album.itemType}
            </span>
            {album.genre && (
              <span className="text-[9px] text-[#666] tracking-wider uppercase">{album.genre}</span>
            )}
          </div>
          <h3 className="font-display text-2xl text-[#f0ece4] tracking-wider leading-tight">{album.title}</h3>
          <p className="text-sm text-[#888078] mt-0.5">{album.artistName}</p>
          {album.description && (
            <p className="text-xs text-[#666] mt-2 line-clamp-2">{album.description}</p>
          )}
          {album.releaseDate && (
            <p className="text-[10px] text-[#555] mt-2">Released: {album.releaseDate}</p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <span className="font-display text-3xl text-[#D4A843]">${album.price.toFixed(2)}</span>
            {album.downloadUrl ? (
              <a href={album.downloadUrl}
                className="flex items-center gap-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#E8C767] transition-colors">
                <Download className="size-4" /> Buy Album
              </a>
            ) : (
              <button className="flex items-center gap-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#E8C767] transition-colors">
                <ShoppingCart className="size-4" /> Buy Album
              </button>
            )}
          </div>

          {/* Streaming Links */}
          {album.streamingLinks && Object.values(album.streamingLinks).some(Boolean) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[9px] text-[#555] tracking-wider uppercase">Stream:</span>
              {album.streamingLinks.spotify && (
                <a href={album.streamingLinks.spotify} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-green-400 hover:text-green-300 font-medium">Spotify</a>
              )}
              {album.streamingLinks.appleMusic && (
                <a href={album.streamingLinks.appleMusic} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-pink-400 hover:text-pink-300 font-medium">Apple</a>
              )}
              {album.streamingLinks.youtube && (
                <a href={album.streamingLinks.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-red-400 hover:text-red-300 font-medium">YouTube</a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tracklist Toggle */}
      {sortedTracks.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-3 border-t border-[#2a2622] text-xs text-[#888] hover:text-[#D4A843] transition-colors"
          >
            <Hash className="size-3" />
            {sortedTracks.length} track{sortedTracks.length !== 1 ? "s" : ""} — preview & buy singles
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>

          {expanded && (
            <div className="border-t border-[#2a2622]">
              {sortedTracks.map((track, idx) => {
                const isActive = player.currentTrack === track._id;
                const hasPreview = !!track.previewAudioUrl;
                return (
                  <div
                    key={track._id}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      isActive ? "bg-[#D4A843]/5" : "hover:bg-[#1a1816]/60"
                    } ${idx !== sortedTracks.length - 1 ? "border-b border-[#1a1816]" : ""}`}
                  >
                    {/* Track number / Play btn */}
                    <div className="w-8 shrink-0 text-center">
                      {hasPreview ? (
                        <button
                          onClick={() => {
                            player.play(track._id, track.previewAudioUrl!);
                            if (!isActive) onIncrementPlay(track._id);
                          }}
                          className="size-8 rounded-full flex items-center justify-center hover:bg-[#D4A843]/20 transition-colors"
                        >
                          {isActive && player.isPlaying ? (
                            <Pause className="size-3.5 text-[#D4A843]" />
                          ) : (
                            <Play className="size-3.5 text-[#888] hover:text-[#D4A843] ml-0.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-[#555] font-mono">{track.trackNumber ?? idx + 1}</span>
                      )}
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-[#D4A843]" : "text-[#f0ece4]"}`}>
                        {track.title}
                      </p>
                      {isActive && (
                        <div className="mt-1.5">
                          <ProgressBar
                            currentTime={player.currentTime}
                            duration={player.duration}
                            onSeek={player.seek}
                          />
                          <div className="flex justify-between text-[9px] text-[#555] mt-0.5 font-mono">
                            <span>{formatTime(player.currentTime)}</span>
                            <span>{formatTime(Math.min(player.duration, PREVIEW_DURATION))}</span>
                          </div>
                          {player.previewEnded && (
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#D4A843]">
                              <Lock className="size-3" /> Preview ended
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <span className="text-[11px] text-[#555] shrink-0 tabular-nums">
                      {track.duration || "—"}
                    </span>

                    {/* Price / Buy */}
                    <div className="shrink-0">
                      {track.downloadUrl ? (
                        <a href={track.downloadUrl}
                          className="flex items-center gap-1 bg-[#D4A843]/10 text-[#D4A843] font-bold text-[10px] px-3 py-1.5 rounded hover:bg-[#D4A843]/20 transition-colors border border-[#D4A843]/20">
                          ${track.price.toFixed(2)}
                        </a>
                      ) : (
                        <button className="flex items-center gap-1 bg-[#D4A843]/10 text-[#D4A843] font-bold text-[10px] px-3 py-1.5 rounded hover:bg-[#D4A843]/20 transition-colors border border-[#D4A843]/20">
                          ${track.price.toFixed(2)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Now Playing Bar (Fixed Bottom) ─────────────────────────
function NowPlayingBar({
  item, player,
}: {
  item: StoreItem | undefined;
  player: ReturnType<typeof useAudioPlayer>;
}) {
  if (!item || !player.currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0c0b]/95 backdrop-blur-lg border-t border-[#2a2622]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Cover */}
        <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-[#1a1816]">
          {item.coverArtUrl ? (
            <img src={item.coverArtUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="size-5 text-[#D4A843]/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-shrink-0 w-40">
          <p className="text-sm text-[#f0ece4] font-medium truncate">{item.title}</p>
          <p className="text-[10px] text-[#888] truncate">{item.artistName}</p>
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => item.previewAudioUrl && player.play(item._id, item.previewAudioUrl)}
          className="size-10 shrink-0 rounded-full bg-[#D4A843] flex items-center justify-center hover:bg-[#E8C767] transition-colors"
        >
          {player.isPlaying ? (
            <Pause className="size-4 text-[#0a0a0a]" />
          ) : (
            <Play className="size-4 text-[#0a0a0a] ml-0.5" />
          )}
        </button>

        {/* Progress */}
        <div className="flex-1 min-w-0">
          <ProgressBar
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
          />
          <div className="flex justify-between text-[9px] text-[#555] mt-0.5 font-mono">
            <span>{formatTime(player.currentTime)}</span>
            <span>{formatTime(Math.min(player.duration, PREVIEW_DURATION))}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button onClick={player.toggleMute} className="text-[#888] hover:text-[#D4A843] transition-colors">
            {player.isMuted || player.volume === 0 ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={player.isMuted ? 0 : player.volume}
            onChange={(e) => player.changeVolume(parseFloat(e.target.value))}
            className="w-20 accent-[#D4A843] h-1"
          />
        </div>

        {/* 30s badge */}
        <div className="hidden md:flex items-center gap-1 text-[9px] text-[#555] bg-[#1a1816] px-2 py-1 rounded-full border border-[#2a2622] shrink-0">
          <Clock className="size-3" /> 30s preview
        </div>

        {player.previewEnded && (
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#D4A843] bg-[#D4A843]/10 px-3 py-1.5 rounded-full border border-[#D4A843]/20 shrink-0">
            <Lock className="size-3" /> Get full track
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filter Tabs ────────────────────────────────────────────
function FilterTabs({
  active, onChange, counts,
}: {
  active: string;
  onChange: (v: string) => void;
  counts: Record<string, number>;
}) {
  const tabs = [
    { id: "all", label: "All Music" },
    { id: "single", label: "Singles" },
    { id: "album", label: "Albums" },
    { id: "ep", label: "EPs" },
    { id: "beat", label: "Beats" },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const count = tab.id === "all"
          ? Object.values(counts).reduce((s, n) => s + n, 0)
          : (counts[tab.id] || 0);
        if (tab.id !== "all" && count === 0) return null;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
              isActive
                ? "bg-[#D4A843] text-[#0a0a0a]"
                : "bg-[#1a1816] text-[#888] hover:text-[#f0ece4] border border-[#2a2622] hover:border-[#D4A843]/30"
            }`}
          >
            {tab.label}
            <span className={`text-[10px] ${isActive ? "text-[#0a0a0a]/60" : "text-[#555]"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN MUSIC STORE PAGE
// ═══════════════════════════════════════════════════════════
export default function MusicStorePage() {
  const storeItems = useQuery(api.musicStore.getStoreItems);
  const incrementPlay = useMutation(api.musicStore.incrementPlayCount);
  const player = useAudioPlayer();
  const [filter, setFilter] = useState("all");

  const items = storeItems ?? [];

  // Separate albums (parent items) and standalone singles/beats
  const albums = items.filter((i) => i.itemType === "album" || i.itemType === "ep");
  const albumIds = new Set(albums.map((a) => a._id));
  const albumTracks = items.filter((i) => i.albumId && albumIds.has(i.albumId));
  const standalones = items.filter(
    (i) => !i.albumId && i.itemType !== "album" && i.itemType !== "ep"
  );

  // Count by type
  const counts: Record<string, number> = {};
  items.forEach((i) => {
    if (!i.albumId) {
      counts[i.itemType] = (counts[i.itemType] || 0) + 1;
    }
  });

  // Apply filter
  const filteredAlbums = filter === "all" ? albums :
    albums.filter((a) => a.itemType === filter);
  const filteredStandalones = filter === "all" ? standalones :
    standalones.filter((s) => s.itemType === filter);

  // Find the currently playing item
  const currentItem = items.find((i) => i._id === player.currentTrack);

  const handleIncrementPlay = (id: Id<"musicStoreItems">) => {
    incrementPlay({ id }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-purple-500/8 via-[#D4A843]/5 to-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiMyMjIiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-40" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#D4A843] text-sm mb-8 hover:text-[#E8C767] transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#D4A843]/20 to-purple-500/20 flex items-center justify-center border border-[#D4A843]/20">
              <Headphones className="size-5 text-[#D4A843]" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4A843] uppercase">
              3rd Gate Music Group
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-4">
            MUSIC <span className="text-[#D4A843]">STORE</span>
          </h1>
          <p className="text-[#888078] max-w-xl text-lg">
            Preview tracks for 30 seconds. Purchase individual MP3s or full albums.
            Support the artists directly.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 text-[#888]">
              <Music className="size-4 text-[#D4A843]" />
              <span>{items.filter((i) => !i.albumId).length} releases</span>
            </div>
            <div className="flex items-center gap-2 text-[#888]">
              <Clock className="size-4 text-purple-400" />
              <span>30s free previews</span>
            </div>
            <div className="flex items-center gap-2 text-[#888]">
              <Download className="size-4 text-green-400" />
              <span>Instant MP3 download</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        {/* Filters */}
        <div className="mb-8">
          <FilterTabs active={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Loading State */}
        {storeItems === undefined && (
          <div className="text-center py-20">
            <Disc3 className="size-12 text-[#D4A843]/30 mx-auto mb-4 animate-spin" style={{ animationDuration: "2s" }} />
            <p className="text-[#888] text-sm">Loading music store...</p>
          </div>
        )}

        {/* Empty State */}
        {storeItems !== undefined && items.length === 0 && (
          <div className="text-center py-20 bg-[#141210]/50 border border-[#2a2622] rounded-2xl">
            <Music className="size-16 text-[#D4A843]/20 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-[#D4A843] tracking-wider mb-3">
              MUSIC COMING SOON
            </h3>
            <p className="text-[#888] max-w-md mx-auto mb-6">
              New tracks and albums are being added to the store. Follow us for drop announcements.
            </p>
            <a
              href="https://www.instagram.com/meadowbrookmontrell"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#E8C767] transition-colors"
            >
              Follow for Drops <ExternalLink className="size-4" />
            </a>
          </div>
        )}

        {/* Albums Section */}
        {filteredAlbums.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-sm text-[#888] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
              <Disc3 className="size-4 text-[#D4A843]" />
              Albums & EPs
            </h2>
            <div className="space-y-6">
              {filteredAlbums.map((album) => (
                <AlbumCard
                  key={album._id}
                  album={album}
                  tracks={albumTracks.filter((t) => t.albumId === album._id)}
                  player={player}
                  onIncrementPlay={handleIncrementPlay}
                />
              ))}
            </div>
          </div>
        )}

        {/* Singles & Beats Grid */}
        {filteredStandalones.length > 0 && (
          <div>
            <h2 className="font-display text-sm text-[#888] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
              <Music className="size-4 text-[#D4A843]" />
              Singles & Beats
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStandalones.map((item) => (
                <TrackCard
                  key={item._id}
                  item={item}
                  player={player}
                  onIncrementPlay={handleIncrementPlay}
                />
              ))}
            </div>
          </div>
        )}

        {/* Merch Cross-sell */}
        <div className="mt-16 text-center bg-[#141210]/50 border border-[#D4A843]/10 rounded-2xl p-12">
          <h3 className="font-display text-2xl text-[#D4A843] tracking-wider mb-3">
            WANT MORE?
          </h3>
          <p className="text-[#888] max-w-md mx-auto mb-6">
            Check out the official merch store for apparel, accessories, and exclusive drops.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1a1816] text-[#D4A843] font-bold text-sm px-6 py-3 rounded-lg border border-[#D4A843]/20 hover:bg-[#D4A843]/10 transition-colors"
          >
            <ShoppingCart className="size-4" /> Visit Merch Store
          </Link>
        </div>
      </div>

      {/* Now Playing Bar */}
      <NowPlayingBar item={currentItem} player={player} />
    </div>
  );
}
