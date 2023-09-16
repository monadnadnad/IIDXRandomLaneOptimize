import { textageSongInfos } from "./textage/textage";
import {
  AtariRule,
  RandomLaneTicket,
  searchAtariTicket,
} from "./search";
import { getAtariRuleSetById } from "./storage";


/**
 * 公式サイトの各チケットを扱うための情報
 */
interface TicketInfo {
  laneText: RandomLaneTicket;
  node: HTMLElement;
}

/**
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
const getTicketsFromHTML = (): TicketInfo[] => {
  const ticketListContainer = document.getElementById("ticket-list")!;
  const ticketULs = ticketListContainer.querySelectorAll("ul.inner");

  const ticketInfos: TicketInfo[] = [];

  // 最初のli（配置情報）だけを取得して配列に追加、最初のulはヘッダーなのでとばす
  for (let i = 1; i < ticketULs.length; i++) {
    const ticketUL = ticketULs[i] as HTMLElement;
    const laneTextNode = ticketUL.querySelector("li")!;
    const laneText = laneTextNode.textContent!.trim();
    ticketInfos.push({
      laneText: laneText,
      node: ticketUL
    });
  }
  
  return ticketInfos;
}

const highlightAtariTickets = (tickets: TicketInfo[], rule: AtariRule) => {
  const atariLaneTexts = searchAtariTicket(rule, tickets.map(ticket => ticket.laneText));

  atariLaneTexts.forEach(atariLaneText => {
    const atariTicketInfo = tickets.find(ticketInfo => ticketInfo.laneText === atariLaneText);
    if (atariTicketInfo) {
      atariTicketInfo.node.style.backgroundColor = "yellow";
    }
  });
}

const highlightReset = (tickets: TicketInfo[]) => {
  tickets.forEach((ticket) => {
    ticket.node.style.backgroundColor = "#fff";
  });
}

const addTextageLink = (tickets: TicketInfo[], songTitle: string) => {
  const fumen_url = makeFumenURL(songTitle);
  if (!fumen_url) throw new Error(`譜面URLが作成できない: ${songTitle}`);
  tickets.forEach((ticket) => {
    const textageLink = ticket.node.querySelector("li.textage")!;
    const link = textageLink.querySelector("a")!;
    link.href = makeRandomURL(fumen_url, ticket.laneText);
    link.textContent = `${songTitle}`;
  });
}


const makeFumenURL = (songTitle: string): string | null => {
  if (songTitle in textageSongInfos) {
    const url = textageSongInfos[songTitle].url;
    return url;
  }
  return null;
}

const makeRandomURL = (fumen_url: string, lane: RandomLaneTicket): string => {
  return fumen_url + "R0" + lane + "01234567";
}



// Listener
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.message) {
    case "link":
      console.log(message);
      addTextageLink(getTicketsFromHTML(), message.songTitle);
      break
    case "highlight":
      console.log(message);
      const rule = await getAtariRuleSetById(message.rules_id);
      highlightReset(getTicketsFromHTML());
      highlightAtariTickets(getTicketsFromHTML(), rule.ruleset);
  }
});

// ページ読み込み後のDOM編集
window.onload = () => {
  const ticketListContainer = document.getElementById("ticket-list");
  const ticketULs = ticketListContainer?.querySelectorAll("ul.inner");
  if (ticketULs === undefined) return;

  // ヘッダーで列を増やす
  const headerUL = ticketULs[0] as HTMLElement;
  const newHeaderLi = document.createElement("li");
  newHeaderLi.textContent = "Textage";
  headerUL.appendChild(newHeaderLi);
  // 各行にliを追加
  for (let i = 1; i < ticketULs.length; i++) {
    const ticketUL = ticketULs[i] as HTMLElement;
    const newTextageLi = document.createElement("li");
    newTextageLi.classList.add("textage");
    newTextageLi.appendChild(document.createElement("a"));
    ticketUL.appendChild(newTextageLi);
  }
};