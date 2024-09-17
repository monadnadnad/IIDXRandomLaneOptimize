import React from "react";
import { createRoot } from "react-dom/client";
import { Ticket } from "./ticket";
import Tool from "./Components/Tool";

/**
 * チケットリストの要素からチケット情報を抽出する
 * @param element チケットリストのDOM要素
 * @returns 抽出されたチケット情報の配列
 *
 * DOMの構造:
 * <div id="ticket-list">
 *   <ul class="head inner">（li3つ）</ul><!-- ヘッダー -->
 *   <ul class="inner">
 *     <li>（配置）</li>
 *     <li>（期限）</li>
 *     <li>（リサイクルチェックボックス）</li>
 *   </ul>
 *   <!-- 他のul要素も同様 -->
 * </div>
 */
export const extractTicketsFromDOM = (element: HTMLElement): Ticket[] => {
  const ticketULs = Array.from(element.querySelectorAll("ul.inner"));

  return ticketULs.slice(1).map((ticketUL) => {
    const laneTextNode = ticketUL.querySelector("li")!;
    const laneText = laneTextNode.textContent!.trim();
    const expirationNode = ticketUL.querySelector("li:nth-child(2)")!;
    const expiration = expirationNode.textContent!.trim();

    return {
      laneText,
      expiration,
    };
  });
};

window.onload = () => {
  const ticketListContainer = document.getElementById("ticket-list");
  if (!ticketListContainer) {
    console.log("チケット一覧が見つからない");
    return;
  }

  const tickets = extractTicketsFromDOM(ticketListContainer);

  const toolContainer = document.createElement("div");
  toolContainer.id = "tool-root";
  ticketListContainer.insertAdjacentElement("beforebegin", toolContainer);
  const root = createRoot(toolContainer);
  root.render(React.createElement(Tool, { tickets }));
};
