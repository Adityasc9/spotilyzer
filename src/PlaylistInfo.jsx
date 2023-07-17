import "./cssFiles/PlaylistInfo.css";

function PlaylistInfo(props) {
  let hours = props.data.duration / 1000 / 60 / 60;
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  let time = rhours + "h " + rminutes + "m";
  let average = props.data.duration / props.data.total / 1000
  return (
    <div className="PlaylistContainer">
      <a className="image-link" href={props.data.link} target="_blank">
        <img
          src={props.data.picture}
          alt="Playlist image"
          height="350"
          width="350"
          style={{ borderRadius: 45 }}
        ></img>
      </a>
      <div className="data">
        <a
          href={props.data.link}
          target="_blank"
          style={{ textDecoration: "none", color: "rgb(102, 50, 50)" }}
        >
          <h1 className="name">{props.data.name}</h1>
        </a>
        <b>Created by: {props.data.owner}</b>
        <br />
        Number of songs: {props.data.total}
        <br />
        Duration of playlist: {time}
        <br />
        Average song duration:{" "}
        {Math.floor(average / 60)}m{" "}
        {Math.floor((average) % 60)}s
      </div>
    </div>
  );
}
export default PlaylistInfo;
