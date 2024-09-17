import data from "./textage.json";

interface TextageSongInfos {
  [title: string]: { url: string };
}

export const textageSongInfos: TextageSongInfos = data;
export const textageSongTitles: string[] = Object.keys(textageSongInfos);

export const makeTextageURL = (
  laneText: string,
  songTitle: string,
  playerSide: "1P" | "2P",
  hispeed: number
) => {
  const songURL = textageSongInfos[songTitle]?.url;
  if (!songURL) {
    throw new Error("Invalid song title");
  }
  // パラメータがtextage独自形式
  const [urlStem, defaultParam] = songURL.split("?");

  const player = playerSide === "1P" ? "1" : "2";
  const params = `${player}${defaultParam.slice(1)}R0${laneText}01234567=${hispeed}`;
  const url = `${urlStem}?${params}`;
  console.log(url);

  return url;
};
