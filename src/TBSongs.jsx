import "./cssFiles/TBSongs.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function TBSongs(props) {
  let labels = [];
  let popularity = [];
  for (let song of props.data.top10) {
    labels.push(song.track.artists[0].name + ": " + song.track.name);
    popularity.push(song.track.popularity);
  }
  let bottomLabels = [];
  let bottomPopularity = [];
  for (let song of props.data.bottom10) {
    bottomLabels.push(song.track.artists[0].name + ": " + song.track.name);
    if (song.track.popularity == 0) {
      bottomPopularity.push(1);
    } else {
      bottomPopularity.push(song.track.popularity);
    }
  }

  const topState = {
    labels: labels,
    datasets: [
      {
        label: "Popularity",
        backgroundColor: "rgba(102,30,50,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: popularity,
      },
    ],
  };
  const bottomState = {
    labels: bottomLabels,
    datasets: [
      {
        label: "Popularity",
        backgroundColor: "rgba(102,30,50,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: bottomPopularity,
      },
    ],
  };
  const topOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { color: "white", beginAtZero: true, font: { size: 15  } },
      },
      x: {
        min: 0,
        max: 100,
        ticks: { color: "white", beginAtZero: true, font: { size: 15 } },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: "Most popular songs",
        color: "white",
        font: { size: 20 },
      },
    },
  };
  const bottomOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          color: "white",
          beginAtZero: true,
          suggestedMax: 100,
          font: { size: 15 },
        },
      },
      x: {
        min: 0,
        max: 100,
        ticks: {
          color: "white",
          beginAtZero: true,
          suggestedMax: 100,
          font: { size: 15 },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: "Least popular songs",
        color: "white",
        font: { size: 20 },
      },
    },
  };

  return (
    <div className="TBSongsContainer">
      <h1
        style={{
          color: "white",
          fontFamily: "Georgia",
          fontSize: "2.8rem",
          letterSpacing: "0.3rem",
        }}
      >
        Popularity
      </h1>

      <div className="TBrow1">
        <Bar data={topState} options={topOptions} />
      </div>

      <div className="TBrow2">
        <Bar data={bottomState} options={bottomOptions} />
      </div>
    </div>
  );
}

export default TBSongs;
