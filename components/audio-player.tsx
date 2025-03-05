"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Search,
  Info,
  X,
  Volume2,
  VolumeX,
  Music2,
  ListMusic,
  AudioWaveformIcon as Waveform,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Track {
  id: string
  title: string
  url: string
  category: string
  duration: number
}

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Skeleton className="w-64 h-64 rounded-full mb-4" />
      <Skeleton className="w-48 h-8 mb-4" />
      <Skeleton className="w-32 h-6" />
    </div>
  )
}

export default function AudioPlayer() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [showInfo, setShowInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")
  const [isFetchingTracks, setIsFetchingTracks] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [refreshDisplayTracks, setRefreshDisplayTracks] = useState(0) // Added refreshDisplayTracks state
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetchTracks()
  }, [])

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play()
    }
  }, [currentTrack])

  const fetchTracks = async () => {
    setIsFetchingTracks(true)
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/tracks")
      if (!response.ok) {
        throw new Error("Failed to fetch tracks")
      }
      const data = await response.json()
      setTracks(data)
      setRefreshDisplayTracks((prev) => prev + 1) // Added refreshDisplayTracks update
      setIsFetchingTracks(false)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to load tracks. Please try again.")
      setIsFetchingTracks(false)
      setIsLoading(false)
    }
  }

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setIsSidebarOpen(false)
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playNext = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
      if (currentIndex < tracks.length - 1) {
        playTrack(tracks[currentIndex + 1])
      }
    }
  }

  const playPrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
      if (currentIndex > 0) {
        playTrack(tracks[currentIndex - 1])
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {

      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const time = (value[0] / 100) * audioRef.current.duration
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        audioRef.current.volume = 0
        setVolume(0)
      } else {
        audioRef.current.volume = 1
        setVolume(1)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  const filteredTracks = useMemo(() => {
    if (!searchTerm) return tracks
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [tracks, searchTerm])

  const getRandomTracks = (tracks: Track[], count: number): Track[] => {
    const shuffled = [...tracks].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const displayTracks = useMemo(() => getRandomTracks(tracks, 6), [tracks]) // Updated useMemo

  const refreshDisplayTracksOnly = () => {
    // Added refreshDisplayTracksOnly function
    setRefreshDisplayTracks((prev) => prev + 1)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded-xl">{error}</div>
  }

  const groupedTracks: { [key: string]: any } = filteredTracks.reduce(
    (acc, track) => {
      const [mainFolder, subFolder, subSubFolder] = track.category.split("/").map((s) => s.trim())
      if (!acc[mainFolder]) {
        acc[mainFolder] = {}
      }
      if (!acc[mainFolder][subFolder]) {
        acc[mainFolder][subFolder] = {}
      }
      if (!acc[mainFolder][subFolder][subSubFolder]) {
        acc[mainFolder][subFolder][subSubFolder] = []
      }
      acc[mainFolder][subFolder][subSubFolder].push(track)
      return acc
    },
    {} as { [key: string]: any },
  )

  const renderFolder = (folderName: string, content: any, level = 0) => {
    const folderPath = Array(level).fill("").join("/") + folderName
    const isExpanded = expandedFolders.has(folderPath)

    return (
      <div key={folderName} className={`ml-${level * 4}`}>
        <div
          className="flex items-center cursor-pointer hover:bg-accent p-1 rounded"
          onClick={() => toggleFolder(folderPath)}
          role="button"
          tabIndex={0}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${folderName} folder`}
          onKeyPress={(e) => e.key === "Enter" && toggleFolder(folderPath)}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
          <span className={`font-semibold ${level === 0 ? "text-lg" : level === 1 ? "text-md" : "text-sm"}`}>
            {folderName}
          </span>
        </div>
        {isExpanded && (
          <div className="ml-4">
            {Object.entries(content).map(([key, value]) => {
              if (Array.isArray(value)) {
                return (
                  <ul key={key} className="space-y-1">
                    {value.map((track: Track) => (
                      <li
                        key={track.id}
                        className={`p-2 rounded cursor-pointer flex justify-between items-center ${currentTrack?.id === track.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                          }`}
                        onClick={() => playTrack(track)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Play ${track.title}`}
                        onKeyPress={(e) => e.key === "Enter" && playTrack(track)}
                      >
                        <span>{track.title}</span>
                        <span className="text-sm text-muted-foreground">{formatTime(track.duration)}</span>
                      </li>
                    ))}
                  </ul>
                )
              } else {
                return renderFolder(key, value, level + 1)
              }
            })}
          </div>
        )}
      </div>
    )
  }

  const renderSidebar = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          aria-label="Search tracks"
        />
      </div>
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <ListMusic className="size-4" />
            Browse Collection
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-400px)] p-4">
          {Object.entries(groupedTracks).map(([mainFolder, content]) => (
            <div key={mainFolder} className="mb-4">
              <button
                onClick={() => toggleFolder(mainFolder)}
                className="flex items-center gap-2 w-full text-left p-2 hover:bg-accent rounded-lg"
              >
                {expandedFolders.has(mainFolder) ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
                <span className="font-medium">{mainFolder}</span>
              </button>
              {expandedFolders.has(mainFolder) && (
                <div className="ml-4 mt-2 space-y-1">
                  {Object.entries(content).map(([subFolder, tracks]) => (
                    <div key={subFolder}>
                      {Array.isArray(tracks) ? (
                        tracks.map((track) => (
                          <button
                            key={track.id}
                            onClick={() => playTrack(track)}
                            className={cn(
                              "w-full text-left p-2 rounded-lg flex items-center justify-between text-sm",
                              currentTrack?.id === track.id ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                            )}
                          >
                            <span className="truncate">{track.title}</span>
                            <span className="text-xs opacity-70">{formatTime(track.duration)}</span>
                          </button>
                        ))
                      ) : (
                        <div className="ml-4">
                          <button
                            onClick={() => toggleFolder(`${mainFolder}/${subFolder}`)}
                            className="flex items-center gap-2 w-full text-left p-2 hover:bg-accent rounded-lg"
                          >
                            {expandedFolders.has(`${mainFolder}/${subFolder}`) ? (
                              <ChevronDown className="size-3" />
                            ) : (
                              <ChevronRight className="size-3" />
                            )}
                            <span>{subFolder}</span>
                          </button>
                          {expandedFolders.has(`${mainFolder}/${subFolder}`) &&
                            Object.entries(tracks as Object).map(([subSubFolder, subTracks]) => (
                              <div key={subSubFolder} className="ml-4">
                                {Array.isArray(subTracks) &&
                                  subTracks.map((track) => (
                                    <button
                                      key={track.id}
                                      onClick={() => playTrack(track)}
                                      className={cn(
                                        "w-full text-left p-2 rounded-lg flex items-center justify-between text-sm",
                                        currentTrack?.id === track.id
                                          ? "bg-primary text-primary-foreground"
                                          : "hover:bg-accent",
                                      )}
                                    >
                                      <span className="truncate">{track.title}</span>
                                      <span className="text-xs opacity-70">{formatTime(track.duration)}</span>
                                    </button>
                                  ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Music2 className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">ወረብ ከዓመት እስከ ዓመት</h1>
              <p className="text-sm md:text-base text-muted-foreground">Ethiopian Orthodox Church Music Collection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                fetchTracks()
                refreshDisplayTracksOnly()
              }} // Updated onClick handler
              disabled={isFetchingTracks}
              aria-label="Refresh"
            >
              {isFetchingTracks ? <RefreshCw className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowInfo(!showInfo)} aria-label="Info">
              <Info className="size-4" />
            </Button>
            <ThemeToggle />
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                {renderSidebar()}
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {showInfo && (
          <div className="mb-8 rounded-xl bg-primary/5 p-4 md:p-6 border border-primary/10">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold">About This Collection</h2>
                <div className="prose prose-sm dark:prose-invert max-w-2xl">
                  <p>
                    Welcome to the digital archive of "ወረብ ከዓመት እስከ ዓመት" (Wereb from Year to Year), a comprehensive
                    collection of Ethiopian Orthodox Tewahido Church sacred music.
                  </p>
                  <p>
                    This platform provides access to traditional church music, carefully preserved and digitized for
                    educational and spiritual purposes. Each recording represents an important part of Ethiopia's rich
                    religious and cultural heritage.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://esubalew.et"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Developer Website
                  </a>
                  <a
                    href="https://www.ethiopianorthodox.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Source: Ethiopian Orthodox Church
                  </a>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowInfo(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-[350px,1fr] gap-8">
          <div className="hidden md:block">{renderSidebar()}</div>

          <div className="space-y-8">
            {currentTrack ? (
              <div className="rounded-xl border bg-card p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 md:size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Waveform className="size-6 md:size-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold">{currentTrack.title}</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">{currentTrack.category}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
                    <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <span>{formatTime(audioRef.current?.duration || currentTrack.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="outline" size="icon" onClick={playPrevious} aria-label="Previous">
                      <SkipBack className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={togglePlayPause}
                      variant="default"
                      className="size-10 md:size-12 rounded-xl"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="size-4 md:size-6" /> : <Play className="size-4 md:size-6" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={playNext} aria-label="Next">
                      <SkipForward className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      aria-label={volume > 0 ? "Mute" : "Unmute"}
                    >
                      {volume > 0 ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                    </Button>
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                      className="w-20 md:w-24"
                    />
                  </div>
                </div>

                <audio
                  ref={audioRef}
                  src={currentTrack.url}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={playNext}
                />
              </div>
            ) : (
              <div className="rounded-xl border bg-card/50 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="size-12 md:size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Music2 className="size-6 md:size-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">No Track Selected</h2>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Select a track from the collection to start playing
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={cn(
                    "p-4 rounded-xl border bg-card hover:bg-accent/50 text-left transition-colors",
                    currentTrack?.id === track.id && "border-primary",
                  )}
                >
                  <h3 className="font-medium truncate mb-2">{track.title}</h3>
                  <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                    <span className="truncate">{track.category}</span>
                    <span>{formatTime(track.duration)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

