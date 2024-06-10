"use client"
import styles from './signup.module.css'
import LoginForm from '@/app/components/ChatApp/LoginForm'

export default function Page() {
    return (
        <div className={styles.login}>
            <LoginForm isSignInPage= {false} />
        </div>
    )
}