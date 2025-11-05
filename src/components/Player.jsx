import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

// --- Main Player Component ---
// We now accept props to control the player from a global state/context
export default function Player({ songToPlay, onPlayNext, onPlayPrev }) {
  // --- Audio State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(songToPlay || null);
  const [progress, setProgress] = useState(0); // in seconds
  const [duration, setDuration] = useState(0); // in seconds
  const [volume, setVolume] = useState(0.75); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);

  // --- Refs ---
  const audioRef = useRef(null); // Ref for the <audio> element
  const progressBarRef = useRef(null); // Ref for the progress bar for seeking

  // --- Effect to load a new song ---
  useEffect(() => {
    if (songToPlay && audioRef.current) {
      setCurrentSong(songToPlay);
      audioRef.current.src = songToPlay.songUrl; // Assumes song object has 'songUrl'
      audioRef.current.play();
      setIsPlaying(true);
    }
    // Set a default song if none is provided
    else if (!songToPlay && !currentSong) {
      setCurrentSong({
        title: "No track selected",
        artist: "—",
        coverImageUrl: "https://placehold.co/64x64/27272a/71717a?text=Aura",
        songUrl: "",
      });
    }
  }, [songToPlay]);

  // --- Effect for Volume ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // --- Audio Event Handlers ---
  const onTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const onSongEnd = () => {
    setIsPlaying(false);
    if (onPlayNext) {
      onPlayNext();
    } else {
      setProgress(0); // Reset progress if no next song fn
    }
  };

  // --- Control Functions ---
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration) return;
    const { width } = progressBarRef.current.getBoundingClientRect();
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * duration;
    
    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  // --- Utility Functions ---
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || !isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercentage = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* The actual audio element, hidden */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onSongEnd}
      />

      {/* The Visible Player Bar */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl glass rounded-xl p-3 z-50
                   border border-white/10 shadow-xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center gap-4">
          
          {/* Section 1: Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 md:w-1/3">
            <img
              src={currentSong?.coverImageUrl}
              alt={currentSong?.title}
              className="w-14 h-14 rounded-md object-cover flex-shrink-0"
              onError={(e) => e.target.src = 'https://placehold.co/64x64/27272a/71717a?text=Aura'}
            />
            <div className="min-w-0">
              <div className="font-semibold truncate">{currentSong?.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {currentSong?.artist}
              </div>
            </div>
          </div>

          {/* Section 2: Player Controls & Progress */}
          <div className="flex flex-col items-center gap-2 flex-1 md:w-1/3">
            {/* Control Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={onPlayPrev || (() => {})}
                className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-30"
                disabled={!onPlayPrev}
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center
                           shadow-lg shadow-primary/30 transition-transform hover:scale-105"
                disabled={!currentSong?.songUrl}
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              
              <button
                onClick={onPlayNext || (() => {})}
                className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-30"
                disabled={!onPlayNext}
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8">{formatTime(progress)}</span>
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="h-1.5 bg-white/10 rounded-full w-full cursor-pointer overflow-hidden group"
              >
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="h-full bg-primary transition-all duration-75"
                ></div>
              </div>
              <span className="text-xs text-muted-foreground w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Section 3: Volume Control */}
          <div className="hidden md:flex items-center justify-end gap-3 md:w-1/3 group">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-24 h-1 rounded-lg cursor-pointer accent-primary"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}