import React, { useState, ChangeEvent, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { SongTitleInput } from "./SongTitleInput";
import { AtariRuleSetWithId, getAtariRuleSetAll } from "../storage";

const Popup: React.FC = () => {
  //const [selectedRuleTitle, setSelectedRuleTitle] = useState<string | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string>();
  const [allRules, setAllRules] = useState<AtariRuleSetWithId[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const rules = await getAtariRuleSetAll();
      setAllRules(rules);
    }
    fetch();
  }, []);

  const handleRuleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedRuleId = event.target.value;
    // 選択されたタイトルに対応するルールを検索
    const foundRule = allRules.find(ruleWithid => ruleWithid.rules_id === selectedRuleId);
    if (foundRule === undefined) {
      return;
    }
    setSelectedRuleId(foundRule.rules_id);
  };
  
  const handleHighlightClick = () => {
    const rule = allRules.find(ruleWithId => ruleWithId.rules_id === selectedRuleId);
    if (rule == undefined) return;
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "highlight", rules_id: rule.rules_id});
    })
  };

  return (
    <div>
      <SongTitleInput />
      <select onChange={handleRuleSelect}>
        <option value="">検索ルールを選択</option>
        {allRules.map(rulesWithId => (
          <option key={rulesWithId.rules_id} value={rulesWithId.rules_id}>
            {rulesWithId.ruleset.title}
          </option>
        ))}
      </select>
      <button onClick={handleHighlightClick}>検索ルールでハイライト</button>
    </div>
  );
};

const container = document.getElementById('popup-root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);