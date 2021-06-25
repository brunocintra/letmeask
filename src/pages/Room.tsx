import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import "../styles/room.scss";

type RoomParamsType = {
    id: string
}

type FirebaseQuestionsType = Record<string, {
    author: {
        name: string
        avatar: string
    }
    content: string
    isHighlighted: Boolean
    isAnsewered: Boolean
}>

type QuestionType = {
    id: string
    author: {
        name: string,
        avatar: string
    }
    content: string
    isHighlighted: Boolean
    isAnsewered: Boolean
}

export function Room() {
    const { user } = useAuth()
    const params = useParams<RoomParamsType>()
    const [newQuestion, setNewQuestion] = useState('')
    const roomId = params.id
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestionsType = databaseRoom.questions ?? {}

            const parserQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnsewered: value.isAnsewered
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parserQuestion)
        })

    }, [roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()
        if(newQuestion.trim() === '') {
            return
        }

        if(!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnsewered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)
        setNewQuestion('')
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => { setNewQuestion(event.target.value) }}
                        value={newQuestion}
                     />

                     <div className="form-footer">
                         { user ? (
                             <div className="user-info">
                                 <img src={user.avatar} alt={user.name} />
                                 <span>{user.name}</span>
                             </div>
                         ) : (
                            <span>Para enviar sua pergunta, <button>faça seu login</button>.</span>
                         ) }   
                         
                         <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                     </div>
                </form>
                { JSON.stringify(questions) }
            </main>
        </div>
    )
}