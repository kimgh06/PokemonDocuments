import React from "react";

function Bookmark({ Bookmark, toggle }) {

  return <div className="BookMark">
    {Bookmark.map((i, n) => {
      return <div key={n}>{i}&nbsp;{
        //   async () => {
        //   const json = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`)).json();
        //   console.log(json);
        //   // return json.name.charAt(0).toUpperCase() + json.name.slice(1);
        // }
      }
      </div>
    })}
  </div>;
}

export default Bookmark;