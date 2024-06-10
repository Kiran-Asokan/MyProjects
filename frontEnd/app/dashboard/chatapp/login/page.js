"use client"
import styles from './login.module.css'
import LoginForm from '@/app/components/ChatApp/LoginForm'

export default function Page() {
    return (
        <div className={styles.login}>
            <LoginForm isSignInPage={true} />
        </div>
    )
}