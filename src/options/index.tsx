import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AtariRuleSetWithId,
  addAtariRuleSet,
  deleteAtariRuleSet,
  getAtariRuleSetAll,
  setAtariRuleSet,
  testInitStorage,
} from "../storage";
import { AtariRuleSet } from "../search";
import { AtariRuleSetForm } from "./AtariRuleSetForm";

const Options: React.FC = () => {
  const [allRules, setAllRules] = useState<AtariRuleSetWithId[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const rules = await getAtariRuleSetAll();
      setAllRules(rules);
    };
    fetch();
  }, []);

  const onSubmit = async (rule: AtariRuleSet, rules_id: string | undefined) => {
    if (rules_id) {
      setAtariRuleSet(rules_id, rule);
    } else {
      addAtariRuleSet(rule);
    }
    const newRules = await getAtariRuleSetAll();
    setAllRules(newRules);
  };

  const handleAddRules = async () => {
    const rules = new AtariRuleSet([], "");
    addAtariRuleSet(rules);
    const newRules = await getAtariRuleSetAll();
    setAllRules(newRules);
  };

  const handleDeleteRules = async (rules_id: string) => {
    deleteAtariRuleSet(rules_id);
    const newRules = await getAtariRuleSetAll();
    setAllRules(newRules);
  };

  const handleInitStorage = async () => {
    testInitStorage();
    const newRules = await getAtariRuleSetAll();
    setAllRules(newRules);
  };

  return (
    <div>
      <ul>
        {allRules.map((data, index) => (
          <li key={data.rules_id}>
            <AtariRuleSetForm
              key={index}
              atariRuleSet={data.ruleset}
              rules_id={data.rules_id}
              onSubmit={onSubmit}
            />
            <button type="button" onClick={() => handleDeleteRules(data.rules_id)}>
              ルールを削除
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleInitStorage}>デフォルトルールを追加</button>
      <button onClick={handleAddRules}>ルールを追加</button>
    </div>
  );
};

const container = document.getElementById("options-root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
