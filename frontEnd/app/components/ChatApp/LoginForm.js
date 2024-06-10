import { useState } from 'react';
import styles from './LoginForm.module.css'
import Link from 'next/link';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import {setData} from './cookieManagement/cookieManage'
// import Input from '../FormElements/Input';

const LoginForm = (props) => {
    const router = useRouter()
    const [data, setdata] = useState({
        ...(!props.isSignInPage && {
            fullname: ''
        }),
        email: '',
        password: ''
    })

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    
    const submitHandler = async (e) =>{
        try {
            setSuccess(false)
            setError(false)
            e.preventDefault()
            if(!props.isSignInPage){
                if(data.fullname != '' || data.email != '' || data.password != ''){
                    const response = await axios.post('http://192.168.200.84:8000/register', data)
                    if(response.status == 200){
                        setSuccess('Created SuccesFully')
                        setdata({
                            fullname: '',
                            email: '',
                            password: ''
                        })
                    }
                }
            }else{
                if(data.email != '' || data.password != ''){
                    const response = await axios.post('http://192.168.200.84:8000/login', data);
                    if(response.status == 200){
                        setdata({
                            email: '',
                            password: ''
                        })
                        await setData('chatappuser:token', response.data.token)
                        await setData('chatappuser:details', JSON.stringify(response.data.user))
                        router.push('/dashboard/chatapp/home')
                    }
                }
            }
        } catch (error) {
            if(error.response.data){
                setError(error.response.data)
            }else{
                setError(error.message)
            }
        }
        
    }
    return (
        <div className={styles.loginForm}>
            <h1>WELCOME</h1>
            <div>{`${props.isSignInPage  ? 'Log in' : 'Sign Up'} now to get started`}</div>
            <form onSubmit={submitHandler} className={styles.formdiv}>
                {!props.isSignInPage && (
                    <div>
                    <label htmlFor='fullname'> Full Name</label>
                    <input id='fullname' type='text' value={data.fullname} placeholder='Enter Your Full Name' onChange={(e) => setdata({...data, fullname: e.target.value})}/>
                </div>
                )}
                
                <div>
                    <label htmlFor='email'>Email</label>
                    <input id='email' type='text' value={data.email} placeholder='Enter Your Email' onChange={(e) => setdata({...data, email: e.target.value})}/>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input id='password' type={props.isSignInPage ? 'password' : 'text'}  value={data.password} placeholder='Enter Your Password' onChange={(e) => setdata({...data, password: e.target.value})}/>
                </div>
                <div>
                    <button type='submit'>{!props.isSignInPage ? 'Sign Up' : 'Log In'}</button>
                </div>
                <div>
                    {!props.isSignInPage ? (
                        <span> Already have an account?  
                            <Link href='/dashboard/chatapp/login'>Log In</Link>
                        </span>
                    ) : (
                        <span> New User?  
                            <Link href='/dashboard/chatapp/signup'>Sign up</Link>
                        </span>
                    )}
                </div>
            </form>
            <div>
            {success && (
                <>
                <span className={styles.success}>
                        {success}
                    </span>
                    <span>
                    <Link href='/dashboard/chatapp/login'>Click here to Login</Link>
                    </span>
                    
                </>
                )}
                {error && (
                    <span className={styles.error}>
                        {error}
                    </span>
                )}
            </div>
        </div>
    )
}

export default LoginForm;