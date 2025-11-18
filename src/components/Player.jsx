import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

export default function Player({ songToPlay, onPlayNext, onPlayPrev }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(songToPlay || null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.78);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (songToPlay && audioRef.current) {
      setCurrentSong(songToPlay);
      audioRef.current.src = songToPlay.songUrl || "";
      if (audioRef.current.src) {
        audioRef.current.play().catch(()=>{});
        setIsPlaying(true);
      }
    }
  }, [songToPlay]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const onTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };
  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration || 0);
  };
  const onSongEnd = () => {
    setIsPlaying(false);
    if (onPlayNext) onPlayNext();
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(()=>{});
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration || !audioRef.current) return;
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(width, e.clientX - left));
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (t) => {
    if (!t || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMetadata} onEnded={onSongEnd} />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed left-1/2 -translate-x-1/2 bottom-[20px] z-50 w-[95%] max-w-4xl player-glow"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        <div className="glass rounded-2xl p-3 md:p-4 border border-white/6 flex items-center gap-4">
          {/* Left: cover + track */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentSong?.coverImageUrl}
              alt={currentSong?.title}
              className="w-12 h-12 rounded-md object-cover"
              onError={(e)=> (e.currentTarget.src="https://placehold.co/64x64/27272a/71717a?text=A")}
            />
            <div className="min-w-0">
              <div className="font-semibold truncate-ellipsis">{currentSong?.title}</div>
              <div className="text-sm text-muted truncate-ellipsis">{currentSong?.artist}</div>
            </div>
          </div>

          {/* Middle: controls + progress */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button onClick={onPlayPrev || (()=>{})} className="text-muted hover:text-white disabled:opacity-40">
                <SkipBack size={20}/>
              </button>

              <div className="play-outer">
                <button onClick={togglePlayPause} className="play-center">
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>

              <button onClick={onPlayNext || (()=>{})} className="text-muted hover:text-white disabled:opacity-40">
                <SkipForward size={20}/>
              </button>
            </div>

            <div className="w-full flex items-center gap-3">
              <span className="text-xs text-muted hidden sm:block w-10 text-right">{formatTime(progress)}</span>

              <div ref={progressBarRef} onClick={handleSeek} className="h-1.5 bg-white/8 rounded-full w-full cursor-pointer relative">
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #36ead0, #4B6FF5)" }} />
              </div>

              <span className="text-xs text-muted hidden sm:block w-10 text-left">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: volume */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={()=> setIsMuted(m=>!m)} className="text-muted hover:text-white">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e)=>{ setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }} className="w-28" />
          </div>
        </div>
      </motion.div>
    </>
  );
}
