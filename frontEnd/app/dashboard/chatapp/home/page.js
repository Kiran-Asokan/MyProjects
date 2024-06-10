'use client'
import { useEffect, useRef, useState, createContext } from 'react';
import axios from 'axios';
import styles from './home.module.css';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import {getData, setData, deleteData} from '../../../components/ChatApp/cookieManagement/cookieManage';
import RecentChatBlock from '@/app/components/ChatApp/RecentChatBlock/recentChatBlock';
import ContactBlock from '@/app/components/ChatApp/ContactBlock/contactBlock';
import ChatScreenBlock from '@/app/components/ChatApp/chatScreenBlock/chatScreenBlock';
import Modal from '@/app/components/ChatApp/Modal/Modal';

export const UserContext = createContext();

export default  function Page() {
    const [user, setUser] = useState({})
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState([])
    const [socket, setSocket] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const currentChat = useRef(null)
    const messageRef = useRef(null)
    const isActive = useRef(false);
    const router = useRouter()
    useEffect( () => {
        const getUserDetails = async () => {
        
            const cookiedata = JSON.parse(await getData('chatappuser:details'))
            if(cookiedata){
                setUser(cookiedata)
                console.log(cookiedata, 'cookiedata')
                getconversationDetails(cookiedata, false)
            }
        }
        getUserDetails()
        
    }, [])


    useEffect(() => {
        if(!isActive.current){
            const newSocket = io('http://192.168.200.84:8080')
            setSocket(newSocket)
            isActive.current = true;
        }
    }, [])
    useEffect(() => {
        console.log(user, 'p')
        if(Object.keys(user).length !== 0){
            socket?.emit('addUser', user?.userId)
            socket?.on('getUsers', (users) => {
                console.log('Activeusers', users)
            })
            const handleMessage = (message) => {
                console.log(message, 'messahge --------')
                console.log(currentChat.current, message.conversationId, 'opopooopopopoopop')
                if((currentChat.current !== null) && (currentChat.current == message.conversationId || currentChat.current.split('-')[1] == message.senderId || currentChat.current.split('-')[1] == message.recieverId)){
                    console.log('kk')
                    setMessages(prev => ({
                        ...prev,
                        messages: [...(prev?.messages ?? []), { user: message.user, message: message.message }]
                    }));
                    getconversationDetails(user, false)
                }else{
                    getconversationDetails(user,message.conversationId)
                    setConversations(prevState => {
                        return prevState.map(item => {
                            if (item.conversationId === message.conversationId) {
                                return { ...item, unread: true };
                            }
                            return item;
                        });
                    });
                }
                
            };
            socket.on('getMessage', handleMessage);

            return () => {
                socket.off('getMessage', handleMessage);
            };
        }
        
    }, [socket, user])

    useEffect(() => {
        messageRef?.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages?.messages])

    useEffect(()=>{
        getUsers()
    },[])

    const getconversationDetails = async (user , flagData)=> {
        console.log(flagData, 'flag')
        console.log(user, 'frot user')
        const response = await axios.get(`http://192.168.200.84:8000/coversation/${user.userId}`)
        console.log(response.data, 'iiiii')
        let updatedData;
        if(!flagData){
            console.log('entered')
            updatedData = response.data.map(element => {
                return { ...element, unread: false };
            })
        }else{
            updatedData = response.data.map(element => {
                if(element.conversationId === flagData){
                    return { ...element, unread: true };
                }else{
                    return { ...element, unread: element.unread };
                }
            })
        }
        console.log(updatedData, 'updatedDataupdatedData')
        setConversations(updatedData)
        if(response.data.length > 0){
            setMessages(prevState => ({
                ...prevState,
                conversationId: response.data[0].conversationId
              }));
        }
        
    }
    
    const getUsers = async () => {
        console.log('jj')
        const res = await axios.get(`http://192.168.200.84:8000/users`)
        setUsers(res.data)
    }

    const fetchMessages = async (conversationId, reciever) => {
        console.log(reciever, 'reciever')
        const res = await axios.get(`http://192.168.200.84:8000/message/${conversationId}?senderId=${user.userId}&&recieverId=${reciever.userId}`)
        console.log(res.data, 'lololo')
        if(res.data.length > 0){
            setMessages({messages: res.data, activeReciever:reciever,  reciever: reciever, conversationId: res.data[0].conversationId})
            currentChat.current = res.data[0].conversationId;
        }else{
            setMessages({messages: res.data, activeReciever:reciever,  reciever: reciever, conversationId: conversationId})
            currentChat.current = conversationId;
        }
        setConversations(prevState => {
            return prevState.map(item => {
                if (item.conversationId === conversationId) {
                    return { ...item, unread: false };
                }
                else{
                    return { ...item, unread: item.unread };
                }
                
            });
        });
        console.log(currentChat.current, conversationId, 'ppp')
    }

    const sendMessage = async (message) => {
        console.log(messages, 'messages')
        console.log(messages?.reciever?.userId, 'recieverId')
        socket?.emit('sendMessage', {
            senderId: user.userId,
            recieverId: messages?.reciever?.userId,
            message,
            conversationId : messages?.conversationId
        });

        const data={
            conversationId : messages?.conversationId, 
            senderId: user.userId, 
            message,
            recieverId: messages?.reciever?.userId
        }
        console.log(data, '----data----')
        const res = await axios.post(`http://192.168.200.84:8000/message`,  data)
        console.log(messages?.conversationId, 'qpqpqpqp')
        if(messages?.conversationId.split('-')[0] == 'new'){
            getconversationDetails(user, false)
            currentChat.current = messages?.conversationId
        }
        setMessage('')
    }

    const logOutHandler = async () => {
        socket?.emit('disConnect')
        await deleteData('chatappuser:token') 
        await deleteData('chatappuser:details')
        router.push('/dashboard/chatapp/login')
    }

    const handleEditProfile = async () => {
        setShowModal(true)
    }

    const updatePassword = async (currentPassword, newPassword) => {
        if(currentPassword === newPassword){
            return ('The current password and new password is same')
        }else{
            const data={
                userId : user?.userId, 
                currentPassword,
                newPassword
            }
            
            const res = await axios.post(`http://192.168.200.84:8000/updatePassword`,  data)
            return (res.data)
        }
        
    }

    const updateProfile = (form) => {
        const formData = new FormData(form);
        const url = 'http://192.168.200.84:8000/updateProfile';

        axios.post(url, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then(async response => {
            const users = await axios.get(`http://192.168.200.84:8000/users`)
            const newUserDetails = users.data.find(user1 => user1.user.userId === user.userId);
            await setData('chatappuser:details', JSON.stringify(newUserDetails))
            setUser(newUserDetails.user)
            return response.data
        })
        .catch(error => {
            return error.message
        });
    }
    return (
        <UserContext.Provider value={{user}}>
            <div className={styles.homePage}>
                <RecentChatBlock 
                handleEditProfile={handleEditProfile}
                logOutHandler={logOutHandler}
                conversations={conversations}
                currentChat={currentChat}
                fetchMessages={fetchMessages}
                />
                <ChatScreenBlock 
                messages={messages}
                message={message}
                messageRef={messageRef}
                setMessage={setMessage}
                sendMessage={sendMessage}
                currentChat={currentChat}
                />
                <ContactBlock
                fetchMessages={fetchMessages}
                users={users}
                />
            </div>
            <Modal
            updatePassword={updatePassword}
            updateProfile={updateProfile}
            show={showModal}
            onHide={() => setShowModal(false)}
            />
        </UserContext.Provider>
        
    )
}