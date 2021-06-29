import { ReactNode } from 'react'
import cx from 'classnames'

import './styles.scss'

type QuestionPropsType = {
    content: string
    author: {
        name: string
        avatar: string
    }
    children?: ReactNode
    isAnswered?: Boolean
    isHighlighted?: Boolean
}

export function Question({ 
    content, 
    author, 
    children,
    isAnswered = false,
    isHighlighted = false
 }: QuestionPropsType) {
    return (
        <div
            className= {cx('question',
                           { answered: isAnswered },
                           { highlighted: isHighlighted && !isAnswered }
                        )}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}
