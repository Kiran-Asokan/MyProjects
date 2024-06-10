import styles from './chatScreenBlock.module.css'

import ChatInput from "../chatInput/chatInput";
import ChatContact from "../chatContact/chatContact";
import ChatDisplay from "../chatDisplay/chatDisplay";
const ChatScreenBlock = (props) => {
    return (
        <div className={styles['chat-screen']}>
                    {
                        props.messages?.reciever?.fullname &&
                        <ChatContact 
                        messages={props.messages}
                        />
                    }
                    
                    <div className={styles.chat}>
                        {props.currentChat.current !== null ? <ChatDisplay
                            messages={props.messages}
                            messageRef={props.messageRef}
                            message={props.message}
                        /> :
                        <div className={styles.noChat}>
                            <div>
                            Please Select a Chat..
                            </div>
                        </div>
                        }
                        
                        {
                            props.messages?.reciever?.fullname && 
                            <ChatInput 
                            message={props.message}
                            setMessage={props.setMessage}
                            sendMessage={props.sendMessage}
                            />
                        }
                    </div>
                    
                </div>
    )
}

export default ChatScreenBlock;