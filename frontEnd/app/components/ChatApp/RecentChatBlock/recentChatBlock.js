
import CurrentUser from '../currentUser/currentUser'
import styles from './recentChatBlock.module.css'
const RecentChatBlock = (props) => {
    return (
        <div className={styles['screen-online']}>
                
            <CurrentUser
            logOutHandler={props.logOutHandler}
            handleEditProfile={props.handleEditProfile}
            />
            <div className={styles['online-contact']}>
                <h4>Messages</h4>
                <div className={styles.contactList}>
                    {props.conversations.map((elem) => {
                        console.log(elem.unread, 'elem')
                        return (
                            <div className={elem.conversationId === props.currentChat.current ? styles.contactActive : styles.contact} onClick={() => props.fetchMessages(elem.conversationId, elem.user)}>
                                <img src={elem.user.Image ? `http://192.168.200.84:8000/profilepics/${elem.user.Image}`: '/avatar.svg'} width={75} height={75} />
                                <div className={styles['contact-status']}>
                                    <span className={elem.unread ? styles.unreadDot : ''}></span>
                                    <span>{elem.user.fullname}</span>
                                    <span>Available</span>
                                    
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RecentChatBlock;