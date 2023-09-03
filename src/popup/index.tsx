import React, { useState, ChangeEvent } from "react";
import { createRoot } from "react-dom/client";
import { defaultAtariRules } from "../search";

const Popup: React.FC = () => {
  const [songTitle, setSongTitle] = useState<string>("");
  const [selectedRuleTitle, setSelectedRuleTitle] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSongTitle(event.target.value);
  };
  
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
  
  const handleAddLinkClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "link", songTitle: songTitle });
    })
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
      <input
        type="text"
        placeholder="曲名を入力してください"
        value={songTitle}
        onChange={handleInputChange}
      />
      <button onClick={handleAddLinkClick}>Textageリンクを追加</button>
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