/**
 * TexTage(https://textage.cc/score/index.html?a011B000)から曲一覧を引っ張る
 * DevToolsのコンソールで実行
 * 1. 出力を右クリック -> グローバル変数として保存
 * 2. temp1に保存されるのでcopy(temp1)
 * 3. textage.jsonにペースト
 */

// 曲情報を格納する配列
interface FetchSongInfo {
    title: string
    spl?: string,
    spa?: string,
    sph?: string,
}
const songs: FetchSongInfo[] = [];

const trNodesSnapshot = document.evaluate('/html/body/center/table[1]/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

for (let i = 1; i < trNodesSnapshot.snapshotLength; i++) {
  const trNode = trNodesSnapshot.snapshotItem(i) as HTMLElement;
  const tdNodes = trNode.querySelectorAll("td");
  // table構造に基づいて各難易度のリンクを取得
  const getLink = (td_index: number) => {
    const href = tdNodes[td_index].querySelector("a")?.getAttribute("href");
    return href ? "https://textage.cc/score/"+href : undefined;
  };
  const splLink = getLink(0);
  const spaLink = getLink(1);
  const sphLink = getLink(2);
  
  const titleNode = tdNodes[5];
  try {
    const titleText = titleNode ? titleNode.textContent || "" : "";
    const title = titleText.replace(/[\n\t]/g, "").replace(/\s+/g, " ").trim();
    songs.push({ spl: splLink, spa: spaLink, sph: sphLink, title: title });
  } catch(e) {
    console.log(e);
  }
}

const _textageSongInfos: { [title: string]: { spa?: string, sph?: string } } = {};
songs.forEach(songInfo => {
  const { title, ...rest } = songInfo;
  _textageSongInfos[title] = rest;
});

console.log(_textageSongInfos);
