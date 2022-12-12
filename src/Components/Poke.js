import React, { useEffect, useState } from 'react';
import './Poke.scss';
import Bookmark from './Bookmark';

function Poke() {
  const [id, setId] = useState(25);
  const [bookMark, setBookMark] = useState([]); /*북마크 번호 배열*/
  const [langNo, setLangNo] = useState(2); //언어 번호
  const [langName, setLangName] = useState('ko'); //설명을 띄우기 위한 언어이름 설정
  const [generation, setGeneration] = useState(); //세대
  const [name, setName] = useState(); //포켓몬 이름
  const [version, setVersion] = useState('x'); //버전
  const [poke, setPoke] = useState([]);
  const [species, setSpecies] = useState([]);
  const [evolve, setEvolve] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetching = async (id) => {
    try {
      setLoading(true);
      const json = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)).json();
      const species = await (await fetch(json.species.url)).json();
      const evolve = await (await fetch(species.evolution_chain.url)).json();
      setPoke(json);
      setName(json.name.charAt(0).toUpperCase() + json.name.slice(1));
      setSpecies(species);
      setEvolve(evolve);
      setGeneration(species.generation.url.slice(-2, -1));
      setLoading(false);
    } catch (error) {
      alert("요청한 데이터를 찾지 못했습니다. 다시입력 해주세요.\n" + error.message);
    }
  }
  useEffect(() => {
    fetching(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='Poke'>
      <div>
        <form>
          <input value={id} onChange={(e) => {
            setId(parseInt(e.target.value) || 0);
          }} placeholder='Type id or name in English' />
          &nbsp;
          <button
            onClick={(e) => {
              e.preventDefault();
              fetching(parseInt(id));
            }}
          >Submit</button>
        </form>
        <div style={{
          display: 'flex',
        }}>
          <button className='sideButton' onClick={() => {
            setId((c) => {
              if (c > 1)
                return parseInt(c - 1)
              else
                return parseInt(c)
            });
            fetching(id > 1 ? id - 1 : id);
          }}>◀</button>
          {
            loading ? <div><h2>Loading...</h2></div> :
              <div style={{
                marginLeft: '-12px',
                width: '100%',
                textAlign: 'center',
              }}>
                <ul>
                  <div style={{
                    justifyContent: 'center',
                    display: 'flex',
                  }}>
                    <b className='pokeNum' style={{
                      color: `${species.color.name}`
                    }}>{poke.id}</b>
                    &nbsp;
                    <div style={{ margin: '0px' }}>
                      <span>
                        {species.names[langNo].name}
                      </span>
                      &nbsp;
                      <select defaultValue={langNo} onChange={(e) => {
                        setLangNo(e.target.value);
                        setLangName(e.target[e.target.value].text);
                      }} title='Select your language'>
                        {species.names.map((i, n) => <option key={n} value={i.language.url.slice(-2, -1) - 1}>{i.language.name}</option>)}
                      </select>
                      <div style={{ display: 'flex' }}>
                        {species.genera.map((i, n) => langName === i.language.name && <div key={n} value={i.language.name} >{i.genus}</div>)}
                        <button style={{ border: 'none', backgroundColor: 'rgb(0,0,0,0)', marginTop: '5px' }}
                          onClick={() => {
                            bookMark.findIndex(e => e.id === id) !== -1 ? setBookMark(bookMark.filter((e) => e.id !== id))
                              : setBookMark([...bookMark, { id, name, color: species.color.name }]);
                          }}>
                          {bookMark.findIndex(e => e.id === id) === -1 && <img src='https://cdn.icon-icons.com/icons2/2716/PNG/512/bookmarks_icon_173322.png'
                            style={{ width: '20px', height: '20px' }} alt='BookMarkOff' title='북마크하기' />}
                          {bookMark.findIndex(e => e.id === id) !== -1 && <img src='https://cdn.icon-icons.com/icons2/2717/PNG/512/bookmarks_icon_174004.png'
                            style={{ width: '20px', height: '20px' }} alt='BookMarkOn' title='북마크끄기' />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img src={poke.sprites.back_default} title={`The back of ${name}`} alt={name} />
                    <img src={poke.sprites.front_default} title={`The front of ${name}`} alt={name} />
                  </div>
                  <li>
                    {generation}
                    {(() => {
                      switch (generation % 20) {
                        case 1:
                          return 'st';
                        case 2:
                          return 'nd';
                        case 3:
                          return 'rd';
                        default:
                          return 'th';
                      }
                    })()} generation
                  </li>
                  <li>
                    {`${name}`}'s height : {(poke.height) / 10} m
                  </li>
                  <li>
                    {`${name}`}'s weight : {(poke.weight) / 10} kg
                  </li>
                  {//진화 전
                    species.evolves_from_species &&
                    <li>
                      evolved from : <span onClick={() => {
                        setId((current) => { return parseInt(species.evolves_from_species.url.slice(42, -1)) });
                        fetching(species.evolves_from_species.url.slice(42, -1));
                      }}>
                        <b className='pokeNum' style={{
                          color: `${species.color.name}`
                        }}>{species.evolves_from_species.url.slice(42, -1)}</b>&nbsp;
                        {species.evolves_from_species.name}</span>
                    </li>
                  }
                  { //진화 후
                    evolve.chain.evolves_to.length ? evolve.chain.species.name === poke.name &&
                      <li>evolves to : <span onClick={() => {
                        setId((current) => { return parseInt(evolve.chain.evolves_to[0].species.url.slice(42, -1)) });
                        fetching(evolve.chain.evolves_to[0].species.url.slice(42, -1));
                      }}><b className='pokeNum' style={{
                        color: `${species.color.name}`
                      }}>{evolve.chain.evolves_to[0].species.url.slice(42, -1)}</b>
                        &nbsp;{evolve.chain.evolves_to[0].species.name}</span>
                      </li> : ''
                  }
                  {
                    evolve.chain.evolves_to.length ? (evolve.chain.evolves_to[0].evolves_to.length ?
                      evolve.chain.evolves_to[0].species.name === poke.name &&
                      <li>evolves to: <span onClick={() => {
                        setId(parseInt(evolve.chain.evolves_to[0].evolves_to[0].species.url.slice(42, -1)));
                        fetching(evolve.chain.evolves_to[0].evolves_to[0].species.url.slice(42, -1));
                      }}><b className='pokeNum' style={{
                        color: `${species.color.name}`
                      }}>{evolve.chain.evolves_to[0].evolves_to[0].species.url.slice(42, -1)}</b>
                        &nbsp;{evolve.chain.evolves_to[0].evolves_to[0].species.name}</span>
                      </li> : '') : ''
                  }
                  <div>
                    <select defaultValue={version} onChange={(e) => {
                      setVersion(e.target.value);
                    }}
                      style={{
                        fontSize: '15px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        marginTop: '1em',
                      }}>
                      <option>--Choose--</option>
                      {
                        species.flavor_text_entries.map((i, n) => langName === i.language.name &&
                          <option key={n} value={i.version.name}>{i.version.name}</option>)
                      }
                    </select>
                    {
                      species.flavor_text_entries.map((i, n) => version === i.version.name && langName === i.language.name &&
                        <div key={n} value={i.version.name}>
                          <pre>{i.flavor_text}</pre>
                        </div>)
                    }
                  </div>
                </ul>
              </div>
          }
          <button className='sideButton' onClick={() => {
            setId((c) => { return parseInt(c + 1) });
            fetching(id + 1);
          }}>▶</button>
        </div>
      </div>
      <Bookmark Bookmark={bookMark} toggle={true} />
    </div >
  );
}

export default Poke;