import { useMemo, useState, useEffect } from 'react'

const NAMES = ['Lila','Dex','Mina','Froggo','Foxy','Kai','Panda','Nova']
const AVATARS = ['😀','😺','🤖','🐸','🦊','👾','🐼','🧸']
const ITEMS = ['Apple','Socks','Toothbrush','Toy Car','Banana','Laptop','Passport','Perfume','Mystery Powder','Fake ID']

const tabs = ['splash','auth','home','lobby','gameplay','voting','profile','shop']

const makePlayers = () => NAMES.map((name, i) => ({ id: i+1, name, avatar: AVATARS[i], ready: i < 5 }))

export default function App(){
  const [screen, setScreen] = useState('splash')
  const [players, setPlayers] = useState(makePlayers())
  const [chat, setChat] = useState(['Lila: Ready?', 'Dex: no smuggling pls', 'Kai: lol'])
  const [input, setInput] = useState('')
  const [round, setRound] = useState(newRound(players))
  const [time, setTime] = useState(90)
  const [voteTime, setVoteTime] = useState(25)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState('')

  useEffect(()=>{
    if(screen !== 'gameplay' || time <= 0) return
    const t = setInterval(()=>setTime(v=>v-1),1000)
    return ()=>clearInterval(t)
  },[screen,time])

  useEffect(()=>{ if(time===0) setScreen('voting') },[time])

  useEffect(()=>{
    if(screen !== 'voting' || voteTime<=0) return
    const t = setInterval(()=>setVoteTime(v=>v-1),1000)
    return ()=>clearInterval(t)
  },[screen,voteTime])

  useEffect(()=>{ if(voteTime===0) finishVote() },[voteTime])

  const me = players[0]
  const suspects = useMemo(()=>players.filter(p=>p.id!==me.id),[players])

  function startMatch(){
    setRound(newRound(players)); setTime(90); setVoteTime(25); setSelected(null); setResult(''); setScreen('gameplay')
  }

  function inspectPlayer(id){
    const p = players.find(x=>x.id===id)
    const bag = round.bags[id]
    const suspicious = bag.some(i=>round.contraband.includes(i))
    setResult(`${p.name}'s bag: ${bag.join(', ')} ${suspicious ? '🚨 suspicious' : '✅ clean-ish'}`)
  }

  function sendChat(){
    if(!input.trim()) return
    setChat(c=>[...c, `You: ${input.trim()}`]); setInput('')
  }

  function finishVote(){
    if(!selected){ setResult('No vote cast. Smuggler escaped!'); return }
    const picked = players.find(p=>p.id===selected)
    if(round.smugglerId === selected) setResult(`You caught ${picked.name}! 🎉`)
    else setResult(`Wrong guess. ${picked.name} was innocent 😅`)
  }

  function toggleReady(id){
    setPlayers(prev=>prev.map(p=>p.id===id?{...p,ready:!p.ready}:p))
  }

  const readyCount = players.filter(p=>p.ready).length

  return <div className="app">
    <header className="hero"><h1>🎲 TablePlay</h1><p>Late-night multiplayer chaos with friends.</p></header>

    <main className="phone">
      <h2>{screenTitle(screen)}</h2>

      {screen==='splash' && <div className="center"><div className="logo">TablePlay</div><div className="loading">● ● ●</div><button className="btn yellow" onClick={()=>setScreen('auth')}>Tap to Start</button></div>}
      {screen==='auth' && <div className="card"><button className="btn">Continue with Google</button><button className="btn">Continue with Apple</button><button className="btn yellow" onClick={()=>setScreen('home')}>Play as Guest</button></div>}

      {screen==='home' && <>
        <div className="card">Friends Online: 5</div>
        <div className="card">Active Rooms: 12</div>
        <div className="card">Trending: Who Packed?, Emoji Court</div>
        <button className="btn yellow" onClick={()=>setScreen('lobby')}>Quick Play</button>
      </>}

      {screen==='lobby' && <>
        <div className="card">Room Code: <b>J7KQ</b> · {readyCount}/8 Ready</div>
        <div className="grid">{players.slice(0,8).map(p=><button key={p.id} className={`slot ${p.ready?'ready':''}`} onClick={()=>toggleReady(p.id)}>{p.avatar}<br/>{p.name}</button>)}</div>
        <div className="chatbox">{chat.slice(-4).map((m,i)=><div key={i}>{m}</div>)}</div>
        <div className="row"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Chat..."/><button className="btn" onClick={sendChat}>Send</button></div>
        <button className="btn green" disabled={readyCount<4} onClick={startMatch}>Start Match</button>
      </>}

      {screen==='gameplay' && <>
        <div className="hud"><span>⏱ {fmt(time)}</span><span>Task: Find the smugglers</span></div>
        <div className="map">
          <div className="zone">Conveyor</div><div className="zone scanner">Scanner</div><div className="zone inspect">Inspection</div>
          {players.map((p,i)=><span className="tag" key={p.id} style={{left:`${10 + (i%4)*22}%`, top:`${20 + Math.floor(i/4)*45}%`}}>{p.avatar} {p.name}</span>)}
        </div>
        <div className="row wrap">{suspects.map(s=><button className="btn" key={s.id} onClick={()=>inspectPlayer(s.id)}>Inspect {s.name}</button>)}</div>
        <button className="btn green" onClick={()=>setScreen('voting')}>Vote Now</button>
        <p className="result">{result || 'Inspect players and find clues.'}</p>
      </>}

      {screen==='voting' && <>
        <div className="danger">Vote ends in {fmt(voteTime)}</div>
        {suspects.map(s=><button key={s.id} className={`sus ${selected===s.id?'sel':''}`} onClick={()=>setSelected(s.id)}>{s.avatar} {s.name}</button>)}
        <button className="btn red" onClick={finishVote}>Submit Vote</button>
        <p className="result">{result || 'Who packed illegal items?'}</p>
      </>}

      {screen==='profile' && <>
        <div className="card">LVL 18 · XP 8,240</div><div className="card">Coins: 1,460</div><div className="card">History: W, W, L, W</div><div className="card">Badges: Night Owl, Detective</div>
      </>}

      {screen==='shop' && <>
        <div className="grid2"><div className="card">🐼 Panda Skin · 400</div><div className="card">🧳 Neon Bag · 250</div><div className="card">🤣 LOL Emote · 120</div><div className="card">🕵️ Hat · 310</div></div>
      </>}
    </main>

    <nav className="nav">{tabs.map(t=><button key={t} onClick={()=>setScreen(t)} className={screen===t?'on':''}>{label(t)}</button>)}</nav>
  </div>
}

function newRound(players){
  const smuggler = players[Math.floor(Math.random()*players.length)]
  const contraband = ['Mystery Powder','Fake ID']
  const bags = {}
  players.forEach(p=>{
    const picks = shuffle([...ITEMS]).slice(0,3)
    if(p.id===smuggler.id) picks[0] = contraband[Math.floor(Math.random()*contraband.length)]
    bags[p.id] = picks
  })
  return {smugglerId: smuggler.id, contraband, bags}
}
const shuffle = (arr)=>arr.sort(()=>Math.random()-0.5)
const fmt = (s)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
const screenTitle = (s)=>({splash:'Splash',auth:'Login / Sign Up',home:'Home',lobby:'Game Lobby',gameplay:'Who Packed? Gameplay',voting:'Voting',profile:'Profile',shop:'Shop'})[s]
const label = (t)=>({splash:'Splash',auth:'Login',home:'Home',lobby:'Lobby',gameplay:'Game',voting:'Vote',profile:'Profile',shop:'Shop'})[t]
