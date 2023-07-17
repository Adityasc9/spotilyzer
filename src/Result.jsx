import "./cssFiles/Result.css";
import { useLocation } from "react-router-dom";
import TopArtists from "./TopArtists";
import PlaylistInfo from "./PlaylistInfo";
import TBSongs from "./TBSongs";
import AudioAnalysis from "./AudioAnalysis";

function Result() {
  let state = useLocation().state;
  if (state == null) {
    location.href = "/spotilyzer/";
    alert("Please provide a link before accessing the result page");
    return null;
  }
  const { data } = state;
  let dataList = Analyze(data);
  return (
    <div className="resultContainer">
      <PlaylistInfo data={dataList} />
      <TopArtists data={dataList} />
      <TBSongs data={dataList} />
      <AudioAnalysis data={dataList} />
    </div>
  );
}

function Analyze(data) {
  data.tracks.items.sort(function (a, b) {
    return (
      ((b.track && b.track.popularity) || 0) -
      ((a.track && a.track.popularity) || 0)
    );
  });
  let noExplicit = 0;
  let totalDurationMS = 0;
  let artists = {};
  let toDelete = [];
  for (let index in data.tracks.items) {
    let song = data.tracks.items[index];
    if (song.track != null) {
      totalDurationMS = song.track.duration_ms + totalDurationMS;
      if (song.track.explicit) {
        noExplicit = 1 + noExplicit;
      }
      for (let artist of song.track.artists) {
        let name = artist.name;
        if (name in artists) {
          artists[name]["count"] = artists[name]["count"] + 1;
        } else {
          artists[name] = {
            count: 1,
            link: artist["external_urls"]["spotify"],
          };
        }
      }
    } else {
      toDelete.push(index);
    }
  }

  for (let index of toDelete) {
    data.tracks.items.splice(index, 1);
  }

  let tempoDistribution = {};
  let count = 0;
  let totalDanceability = 0;
  let totalEnergy = 0;
  let totalInstrumentalness = 0;
  let totalLiveness = 0;
  let totalAcousticness = 0;
  let totalSpeechiness = 0;

  for (let song of data.audioFeatures) {
    if (song != null) {
      count += 1;
      totalAcousticness += song.acousticness;
      totalDanceability += song.danceability;
      totalEnergy += song.energy;
      totalInstrumentalness += song.instrumentalness;
      totalSpeechiness += song.speechiness;
      totalLiveness += song.liveness;

      let tempo = Math.round(song.tempo);
      if (tempo in tempoDistribution) {
        tempoDistribution[tempo] = tempoDistribution[tempo] + 1;
      } else {
        tempoDistribution[tempo] = 1;
      }
    }
  }
  let interval = 10;
  let tempoRanges = {};
  for (let tempo in tempoDistribution) {
    let freq = tempoDistribution[tempo];
    let range = Math.floor(tempo / interval) * interval;
    if (range in tempoRanges) {
      tempoRanges[range] += freq;
    } else {
      tempoRanges[range] = freq;
    }
  }

  let topArtists = getTopKeys(artists);
  let ret = {
    liveness: totalLiveness / count,
    danceability: totalDanceability / count,
    speechiness: totalSpeechiness / count,
    instrumentalness: totalInstrumentalness / count,
    energy: totalEnergy / count,
    acousticness: totalAcousticness / count,
    tempos: tempoRanges,
    link: data.external_urls.spotify,
    name: data.name,
    owner: data.owner.display_name,
    picture: data.images[0].url,
    explicit: noExplicit,
    total: data.tracks.total,
    duration: totalDurationMS,
    top10: data.tracks.items.slice(0, 10),
    bottom10: data.tracks.items.slice(-10),
    topArtists: topArtists,
  };
  return ret;
}

function getTopKeys(obj) {
  let entries = Object.entries(obj);
  entries.sort((a, b) => b[1].count - a[1].count);
  let topKeys = entries.slice(0, 8);
  return topKeys;
}
export default Result;
