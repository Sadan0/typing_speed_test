import { useState, useMemo } from "react";
import Header from "./components/Header";
import TypingText from "./components/TypingText";
import Controls from "./components/Controls";
import texts from "./data/data.json";

export default function HeroSection() {
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("timed");
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [testKey, setTestKey] = useState(0);

  const randomIndex = useMemo(
    () => Math.floor(Math.random() * texts[difficulty].length),
    [difficulty, testKey]
  );

  const currentText = texts[difficulty][randomIndex].text;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRestart = () => {
    setWpm(0);
    setElapsedTime(0);
    setAccuracy(0);
    setIsFinished(false);
    setTestKey((prev) => prev + 1);
  };

  return (
    <section className="mt-6 mx-4">
      <Header latestWpm={wpm} />
      <Controls
        setDifficulty={setDifficulty}
        setMode={setMode}
        mode={mode}
        wpm={wpm}
        time={
          mode === "timed"
            ? formatTime(Math.max(0, 60 - elapsedTime))
            : formatTime(elapsedTime)
        }
        accuracy={accuracy}
        isFinished={isFinished}
      />
      <TypingText
        key={`${difficulty}-${mode}-${testKey}`}
        text={currentText}
        mode={mode}
        onFinished={(calculatedWpm, calculatedAccuracy) => {
          setWpm(calculatedWpm);
          setAccuracy(calculatedAccuracy);
          setIsFinished(true);
        }}
        onTick={(seconds) => setElapsedTime(seconds)}
        onRestart={handleRestart}
      />
    </section>
  );
}