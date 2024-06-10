import Link from 'next/link'
import styles from './dashboard.module.css'

export default function Page(){
    return(
        <div>
            <div className={styles.projects}>
                <div>
                <Link href="dashboard/todo" >
                    <img src='/toDo.jpg' width={250} height={250}/>
                    TO DO LIST</Link>
                </div>
                <div>
                <Link href="dashboard/chatapp/home" >
                    <img src='/chatapp.jpg' width={250} height={250}/>
                    CHAT APP</Link>
                </div>
            </div>
       
        </div>
        
    )
}