import Contact from '../contact/contact'

const ChatContact = (props) => {
    return (
        <Contact 
        user={props.messages?.reciever}
        className={'chatContact'}
        />
    )
}
export default ChatContact