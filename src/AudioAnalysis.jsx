import "./cssFiles/AudioAnalysis.css";
import { Line, Radar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function AudioAnalysis(props) {
  let label = [];
  let datas = [];
  let total = 0;
  let count = 0;
  for (let tempo in props.data.tempos) {
    let Stempo = tempo.toString();
    let freq = props.data.tempos[tempo];
    label.push((Stempo * 2 + 10) / 2);
    datas.push(freq);
    count += freq;
    total += tempo * freq;
  }
  let average = Math.round(total / count);

  const state = {
    labels: label,
    datasets: [
      {
        label: "frequency",
        backgroundColor: "rgba(245, 136, 136, 1)",
        borderColor: "rgba(245, 136, 136, 1)",
        barPercentage: 1,
        categoryPercentage: 1,
        data: datas,
        tension: 0.4,
      },
    ],
  };
  const options = {
    responsive: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Frequency",
          color: "white",
          font: { size: 22 },
        },
        ticks: { color: "white", beginAtZero: true, font: { size: 15 } },
      },
      x: {
        title: {
          display: true,
          text: "BPM",
          color: "white",
          font: { size: 22 },
        },
        ticks: { color: "white", beginAtZero: true, font: { size: 15 } },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Tempo/Beats Per Minute distribution (Avg: " + average + ")",
        color: "white",
        font: { size: 20 },
      },
    },
  };
  let radarState = {
    labels: [
      "Danceability",
      "Energy",
      "Instrumentalness",
      "Liveness",
      "Acousticness",
      "Speechiness",
    ],
    datasets: [
      {
        label: "%",
        data: [
          props.data.danceability * 100,
          props.data.energy * 100,
          props.data.instrumentalness * 100,
          props.data.liveness * 100,
          props.data.acousticness * 100,
          props.data.speechiness * 100,
        ],
        backgroundColor: "rgba(245, 136, 136, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 3,
      },
    ],
  };
  let radarOptions = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Average Audio Features",
        color: "white",
        font: { size: 20 },
      },
    },
    scales: {
      r: {
        grid: {
          color: "pink",
        },
        beginAtZero: true,
        min: 0,
        max: 100,
        pointLabels: {
          color: "white",
          font: { size: 15 },
        },
        ticks: {
          display: false,
          stepSize: 25,
        },
      },
    },
  };
  let pieData = {
    labels: ["Explicit", "Non Explicit"],
    datasets: [
      {
        label: "Frequency",
        data: [props.data.explicit, props.data.total - props.data.explicit],
        backgroundColor: ["rgba(245, 136, 136, 0.8)", "rgba(143, 40, 88, 0.8)"],
        hoverOffset: 4,
      },
    ],
  };
  let pieOptions = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: "Number of explicit songs",
        color: "white",
        font: { size: 20 },
      },
    },
  };
  return (
    <div className="AnalysisContainer">
      <h1
        style={{
          color: "white",
          fontFamily: "Georgia",
          fontSize: "2.8rem",
          letterSpacing: "0.3rem",
        }}
      >
        Audio Analysis
      </h1>
      <div className="graphsContainer">
        <Line data={state} options={options} width={800} height={380} />
        <div className="row2">
          <Radar
            data={radarState}
            options={radarOptions}
            width={600}
            height={600}
          />
          <Pie data={pieData} options={pieOptions} width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
export default AudioAnalysis;
