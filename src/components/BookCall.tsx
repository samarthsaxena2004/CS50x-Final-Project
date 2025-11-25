// src/components/BookCall.tsx
'use client';

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function BookCall() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      // Configure the UI of the modal
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } }, // Change #000000 to your brand color
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <button
      // REPLACE 'your-username' with your actual Cal.com username (e.g., samarth-saxena)
      // If you want them to pick between 15 or 30 min, link to your root username.
      // If you want a specific event, use "your-username/15min"
      data-cal-link="samarthsaxena" 
      data-cal-config='{"layout":"month_view"}'
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out shadow-md"
    >
      Schedule a Call
    </button>
  );
}
