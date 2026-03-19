import React, { useEffect, useState } from "react";
import largeLogo from "../assets/images/logo-large.svg";
import personalBestIcon from "../assets/images/icon-personal-best.svg";

export default function Header({ latestWpm }) {
  const [personalBest, setPersonalBest] = useState(() => {
    return parseInt(localStorage.getItem("personalBest")) || 0;
  });

  useEffect(() => {
    if (latestWpm && latestWpm > personalBest) {
      setPersonalBest(latestWpm);
      localStorage.setItem("personalBest", latestWpm);
    }
  }, [latestWpm]);

  return (
    <header className="w-full py-4 flex justify-between items-center">
      <img className="h-8 w-auto" src={largeLogo} alt="logo" />

      <div className="flex items-center gap-2">
        <img className="h-5 w-5" src={personalBestIcon} alt="trophy" />
        <span className="text-sm font-medium text-neutral-400">
          Personal best:{" "}
          <span className="text-white">
            {personalBest ? `${personalBest} WPM` : "--"}
          </span>
        </span>
      </div>
    </header>
  );
}