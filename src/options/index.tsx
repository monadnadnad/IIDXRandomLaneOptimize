import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getMultipleAtariRulesAll } from "../storage";
import { MultipleAtariRules } from "../search";
import { MultipleAtariRulesForm } from "./MultipleAtariRulesForm";

const Options: React.FC = () => {
  const [allRules, setAllRules] = useState<MultipleAtariRules[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const rules = await getMultipleAtariRulesAll();
      setAllRules(rules);
    }
    fetch();
  }, []);

  return (
    <div>
      <ul>
        {allRules.map((data, index) =>
          <MultipleAtariRulesForm multipleAtariRules={data} key={index} />
        )}
      </ul>
    </div>
  );
};

createRoot(document.getElementById('options-root') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);