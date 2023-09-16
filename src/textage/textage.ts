import data from "./textage.json";

interface TextageSongInfos {
  [title: string]: { url: string }
}

const textageSongInfos: TextageSongInfos = data;
const textageSongTitles: string[] = Object.keys(textageSongInfos);

export {
  textageSongInfos,
  textageSongTitles
}