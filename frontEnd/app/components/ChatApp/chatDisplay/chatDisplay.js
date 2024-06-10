import { useContext } from 'react';
import { UserContext } from '../../../dashboard/chatapp/home/page'
import styles from './chatDisplay.module.css'


const ChatDisplay = (props) => {
    const context = useContext(UserContext)
    console.log(props.messages.messages, 'props.messages.messages')
 return (
    <div className={styles.chatDisplay}>
            {props.messages?.messages?.length > 0 ?
            props.messages.messages.map(({message, user:{userId} = {}}) =>{
                return (<div className={userId === context.user.userId ? styles.chatDisplayout : styles.chatDisplayin }>
                    <div ref={props.messageRef}>
                        {message}
                    </div>
                </div>)
            }) : ''}
    </div>
 )
}

export default ChatDisplay;