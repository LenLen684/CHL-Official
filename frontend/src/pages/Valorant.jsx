import { useEffect, useState } from 'react'
import { all_members, Card, RandomAgent, RandomCard, RandomTitle } from '../helpers/account_helper'

const backendURL = import.meta.env.VITE_BACKEND_BASE
const playerCardURL = 'https://media.valorant-api.com/playercards'
const playerTitleURL = 'https://valorant-api.com/v1/playertitles/'

function ValorantDash() {
    return (
        <>
            {/* <img className=''></img> */}
            <p>Valorant Cards and players</p>
            {all_members.map((member) => {
                return (
                    <Card key={member.name} name={member.name} tag={member.tag}>
                        <PlayerCard name={member.name} tag={member.tag}>
                        </PlayerCard>
                    </Card>
                )
            })}
        </>
    )
}

function PlayerCard({ name, tag }) {
    const [valCard, setValCard] = useState()
    const [valTitle, setValTitle] = useState()
    const [valLevel, setValLevel] = useState()

    useEffect(() => {
        fetch(`${backendURL}/saved/valorant/account/${name}/${tag}`)
            .then(res => {
                if (res.ok){
                    return res.json()
                } else {
                    return({level: '???', card: RandomCard(), title: RandomTitle()})
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
    }, [])

    return (
        <>
            <div>
                <div className='relative w-fit object-cover border-double border-5 border-amber-300/70'>
                    <img src={valCard} className='border-2 border-amber-300' />
                    <span className='absolute  block text-center bg-slate-500/75 text-white text-sm font-semibold px-2.5 py-1 top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>{valTitle}</span>
                    <span className='absolute  bg-amber-50 text-background-blue text-lg font-bold border-4 border-amber-300 rounded-4xl px-1.5 py-1 -top-4.5 left-1/2 -translate-x-1/2'>{valLevel}</span>
                </div>
            </div>
        </>
    )

}


export { ValorantDash }