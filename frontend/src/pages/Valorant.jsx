import { useEffect, useState } from 'react'
import { all_members, RandomAgent, RandomCard, RandomTitle } from '../helpers/account_helper'

const backendURL = import.meta.env.VITE_BACKEND_BASE
const playerCardURL = 'https://media.valorant-api.com/playercards'
const playerTitleURL = 'https://valorant-api.com/v1/playertitles/'
const playerAgentFullURL = 'https://media.valorant-api.com/agents/'

function ValorantDash() {
    return (
        <>
            {/* <img className=''></img> */}
            <p>Valorant Cards and players</p>
            {all_members.map((member) => {
                return (
                    <Card key={member.name} name={member.name} tag={member.tag}>\
                    </Card>
                )
            })}
        </>
    )
}


function Card({ name, tag }) {
    const [active, setActive] = useState(false)
    const [style, setStyle] = useState(`relative w-full max-w-2xs p-8 sm:p-5 rounded-2xl transition-all duration-500 ease-out
                    bg-white/10 backdrop-blur-md overflow-hidden
                    border border-white/20 border-b-white/10 border-r-white/10
                    transform-[rotateX(15deg)_rotateY(-15deg)_translateZ(20px)]
                    shadow-[20px_20px_50px_rgba(0,0,0,0.2)]
                    hover:transform-[rotateX(5deg)_rotateY(-5deg)_translateZ(60px)]
                    hover:shadow-[30px_30px_70px_rgba(0,0,0,0.4)]
                    hover:bg-white/15`)

    const [childStyle, setChildStyle] = useState(`hidden max-h-0 transition-all duration-500 ease-out overflow-hidden`)


    const handleActive = () => {
        setActive(!active)
        if (active) {
            setStyle(`relative w-full max-w-2xs p-8 sm:p-5 rounded-2xl transition-all duration-200 ease-in-out
                    bg-white/10 backdrop-blur-md overflow-hidden
                    border border-white/20 border-b-white/10 border-r-white/10
                    transform-[rotateX(15deg)_rotateY(-15deg)_translateZ(20px)]
                    shadow-[20px_20px_50px_rgba(0,0,0,0.2)]
                    hover:transform-[rotateX(5deg)_rotateY(-5deg)_translateZ(60px)]
                    hover:shadow-[30px_30px_70px_rgba(0,0,0,0.4)]
                    hover:bg-white/15`)
            setChildStyle(`max-h-0 transition-all duration-300 ease-out overflow-hidden`)
        } else {
            setStyle(
                `relative w-full max-w-lg p-8 sm:p-5 rounded-2xl transition-all duration-200 ease-out
                backdrop-blur-md overflow-hidden
                border border-white/20 border-b-white/10 border-r-white/10
                transform-[rotateX(5deg)_rotateY(-5deg)_translateZ(60px)]
                shadow-[30px_30px_70px_rgba(0,0,0,0.4)]
                bg-white/15`)

            setChildStyle(`overflow-hidden max-h-500 transition-all duration-700 ease-in-out animate-fadeIn
                w-full
                p-6 rounded-2xl
                transition-[max-height]
                backdrop-blur-md 
                shadow-[30px_30px_70px_rgba(0,0,0,0.4)]
                bg-white/15
                grid-rows-[1fr]`)
        }
    }


    return (
        <div className="grid grid-cols-[25%_75%] p-4">
            <div className="">
                <div onClick={handleActive} className={"cursor-pointer " + style}>
                    <h1 className="font-extrabold text-xl">{name}</h1>
                    <p className="font-light text-sm">#{tag}</p>
                </div>
            </div>
            <div className={"duration-300 ease-in-out overflow-hidden " + childStyle}>
                <PlayerCard name={name} tag={tag} active={active}></PlayerCard>
            </div>
        </div>
    )
}


function PlayerCard({ name, tag, active }) {
    const [valCard, setValCard] = useState()
    const [valTitle, setValTitle] = useState()
    const [valLevel, setValLevel] = useState()
    const [lastCharacter, setLastCharacter] = useState()
    const [characterID, setCharacterID] = useState()
    const [stats, setStats] = useState()
    const [casts, setCasts] = useState()
    const [outcome, setOutcome] = useState()

    useEffect(() => {
        fetch(`${backendURL}/saved/valorant/account/${name}/${tag}`)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    return ({ level: '???', card: RandomCard(), title: RandomTitle() })
                }
            })
            .then(data => {
                console.log(data)
                if (data) {
                    setValCard(`${playerCardURL}/${data.card}/largeart.png`)
                    setValLevel(data.level)
                    fetch(`${playerTitleURL}${data.title}`)
                        .then(res => res.json())
                        .then(titleData => {
                            console.log(titleData.data)
                            setValTitle(titleData.data.titleText)
                        })
                }
            })
        fetch(`${backendURL}/saved/valorant/last-character-played/${name}/${tag}`)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    return ({})
                }
            }).then(data => {
                console.log(data)
                if (data && Object.keys(data).length > 0) {
                    const game = data.players[0]
                    setCharacterID(game.agent.uuid)
                    setLastCharacter(`${playerAgentFullURL}${game.agent.uuid}/fullportrait.png`)
                    setStats(
                        {
                            kills: game.stats.kills,
                            deaths: game.stats.deaths,
                            assists: game.stats.assists,
                            damage: game.stats.damage,
                            KD: game.stats.deaths > 0 ? (game.stats.kills / game.stats.deaths).toFixed(2) : game.stats.kills
                        }
                    )
                    setCasts(game['ability_casts'])
                    setOutcome({
                        totalRounds: data.outcome.rounds.won + data.outcome.rounds.lost,
                        win: (data.outcome.winning_team == game.team) ? "WON" : "LOST"
                    })
                } else {
                    const ra = RandomAgent()
                    setCharacterID(ra)
                    setLastCharacter(`${playerAgentFullURL}${ra}/fullportrait.png`)

                    setStats({
                        kills: 0,
                        deaths: 0,
                        assists: 0,
                        damage: 0,
                        KD: 0
                    })
                    setCasts({
                        signature: 0,
                        ability1: 0,
                        ability2: 0,
                        ultimate: 0
                    })
                    setOutcome({
                        totalRounds: 0,
                        win: "N/A"
                    })
                }
            })
    }, [])

    return (
        <div className={`${active ? "" : "hidden "} flex w-full ${outcome && outcome.win == "WON" ? 'bg-green-800/20`' : 'bg-red-800/20`'}`}>
            <div className={` flex `}>
                <div className='opacity-0 animate-[fadeInLeft_0.6s_300ms_ease-in-out_forwards] relative w-fit object-cover border-double border-5 border-amber-300/70' >
                    <img src={valCard} className='border-2 border-amber-300' />
                    <span className='opacity-0 animate-[fadeInLeft_0.5s_600ms_ease-in-out_forwards] absolute  block text-center bg-slate-500/75 text-white text-sm font-semibold px-2.5 py-1 top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>{valTitle}</span>
                    <span className='opacity-0 animate-[fadeInLeft_0.5s_600ms_ease-in-out_forwards] absolute  bg-amber-50 text-background-blue text-lg font-bold border-4 border-amber-300 rounded-4xl px-1.5 py-1 -top-4.5 left-1/2 -translate-x-1/2'>{valLevel}</span>
                </div>
                <div className='pl-20 flex flex-row md:flex-col'>
                    <div>
                        <span>{outcome && outcome.win}</span>
                    </div>
                    {/* stats */}
                    <div className='h-[70%] grid grid-cols-2 items-center'>
                        <div >
                            <StatBase url={null} casts={stats && stats.kills} label="Kills" className="p-4 opacity-0 animate-[fadeInLeft_0.5s_1600ms_ease-in-out_forwards]" />
                            <StatBase url={null} casts={stats && stats.deaths} label="Deaths" className="p-4 opacity-0 animate-[fadeInLeft_0.5s_1600ms_ease-in-out_forwards]" />
                            <StatBase url={null} casts={stats && stats.assists} label="Assists" className="p-4 opacity-0 animate-[fadeInLeft_0.5s_1600ms_ease-in-out_forwards]" />
                        </div>
                        <div className='col-span-1'>
                            <StatBase url={null} casts={stats && stats.KD} label="KD" className="p-4 opacity-0 animate-[fadeInLeft_0.5s_1600ms_ease-in-out_forwards]" />
                            <StatBase url={null} casts={stats && (outcome.totalRounds > 0 ? (stats.damage / outcome.totalRounds).toFixed(2) : 0)} label="Avg Damage" className="p-4 opacity-0 animate-[fadeInLeft_0.5s_1600ms_ease-in-out_forwards]" />
                        </div>
                    </div>
                    <div className='flex items-end flex-col md:flex-row'>
                        <StatBase url={`${playerAgentFullURL}${characterID}/abilities/grenade/displayicon.png`} casts={casts && casts.signature} label="Casts" className="opacity-0 animate-[fadeInLeft_0.5s_1600ms_ease-in-out_forwards]" />
                        <StatBase url={`${playerAgentFullURL}${characterID}/abilities/ability1/displayicon.png`} casts={casts && casts.ability1} label="Casts" className="opacity-0 animate-[fadeInLeft_0.5s_1800ms_ease-in-out_forwards]" />
                        <StatBase url={`${playerAgentFullURL}${characterID}/abilities/ability2/displayicon.png`} casts={casts && casts.ability2} label="Casts" className="opacity-0 animate-[fadeInLeft_0.5s_2000ms_ease-in-out_forwards]" />
                        <StatBase url={`${playerAgentFullURL}${characterID}/abilities/ultimate/displayicon.png`} casts={casts && casts.ultimate} label="Casts" className="opacity-0 animate-[fadeInLeft_0.5s_2200ms_ease-in-out_forwards]" />
                    </div>
                </div>
                <div className='w-0.5 h-1 overflow-hidden'>
                    <img src={lastCharacter} className='opacity-0 animate-[fadeInLeft_0.5s_1400ms_ease-in-out_forwards] absolute inset-0 h-full top-4 -left-12 object-contain md:object-cover' />
                </div>
            </div>
        </div>
    )

}

function StatBase({ url, label, casts, className }) {
    return (
        <div className={className + " flex flex-2 items-center sm:flex-col lg:flex-row lg:px-5"}>
            <img className='px-2 sm:w-12  md:w-24' src={url}></img>
            <div className="flex flex-col items-center w-full">
                <span className='md:text-md font-semibold'>{label}</span>
                <span className='md:text-lg font-semibold'>{casts && casts}</span>
            </div>
        </div>
    )
}


export { ValorantDash }