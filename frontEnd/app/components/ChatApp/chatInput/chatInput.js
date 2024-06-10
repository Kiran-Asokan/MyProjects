import styles from './chatInput.module.css'

const ChatInput = (props) => {
    return (
        <div className={styles.chatinput}>
            <div>
                <input type='text' placeholder='type a message' 
                value={props.message} 
                onChange={(e) => props.setMessage(e.target.value)} 
                onKeyUp={(e) =>{
                    if(e.key == 'Enter'){
                        props.sendMessage(props.message)
                    }  
                }}/>
            </div>
            <div className={styles.sendBtn}>
                <img src='/send.svg' onClick={() => props.sendMessage(props.message)}/>
            </div>
        </div>
    )
}

export default ChatInput;