import React from "react";

function Bookmark({ Bookmark }) {
  return <div className="BookMark">
    <span><b>Bookmark</b></span>
    <div className="BookMarkList">
      {Bookmark.map((i, n) => {
        return <div key={n}><b className="pokeNum" style={{ color: `${i.color}` }}>{i.id}</b>&nbsp;{i.name}</div>
      })}
    </div>
  </div>;
}

export default Bookmark;