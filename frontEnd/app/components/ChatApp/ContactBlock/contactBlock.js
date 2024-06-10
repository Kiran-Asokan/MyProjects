import { useEffect, useState, useContext} from 'react'
import { UserContext } from '../../../dashboard/chatapp/home/page'
import Contact from '../contact/contact'
import styles from './contactBlock.module.css'

const ContactBlock = (props) => {
    const [users, setUsers] = useState([])
    const context = useContext(UserContext)
    useEffect(() => {

        const users = props.users.filter(user => user.userId !== context.user.userId )
        setUsers(users)
    },[context])
    return (
        <div className={styles['account-screen']}>
        <h2 >People</h2>
        <div className={styles.contactPeople}>
                {users.length > 0 && users.map((elem) => {
                    return (
                        <Contact
                        user={elem.user}
                        fetchMessages={props.fetchMessages}
                        elem={elem}
                        />
                    )
                })}
            </div>
    </div>
    )
}

export default ContactBlock;