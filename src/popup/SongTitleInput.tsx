import React, { useState, BaseSyntheticEvent } from "react";
import Autosuggest from "react-autosuggest";
import { textageSongTitles } from "../textage/textage";


const getSuggestions = (value: string): string[] => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputValue.length === 0
    ? []
    : textageSongTitles.filter((title) => title.toLowerCase().slice(0, inputLength) === inputValue);
};

export const SongTitleInput = () => {
  const [songTitle, setSongTitle] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: BaseSyntheticEvent, { newValue }: { newValue: string }) => {
    if (event) setSongTitle(newValue);
  };

  const handleAddLinkClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "link", songTitle: songTitle });
    })
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    const suggestions: string[] = getSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const getSuggestionValue = (suggestion: string): string => suggestion;

  const renderSuggestion = (suggestion: string) => (<p>{suggestion}</p>);

  const inputProps = {
    placeholder: "曲名を入力してください",
    value: songTitle,
    onChange: handleInputChange
  };

  return (
    <div>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <button onClick={handleAddLinkClick}>Textageリンクを追加</button>
    </div>
  );
}