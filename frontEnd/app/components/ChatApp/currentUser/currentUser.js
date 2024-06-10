import { useContext } from 'react';
import {UserContext} from '../../../dashboard/chatapp/home/page'
import styles from './currentUser.module.css'

const CurrentUser = (props) => {
    const context = useContext(UserContext);
    return (
        <div className={styles.avatardiv}>
            <div className={styles.ImgWrap}>
                <img src={context.user.Image ? `http://192.168.200.84:8000/profilepics/${context.user.Image}`: '/avatar.svg'} width={75} height={75} />
                <div className={styles.profileControls}>
                    <div onClick={props.handleEditProfile} className={styles.profileControlsBtn}>Profile</div>
                    <button type='button' className={styles.profileControlsBtn} onClick={props.logOutHandler}>Log out</button>
                </div>
            </div>
            
            <div className={styles['contact-status']}>
                <h3>{context.user.fullname}</h3>
                <p>{context.user.email}</p>
                
            </div>
            
        </div>
    )
}

export default CurrentUser