import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const Options: React.FC = () => {

  return (
    <div>
      test
    </div>
  );
};

createRoot(document.getElementById('options-root') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);