import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  MultipleAtariRulesWithId,
  addMultipleAtariRules,
  deleteMultipleAtariRules,
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

  const handleDeleteRules = async (rules_id: string) => {
    deleteMultipleAtariRules(rules_id);
    const newRules = await getMultipleAtariRulesAll();
    setAllRules(newRules);
  }

  const handleInitStorage = async () => {
    testInitStorage();
    const newRules = await getMultipleAtariRulesAll();
    setAllRules(newRules);
  }

  return (
    <div>
      <ul>
        {allRules.map((data, index) =>
          <li key={data.rules_id}>
            <MultipleAtariRulesForm
              key={index}
              multipleAtariRules={data.rules}
              rules_id={data.rules_id}
              onSubmit={onSubmit}
            />
            <button
              type="button"
              onClick={() => handleDeleteRules(data.rules_id)}
            >
              ルールを削除
            </button>
          </li>
        )}
      </ul>
      <button onClick={handleInitStorage}>
        デフォルトルールを追加
      </button>
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