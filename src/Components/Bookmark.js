import React from "react";

function Bookmark({ Bookmark }) {

  return <div className="BookMark">
    {Bookmark.map((i, n) => {
      return <div key={n}><b className="pokeNum" style={{ color: `${i.color}` }}>{i.id}</b>&nbsp;{i.name}</div>
    })}
  </div>;
}

export default Bookmark;