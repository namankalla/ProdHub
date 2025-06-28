import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.volume = volume;
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(err => console.error("Playback failed:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [isMuted, volume]);
  
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio) return;
    
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * duration;
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg w-full">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="mb-2 text-gray-200 text-sm font-medium">{title}</div>
      
      {/* Waveform visualization (simulated) */}
      <div className="relative h-16 bg-gray-800 rounded-md mb-2 overflow-hidden">
        {/* Generated waveform pattern */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              style={{ 
                height: `${15 + Math.random() * 50}%`,
                opacity: currentTime / duration > i / 40 ? 1 : 0.4
              }}
              className="w-1 mx-0.5 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full"
            />
          ))}
        </div>
        
        {/* Progress overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-transparent pointer-events-none"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
        
        {/* Interactive progress bar */}
        <div 
          ref={progressBarRef}
          className="absolute inset-0 cursor-pointer"
          onClick={handleProgressChange}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <div className="text-xs text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleMute}
            className="text-gray-400 hover:text-white"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
