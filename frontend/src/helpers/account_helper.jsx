import { useEffect, useState } from "react"


const all_members = [
    {
        name: "CHL Sour Cream",
        tag: "HelYe"
    },
    {
        name: "CHL Razsmu",
        tag: "TTV"
    },
    {
        name: "CHL Tuzi",
        tag: "tuzi"
    },
    {
        name: "CHL DoubleM",
        tag: "TTV"
    },
    {
        name: "CHL Truther",
        tag: "5798"
    },
    {
        name: "CHL Huginn",
        tag: "5300"
    },
    {
        name: "CHL OrderedChaos",
        tag: "7975"
    },
]

const valorant_card_ids = [
    "5aaa58d8-4567-dc02-dc74-fbaa957fa7cd",
    "9fb348bc-41a0-91ad-8a3e-818035c4e561",
    "51dcf475-4078-2dce-883b-48bb77670ea8",
    "cd5e4a23-4a0b-0f31-d87a-a1a2ec3301f4",
    "746af199-4127-119d-2fc2-1baa3ac144f0",
    "e6a07a97-4c48-421f-515e-288379f7a5be",
    "b96a6d9b-43a7-8681-b276-0b9a517c1738",
    "77042842-4d95-54bc-1898-bc8860133f76",
    "9c5d4d3d-4266-8255-bf9a-ea96b07ecff7",
    "286c244e-4de4-f8e0-d332-b6932f6cf156",
    "fca03251-4672-df99-e0cb-b59746877174",
    "f33a64a0-40cf-6d1f-2eb0-55b81cf27f24",
    "a9f2613c-4a0d-70f0-5f2c-09b5c0be1131",
    "00cdb48d-4ebe-1977-2e4f-6296cdb57c4f",
    "a2bc068a-44ed-9be6-cd77-c3a193e62e68",
    "95b505f7-45b6-d921-a036-b0a087d2dda4",
    "134fcefc-4f11-bfc1-ea7f-47a31e7fe8ef",
    "8dc65b32-4f6a-0725-aff9-babb80e05f41",
    "442e72e8-466f-5f6b-147e-16afc188d4ed",
    "2a280896-4e81-c319-ffd3-6b8873042647",
    "3c112fe6-4685-d426-de5c-82817fdb8bde",
    "55b3141c-4ab5-c350-5f9e-bb83dd1f4e9a",
    "fd4d518f-4760-33b8-7265-9794ceadba16",
    "82b5cd0d-4b81-c336-2332-61a753849355",
    "a438763c-4720-5d58-0aa9-8c89578bc0ae",
    "0c32a7a9-4661-cfbe-7c55-3880b0231a08",
    "89fdd50e-439b-ebeb-0ef2-af8271550943",
    "a60742e6-418c-365a-9133-7c8e08720bfa",
    "382519d7-4422-d868-95ca-e9b3d9825934",
    "7d7bbcea-4601-5629-7134-a2aaf547ccbd",
    "e70e685b-4e42-e14b-dbfc-68957b3b914a"
]
const valorant_title_ids = [
    "141585d1-4382-0b85-349e-bc87db745d8a",
    "0bd2b029-496a-b3f4-417b-1cb4b06f2ad7",
    "129190d4-42fa-4e79-75e3-ffb5679d1dc2",
    "a9dd687e-4654-a110-d060-ac80bf27f6a1",
    "1b4e3bf6-4850-3d9b-a02e-8182caf29b76",
    "4f4e1150-4da1-8b9a-c447-28a205d36bbb",
    "ae12f316-4d71-564e-ac02-57bf8df83335",
    "ca40b3ab-4d9a-a032-60f1-ac9b22e50db9",
    "45630bce-4106-e6ab-3e6f-e1b65e0a5364",
    "63089faa-4a33-3c51-d215-68ac3ec2cd34",
    "887d1bc0-43b4-c084-4723-e0963a491722",
    "37121e2f-43f6-0b7d-fdc4-29b85f3121c9",
    "224f0e96-475d-165d-3ca6-8481a4cb7629",
    "e535c93d-44c5-0206-12c2-2abe5046fdfd",
    "ae54c1ce-42b9-3dc1-5e91-6c9e9161b01a"
]
const valorant_agent_ids = [
    "e370fa57-4757-3604-3648-499e1f642d3f",
    "dade69b4-4f5a-8528-247b-219e5a1facd6",
    "5f8d3a7f-467b-97f3-062c-13acf203c006",
    "cc8b64c8-4b25-4ff9-6e7f-37b4da43d235",
    "b444168c-4e35-8076-db47-ef9bf368f384",
    "f94c3b30-42be-e959-889c-5aa313dba261",
    "22697a3d-45bf-8dd7-4fec-84a9e28c69d7",
    "601dbbe7-43ce-be57-2a40-4abd24953621",
    "6f2a04ca-43e0-be17-7f36-b3908627744d",
    "117ed9e3-49f3-6512-3ccf-0cada7e3823b",
    "320b2a48-4d9b-a075-30f1-1f93a9b638fa",
    "7c8a4701-4de6-9355-b254-e09bc2a34b72",
    "1e58de9c-4950-5125-93e9-a0aee9f98746",
    "95b78ed7-4637-86d9-7e41-71ba8c293152",
    "efba5359-4016-a1e5-7626-b1ae76895940",
    "707eab51-4836-f488-046a-cda6bf494859",
    "eb93336a-449b-9c1b-0a54-a891f7921d69",
    "92eeef5d-43b5-1d4a-8d03-b3927a09034b",
    "41fb69c1-4189-7b37-f117-bcaf1e96f1bf",
    "9f0d8ba9-4140-b941-57d3-a7ad57c6b417",
    "0e38b510-41a8-5780-5e8f-568b2a4f2d6c",
    "1dbf2edd-4729-0984-3115-daa5eed44993",
    "bb2a4828-46eb-8cd1-e765-15848195d751",
    "7f94d92c-4234-0a36-9646-3a87eb8b5c89",
    "df1cb487-4902-002e-5c17-d28e83e78588",
    "569fdd95-4d10-43ab-ca70-79becc718b46",
    "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",
    "8e253930-4c05-31dd-1b6c-968525494517",
    "add6443a-41bd-e414-f6ad-e58d267f4e95"
]


function Card({ name, tag, children }) {
    const [active, setActive] = useState(false)
    const [style, setStyle] = useState(`relative w-full max-w-2xs p-8 sm:p-5 rounded-2xl transition-all duration-500 ease-out
                    bg-white/10 backdrop-blur-md overflow-hidden
                    border border-white/20 border-b-white/10 border-r-white/10
                    transform-[rotateX(15deg)_rotateY(-15deg)_translateZ(20px)]
                    shadow-[20px_20px_50px_rgba(0,0,0,0.2)]
                    hover:transform-[rotateX(5deg)_rotateY(-5deg)_translateZ(60px)]
                    hover:shadow-[30px_30px_70px_rgba(0,0,0,0.4)]
                    hover:bg-white/15`)

    const [childStyle, setChildStyle] = useState(`max-h-0 transition-all duration-500 ease-out overflow-hidden`)


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

            setChildStyle(`overflow-hidden max-h-200 transition-all duration-700 ease-in-out animate-fadeIn
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
                {children}
            </div>
        </div>
    )
}


function RandomTitle(){
    return RandomID(valorant_title_ids)
}
function RandomCard(){
    return RandomID(valorant_card_ids)
}
function RandomAgent(){
    return RandomID(valorant_agent_ids)
}

// SUPPORT
function RandomID(array){
    const index = Math.floor(Math.random() * (array.length));
    return array[index]
}

export { all_members, Card, RandomAgent, RandomCard, RandomTitle}