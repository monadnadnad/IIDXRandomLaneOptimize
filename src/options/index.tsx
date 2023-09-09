import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  MultipleAtariRulesWithId,
  addMultipleAtariRules,
  getMultipleAtariRulesAll,
  setMultipleAtariRules,
  testInitStorage
} from "../storage";
import { MultipleAtariRules } from "../search";
import { MultipleAtariRulesForm } from "./MultipleAtariRulesForm";

const Options: React.FC = () => {
  const [allRules, setAllRules] = useState<MultipleAtariRulesWithId[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const rules = await getMultipleAtariRulesAll();
      setAllRules(rules);
    }
    fetch();
  }, []);

  const onSubmit = async (rule: MultipleAtariRules, rules_id: string | undefined) => {
    if (rules_id) {
      setMultipleAtariRules(rules_id, rule);
    } else {
      addMultipleAtariRules(rule);
    }
    const newRules = await getMultipleAtariRulesAll();
    setAllRules(newRules);
  }

  const handleAddRules = async () => {
    const rules = new MultipleAtariRules([], "");
    addMultipleAtariRules(rules);
    const newRules = await getMultipleAtariRulesAll();
    setAllRules(newRules);
  }

  return (
    <div>
      <ul>
        {allRules.map((data, index) =>
          <MultipleAtariRulesForm
            key={index}
            multipleAtariRules={data.rules}
            rules_id={data.rules_id}
            onSubmit={onSubmit}
          />
        )}
      </ul>
      <button onClick={testInitStorage}>Init</button>
      <button onClick={handleAddRules}>
        ルールを追加
      </button>
    </div>
  );
};

createRoot(document.getElementById('options-root') as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);