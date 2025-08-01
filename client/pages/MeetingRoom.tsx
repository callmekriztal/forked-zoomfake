import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  Phone,
  Users,
  MoreHorizontal,
} from "lucide-react";

interface ChatMessage {
  id: number;
  message: string;
  timestamp: Date;
}

export default function MeetingRoom() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [productivity, setProductivity] = useState(100);
  const [petPosition, setPetPosition] = useState({ x: 50, y: 50 });
  const [petMood, setPetMood] = useState("😊");
  const [showProductivityAlert, setShowProductivityAlert] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fake participant data
  const participants = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Carol Davis",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David Wilson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Random emoji generator
  const getRandomEmoji = () => {
    const emojis = [
      "😂", "🤣", "😭", "💀", "🔥", "✨", "🎉", "🤯", "🙄", "😴",
      "🤔", "🥴", "🤢", "👻", "🤖", "👽", "🦄", "🐸", "🍕", "☕",
      "🚀", "💣", "⚡", "🌈", "🎭", "🎪", "🎨", "🎯", "🎲", "🎮"
    ];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Funny random message generator
  const getRandomFunnyMessage = () => {
    const funnyMessages = [
      "Please leave the meeting now.",
      "Your connection seems unstable.",
      "Can everyone mute their microphones?",
      "We're experiencing technical difficulties.",
      "Please rejoin the meeting.",
      "The meeting will end in 5 minutes.",
      "Your audio is cutting out.",
      "Can you hear us clearly?",
      // New funny messages
      "Is someone eating chips? I can hear the crunch through dimensions.",
      "Your cat is more professional than most attendees.",
      "I think your camera is showing your soul leaving your body.",
      "Error 404: Meeting enthusiasm not found.",
      "Warning: Dad jokes detected in audio stream.",
      "Your background is more interesting than this presentation.",
      "I'm not saying you're muted, but even your pet stopped listening.",
      "Breaking news: Local person discovers mute button after 45 minutes.",
      "Your WiFi is weaker than my will to live right now.",
      "Plot twist: This meeting could have been an email.",
      "I see you're practicing your 'listening face' - very convincing.",
      "Fun fact: Staring at your screen won't make this end faster.",
      "Your mic quality suggests you're calling from the Mariana Trench.",
      "Achievement unlocked: Master of awkward silence.",
      "I'm getting strong 'Tuesday energy' from everyone today.",
      "Your video is pixelated but your confusion is crystal clear.",
      "Someone's connection is sponsored by carrier pigeons.",
      "I think we lost Kevin to the void again.",
      "Your camera angle suggests you're either very tall or very small.",
      "The meeting gremlins are at it again.",
      "I'm 67% sure someone is secretly playing video games.",
      "Your background music is very... interpretive.",
      "Warning: Existential crisis detected in participant grid.",
      "I think your internet is powered by hamsters on wheels.",
      "Your face says 'yes' but your eyes say 'why me?'",
      "Breaking: Local meeting achieves new levels of chaos.",
      "I'm not saying this is cursed, but my coffee turned cold by itself.",
      "Your connection is more unstable than my life choices.",
      "Fun fact: 73% of meeting time is spent saying 'can you hear me?'",
      "I think someone's mic is possessed by the spirit of feedback.",
      "Your video quality suggests you're beaming in from 1995.",
      "Achievement: Successfully confused everyone simultaneously.",
      "Plot armor activated: Still somehow in this meeting.",
      "Your internet speed is brought to you by dial-up nostalgia.",
      "I see someone mastered the art of looking busy while spacing out.",
      "Warning: Meeting black hole detected. Productivity may be lost.",
      "Your audio is cutting out like my patience.",
      "I think we're all just NPCs in someone else's work nightmare.",
      "Breaking: Person discovers camera was off for entire presentation.",
      "Your connection has the stability of a house of cards in a tornado.",
      "Fun fact: This meeting has achieved legendary meme status.",
      "I'm getting strong 'help me' vibes from someone's camera angle.",
    ];

    const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    const emoji1 = getRandomEmoji();
    const emoji2 = getRandomEmoji();

    // Random formats for more variety
    const formats = [
      `${emoji1} ${message}`,
      `${message} ${emoji1}`,
      `${emoji1} ${message} ${emoji2}`,
      `${message}`,
      `${emoji1}${emoji2} ${message}`,
      `${message} ${emoji1}${emoji2}`,
    ];

    return formats[Math.floor(Math.random() * formats.length)];
  };

  // Initialize webcam and audio
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Set up audio analysis
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start audio monitoring
        const monitorAudio = () => {
          if (analyserRef.current && !isMuted) {
            const dataArray = new Uint8Array(
              analyserRef.current.frequencyBinCount,
            );
            analyserRef.current.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average);
          } else {
            setAudioLevel(0);
          }
          requestAnimationFrame(monitorAudio);
        };

        monitorAudio();
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isMuted]);

  // Chat message generator
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage = getRandomFunnyMessage();
      const newMessage: ChatMessage = {
        id: Date.now(),
        message: randomMessage,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, newMessage].slice(-10)); // Keep last 10 messages

      // Text-to-speech if muted (remove emojis for TTS)
      if (isMuted && "speechSynthesis" in window) {
        const cleanMessage = randomMessage.replace(/[^\w\s.,!?-]/g, ''); // Remove emojis for TTS
        const utterance = new SpeechSynthesisUtterance(cleanMessage);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMuted]);

  // Useless Feature #1: Meeting Productivity Meter (completely fake and pointless)
  useEffect(() => {
    const interval = setInterval(() => {
      setProductivity(prev => {
        const randomChange = Math.random() * 10 - 5; // Random change between -5 and +5
        const newProductivity = Math.max(0, Math.min(100, prev + randomChange));

        // Show annoying alert when productivity is "low"
        if (newProductivity < 30 && Math.random() < 0.3) {
          setShowProductivityAlert(true);
          setTimeout(() => setShowProductivityAlert(false), 3000);
        }

        return newProductivity;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Useless Feature #2: Virtual Meeting Pet (serves absolutely no purpose)
  useEffect(() => {
    const interval = setInterval(() => {
      // Random pet movement
      setPetPosition(prev => ({
        x: Math.max(5, Math.min(95, prev.x + (Math.random() * 20 - 10))),
        y: Math.max(5, Math.min(95, prev.y + (Math.random() * 20 - 10)))
      }));

      // Random mood changes
      const moods = ["😊", "😴", "🤔", "🥱", "😵‍💫", "🤪", "😎", "🤯", "😤", "🙃"];
      setPetMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Video distortion effect based on audio level
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    const applyDistortion = () => {
      if (!ctx || !video || video.readyState < 2) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Base image
      ctx.drawImage(video, 0, 0);

      // Apply distortion based on audio level
      if (audioLevel > 30) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Pixelation effect
        const pixelSize = Math.floor(audioLevel / 10);
        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }

      requestAnimationFrame(applyDistortion);
    };

    applyDistortion();
  }, [audioLevel]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Left side - User's video */}
        <div className="flex-1 relative bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            {isCameraOn ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                  style={{ display: audioLevel > 30 ? "none" : "block" }}
                />
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                  style={{ display: audioLevel > 30 ? "block" : "none" }}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-white text-lg">Camera is off</p>
                </div>
              </div>
            )}
          </div>

          {/* User name overlay */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              You {isMuted && <MicOff className="inline h-3 w-3 ml-1" />}
            </div>
          </div>

          {/* Audio level indicator */}
          {!isMuted && audioLevel > 10 && (
            <div className="absolute top-4 left-4">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${Math.min(audioLevel * 2, 100)}px` }}
              />
            </div>
          )}
        </div>

        {/* Right side - Participants grid */}
        <div className="w-1/2 p-4 grid grid-cols-2 gap-4">
          {participants.map((participant) => (
            <Card
              key={participant.id}
              className="relative bg-gray-800 border-gray-700 overflow-hidden"
            >
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 left-2">
                <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {participant.name}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full h-12 w-12 p-0"
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isCameraOn ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleCamera}
            className="rounded-full h-12 w-12 p-0"
          >
            {isCameraOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowChat(!showChat)}
            className="rounded-full h-12 w-12 p-0 relative"
          >
            <MessageCircle className="h-5 w-5" />
            {chatMessages.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {chatMessages.length}
              </div>
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full h-12 w-12 p-0"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full h-12 w-12 p-0"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-full h-12 w-12 p-0 ml-8"
            onClick={() => (window.location.href = "/")}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Useless Feature #1: Fake Productivity Meter */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 min-w-64">
        <div className="text-white text-sm font-semibold mb-2 flex items-center">
          📊 Meeting Productivity
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            productivity > 70 ? 'bg-green-600' : productivity > 40 ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            {productivity.toFixed(1)}%
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              productivity > 70 ? 'bg-green-500' : productivity > 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${productivity}%` }}
          />
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <div>Attention Score: {(Math.random() * 100).toFixed(1)}%</div>
          <div>Engagement Level: {(Math.random() * 100).toFixed(1)}%</div>
          <div>Focus Index: {(Math.random() * 100).toFixed(1)}%</div>
          <div className="text-yellow-400 text-xs italic">
            *Totally scientific measurements 🧪
          </div>
        </div>
      </div>

      {/* Productivity Alert (Useless Notification) */}
      {showProductivityAlert && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded-lg border-2 border-red-400 shadow-2xl z-50 animate-pulse">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️ PRODUCTIVITY ALERT ⚠️</div>
            <div className="text-lg mb-2">Your meeting productivity is dangerously low!</div>
            <div className="text-sm">Try looking more engaged (this won't actually help)</div>
            <div className="text-xs mt-2 text-red-200">*This measurement is completely meaningless</div>
          </div>
        </div>
      )}

      {/* Useless Feature #2: Virtual Meeting Pet */}
      <div
        className="absolute w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl transition-all duration-1000 cursor-pointer hover:scale-110 shadow-lg z-40"
        style={{
          left: `${petPosition.x}%`,
          top: `${petPosition.y}%`,
          animation: 'bounce 2s infinite'
        }}
        onClick={() => {
          // Clicking the pet does absolutely nothing useful
          const responses = [
            "Pet is happy! (This accomplishes nothing)",
            "Pet says: Focus on the meeting! (Ironic advice)",
            "Pet is confused by your productivity score",
            "Pet thinks meetings are weird human rituals",
            "Pet suggests more snacks during meetings"
          ];
          alert(responses[Math.floor(Math.random() * responses.length)]);
        }}
      >
        {petMood}
      </div>

      {/* Chat overlay */}
      {showChat && (
        <div className="absolute top-4 right-4 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Chat</h3>
          </div>
          <div className="p-4 max-h-60 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <div className="text-gray-400 text-xs">
                  System • {msg.timestamp.toLocaleTimeString()}
                </div>
                <div className="text-white mt-1">{msg.message}</div>
              </div>
            ))}
            {chatMessages.length === 0 && (
              <div className="text-gray-400 text-sm">No messages yet...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
