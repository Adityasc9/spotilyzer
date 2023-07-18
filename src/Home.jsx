import { useActionData } from "react-router-dom";
import "./cssFiles/Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
let accessToken;

function Home() {
  const navigate = useNavigate();

  const getPlaylistId = (playlistLink) => {
    const regex = /playlist\/(\w+)/;
    const matches = playlistLink.match(regex);
    return matches && matches.length > 1 ? matches[1] : null;
  };

  const displayAlert = (message) => {
    const alertContainer = document.getElementById("alertContainer");

    const alertHTML = `<div class="alert alert-warning" role="alert">${message}</div>`;
    alertContainer.innerHTML = alertHTML;
    setTimeout(() => {
      alertContainer.innerHTML = "";
    }, 3000);
  };

  const getAudioFeatures = async (data) => {
    const track_ids = data.tracks.items
      .filter((song) => song.track != null)
      .map((song) => song.track.id);

    let arrs = [];
    for (let x = 0; x < track_ids.length; x++) {
      if (x % 100 == 0) {
        if (x + 100 <= track_ids.length) {
          arrs.push(track_ids.slice(x, x + 100));
        } else {
          arrs.push(track_ids.slice(x));
        }
      }
    }
    let audioFeatures = [];
    for (let arr of arrs) {
      let audioFeaturesSubset = await fetchFeatures(arr);
      audioFeatures.push(...audioFeaturesSubset); // this spreads out the subset insted of adding the entire subset
    }
    return audioFeatures;
  };

  const fetchFeatures = async (arr) => {
    let url =
      "https://api.spotify.com/v1/audio-features?ids=" + arr.join("%2C");
    const dataOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(url, dataOptions);
      const data = await response.json();
      return data.audio_features;
    } catch (error) {
      console.error("Error getting audio features:", error);
      return [];
    }
  };

  const handleClick = async () => {
    let playlistLink = document.getElementById("linkField").value;

    let playlistId = getPlaylistId(playlistLink);
    if (!playlistId) {
      displayAlert("Invalid Link.");
      return;
    }
    loadingContainer.innerHTML = '<div class="lds-dual-ring"></div>';
    try {
      let url =
        "https://api.spotify.com/v1/playlists/" +
        playlistId +
        "?fields=external_urls%2Cimages%2Cname%2Cowner%28display_name%29%2C+tracks%28next%2Ctotal%2Citems%29";

      let data = await getData(url);
      let audioFeatures = await getAudioFeatures(data);
      data.audioFeatures = audioFeatures;
      navigate("/result", { state: { data } });
    } catch (error) {
      displayAlert("Error fetching data. Try disabling Privacy Badger.");
      console.error("Error:", error);
      loadingContainer.innerHTML = "";
    }
  };

  const getData = async (url) => {
    let id = import.meta.env.VITE_SPOTIFY_ID;
    let secret = import.meta.env.VITE_SPOTIFY_SECRET; //hide these
    let credentials = btoa(`${id}:${secret}`);
    let tokenUrl = "https://accounts.spotify.com/api/token";
    const tokenOptions = {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    };
    setTimeout(function () {
      var myDiv = document.getElementById("alertContainer");
      myDiv.textContent = "";
    }, 3000);

    try {
      const response = await fetch(tokenUrl, tokenOptions);
      const tokenData = await response.json();
      accessToken = tokenData.access_token;
      const dataOptions = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      let data = await fetch(url, dataOptions);
      data = await data.json();
      let endpoint = data["tracks"]["next"];
      let allTracks = [];
      const getRemainingItems = async () => {
        while (endpoint) {
          let restData = await fetch(endpoint, dataOptions);
          restData = await restData.json();
          allTracks = allTracks.concat(restData["items"]);
          endpoint = restData["next"];
        }
        allTracks = data["tracks"]["items"].concat(allTracks);
        data["tracks"]["items"] = allTracks;

        return data;
      };
      return getRemainingItems();
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  };

  return (
    <div className="link">
      <div id="alertContainer"></div>
      <label htmlFor="linkField" className="linkText">
        Spotify Playlist Link:
      </label>

      <input
        type="text"
        className="w-75 form-control"
        id="linkField"
        placeholder="link"
      />
      <button
        type="button"
        className="btn btn-outline-light"
        onClick={handleClick}
      >
        Analyze
      </button>
      <div id="loadingContainer"></div>
    </div>
  );
}

export default Home;
