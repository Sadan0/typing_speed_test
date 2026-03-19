import React, { useState, useEffect, useRef } from "react";

export default function TypingText({ text, mode, onFinished, onTick, onRestart }) {
  const [typedChars, setTypedChars] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const timerRef = useRef(null);

  const TIMED_LIMIT = 60;
  const isPassageFinished = typedChars.length === text.length;
  const isFinished = isPassageFinished || isTimedOut;

  const calculateResults = (chars, elapsed) => {
    const minutes = elapsed / 60;
    const typedText = chars.join("");
    const words = text.split(" ");

    let charsAccountedFor = 0;
    let wordsTyped = 0;
    let correctWords = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const start = charsAccountedFor;
      const typedWord = typedText.slice(start, start + word.length);

      if (start >= typedText.length) break;

      wordsTyped++;
      if (typedWord === word) correctWords++;

      charsAccountedFor += word.length + 1;
    }

    // ✅ WPM based on correct words only, not all typed words
    const calculatedWpm = correctWords > 0 ? Math.round(correctWords / minutes) : 0;
    const calculatedAccuracy = wordsTyped > 0
      ? Math.round((correctWords / wordsTyped) * 100)
      : 0;

    return { calculatedWpm, calculatedAccuracy };
  };

  // Tick timer
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSeconds(seconds);
        onTick?.(seconds);

        if (mode === "timed" && seconds >= TIMED_LIMIT) {
          clearInterval(timerRef.current);
          setIsTimedOut(true);
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isFinished, mode]);

  // Calculate results on finish
  useEffect(() => {
    if (isFinished && startTime) {
      clearInterval(timerRef.current);
      const elapsed = mode === "timed" ? TIMED_LIMIT : elapsedSeconds;
      const { calculatedWpm, calculatedAccuracy } = calculateResults(typedChars, elapsed);
      setAccuracy(calculatedAccuracy);
      onFinished?.(calculatedWpm, calculatedAccuracy);
    }
  }, [isFinished]);

  // Keydown handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;
      if (e.key.length > 1 && e.key !== "Backspace") return;

      if (e.key === "Backspace") {
        setTypedChars((prev) => prev.slice(0, -1));
        return;
      }

      if (typedChars.length >= text.length) return;

      if (!startTime) setStartTime(Date.now());
      setTypedChars((prev) => [...prev, e.key]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedChars, text, startTime, isFinished]);

  const handleRestart = () => {
    clearInterval(timerRef.current);
    setTypedChars([]);
    setStartTime(null);
    setElapsedSeconds(0);
    setAccuracy(0);
    setIsTimedOut(false);
    onRestart?.();
  };

  const displayWpm = elapsedSeconds > 0 && typedChars.length > 0
    ? calculateResults(typedChars, mode === "timed" ? TIMED_LIMIT : elapsedSeconds).calculatedWpm
    : 0;

  const renderText = () => {
    return text.split("").map((char, i) => {
      let color = "text-neutral-500";
      if (i < typedChars.length) {
        color = typedChars[i] === char ? "text-green-400" : "text-red-500";
      }
      const isCursor = i === typedChars.length && !isFinished;
      return (
        <span key={i} className="relative">
          {isCursor && (
            <span className="absolute -left-0.5 top-0 h-full w-0.5 bg-white animate-blink transition-all duration-150 ease-in-out" />
          )}
          <span className={color}>{char}</span>
        </span>
      );
    });
  };

  return (
    <div className="relative mt-6 mx-8 p-4 border border-neutral-800 rounded-lg">

     
    {isFinished && (
  <div className="absolute inset-0 pt-56 flex flex-col items-center justify-center backdrop-blur-sm bg-neutral-950/70 rounded-lg z-10">
    <div className="flex flex-col items-center justify-center bg-neutral-900/80 border border-neutral-700 rounded-xl px-16 py-10">
      <p className="text-neutral-400 text-base mb-2">
        {isTimedOut ? "Time's up!" : "Finished!"}
      </p>
      <p className="text-white text-7xl font-bold mb-4">{displayWpm} WPM</p>
      <div className="flex gap-10 mb-6">
        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-1">Accuracy</p>
          <p className={`text-2xl font-semibold ${
            accuracy >= 90 ? "text-green-400" : accuracy >= 70 ? "text-yellow-400" : "text-red-500"
          }`}>{accuracy}%</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-1">Time</p>
          <p className="text-2xl font-semibold text-yellow-400">
            {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}
          </p>
        </div>
      </div>
      <button
        className="px-6 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
        onClick={handleRestart}
      >
        Try Again
      </button>
    </div>
  </div>
)}

      <p className="text-3xl leading-relaxed tracking-wide font-mono m-0">
        {renderText()}
      </p>
    </div>
  );
}