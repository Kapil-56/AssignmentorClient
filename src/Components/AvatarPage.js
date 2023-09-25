import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
// import { Buffer } from 'buffer'
import { UserContext } from '../App'


function AvatarPage() {
    const api = 'https://api.multiavatar.com/4567895'
    const [avatars, setAvatars] = useState([])
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { state, dispatch } = useContext(UserContext)

    const setProfilePic = async () => {
        if (selectedAvatar === null) {
            alert("please select an Avatar to continue")
            console.log(selectedAvatar);
        }
        else {
            console.log(selectedAvatar);
            const userId = state?._id

        }
    }
    useEffect(() => {
        const fetchAvatars = async () => {
            const data = []
            for (let i = 0; i < 4; i++) {
                const image = await fetch(`${api}${Math.round(Math.random() * 1000)}?apikey=jHJZnfIF5VGhLW`)
                const buffer = await image.arrayBuffer()
                const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                data.push(base64)
            }
            setAvatars(data)
            setIsLoading(false)
        }
        // fetchAvatars()
    }, [])

    return (
        <>
            {
                isLoading ?
                    <Container className='vh-100 d-flex justify-content-center align-items-center'>
                        <Spinner animation='border'></Spinner>
                    </Container> :

                    <Container className='vh-100 d-flex flex-column justify-content-center align-items-center gap-5'>
                        <div className="title">
                            <h1>Pick an avatar as your profile picture</h1>
                        </div>
                        <div className="avatars d-flex gap-5">
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div key={index} style={{ border: "2px soild transparent" }} className={`avatar p-1 rounded-pill d-flex justify-content-center align-items-center ${selectedAvatar === index ? "selected" : ""}`} >
                                            <img style={{ height: "6rem" }} src={`data:image/svg+xml;base64,${avatar}`} alt="avatar"
                                                onClick={() => setSelectedAvatar(index)}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Button onClick={setProfilePic}>Set as profile picture</Button>
                    </Container>}
        </>
    )
}


export default AvatarPage