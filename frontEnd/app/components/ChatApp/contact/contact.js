
import styles from './contact.module.css'
const Contact = (props) => {
    return (
        <div className={props.className ? styles[`${props.className}`]:styles.contact} onClick={props.fetchMessages ? () => props.fetchMessages(`new-${props.elem.user.userId}`, props.elem.user) : () => null}>
            <img src={props.user.Image ? `http://192.168.200.84:8000/profilepics/${props.user.Image}`: '/avatar.svg'} width={75} height={75} />
            <div className={styles['contact-status']}>
                <span>{props?.user?.fullname}</span>
                <span>{props?.user?.email}</span>
            </div>
        </div>
    )
}

export default Contact;