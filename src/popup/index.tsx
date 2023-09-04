import React, { useState, ChangeEvent } from "react";
import { createRoot } from "react-dom/client";
import { defaultAtariRules } from "../search";
import { SongTitleInput } from "./SongTitleInput";

const Popup: React.FC = () => {
  const [selectedRuleTitle, setSelectedRuleTitle] = useState<string | null>(null);
    
  const handleRuleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedRuleTitle = event.target.value;
    // 選択されたタイトルに対応するルールを検索
    const foundRuleTitle = defaultAtariRules.find((r) => r.title === selectedRuleTitle)?.title;
    if (foundRuleTitle == undefined) {
      setSelectedRuleTitle(null);
      return;
    }
    setSelectedRuleTitle(foundRuleTitle);
  };
  
  const handleHighlightClick = () => {
    const rule = defaultAtariRules.find((r) => r.title === selectedRuleTitle);
    if (rule == undefined) return;
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "highlight", ruleTitle: rule.title!});
    })
  };

  return (
    <div>
      <SongTitleInput />
      <select onChange={handleRuleSelect}>
        <option value="">検索ルールを選択</option>
        {defaultAtariRules.map((rule) => (
          <option key={rule.title} value={rule.title}>
            {rule.title}
          </option>
        ))}
      </select>
      <button onClick={handleHighlightClick}>検索ルールでハイライト</button>
    </div>
  );
};

createRoot(document.getElementById('popup-root') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);