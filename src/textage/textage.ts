import data from "./textage.json";

interface TextageSongInfos {
  [title: string]: { spa?: string, sph?: string }
}

const textageSongInfos: TextageSongInfos = data;

export {
  textageSongInfos
}