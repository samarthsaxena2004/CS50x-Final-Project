"use client";

import { useEffect, useState } from "react";

export function TimeAlive() {
  const [age, setAge] = useState<string>("");

  useEffect(() => {
    // DOB: 18 March 2004, 10:54 PM
    const birthDate = new Date("2004-03-18T22:54:00"); 

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();
      const yearInMs = 1000 * 60 * 60 * 24 * 365.2425;
      const decimalAge = diff / yearInMs;
      
      setAge(decimalAge.toFixed(9));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Plain text style to match the screenshot exactly
  return (
    <span className="font-mono text-neutral-500 text-sm">
      been here for {age} years
    </span>
  );
}
