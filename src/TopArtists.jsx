import "./cssFiles/TopArtists.css";

function TopArtists(props) {
  let topArtists = props.data.topArtists;
  let artlistList = [];
  for (let artist of topArtists) {
    artlistList.push(
      <a className="artistHref" href={artist[1]["link"]} target="_blank" key={artist[0]}>
        <li className="artistItem">
          <h2 className="artistName">{artist[0]}</h2>
          <br />
          <h3 className="artistCount">{artist[1]["count"]} songs</h3>
        </li>
      </a>
    );
  }
  return (
    <div className="artistContainer">
      <h1 style={{color: "white", fontFamily: "Georgia", fontSize: "2.8rem", letterSpacing: "0.3rem"}}>Top Artists</h1>
      <ul className="artistList">{artlistList}</ul>
    </div>
  );
}

export default TopArtists;
