import React from "react";

export default function Controls({ setDifficulty, setMode, mode, wpm, time, accuracy, isFinished }) {
  const activeBtnClass = "px-3 py-1 text-xs text-white bg-gray-700 transition-colors";
  const inactiveBtnClass = "px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-gray-700 transition-colors";

  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-800">
      <div className="flex items-center">
        <div className="pr-4 border-r border-neutral-800">
          <span className="text-sm text-neutral-400">WPM: </span>
          <span className="text-sm font-semibold text-white">
            {isFinished ? wpm : "--"}
          </span>
        </div>
        <div className="px-4 border-r border-neutral-800">
          <span className="text-sm text-neutral-400">Accuracy: </span>
          <span className={`text-sm font-semibold ${
            !isFinished
              ? "text-neutral-400"
              : accuracy >= 90
              ? "text-green-400"
              : accuracy >= 70
              ? "text-yellow-400"
              : "text-red-500"
          }`}>
            {isFinished ? `${accuracy}%` : "--"}
          </span>
        </div>
        <div className="pl-4">
          <span className="text-sm text-neutral-400">Timer: </span>
          <span className="text-sm font-semibold text-yellow-400">
            {isFinished ? time : mode === "timed" ? "1:00" : "0:00"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex border-r border-neutral-800 items-center gap-2 pr-4">
          <span className="text-sm text-neutral-400">Difficulty:</span>
          <div className="flex items-center border border-gray-700 rounded overflow-hidden">
            <button
              className={inactiveBtnClass}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </button>
            <button
              className={`${inactiveBtnClass} border-x border-gray-600`}
              onClick={() => setDifficulty("medium")}
            >
              Medium
            </button>
            <button
              className={inactiveBtnClass}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Mode:</span>
          <div className="flex items-center border border-gray-700 rounded overflow-hidden">
            <button
              className={`${mode === "timed" ? activeBtnClass : inactiveBtnClass} border-r border-gray-600`}
              onClick={() => setMode("timed")}
            >
              Timed (60s)
            </button>
            <button
              className={mode === "passage" ? activeBtnClass : inactiveBtnClass}
              onClick={() => setMode("passage")}
            >
              Passage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}