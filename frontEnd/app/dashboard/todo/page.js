'use client'
import React, { useState, useEffect } from 'react';
import ToDoForm from "../../components/ToDoForm";
import ToDoList from "../../components/ToDoList";
import styles from './todo.module.css'


export default function Page() {
    const [list, setList] = useState([])
    useEffect(() => {
        let content = localStorage.getItem('ToDoList');
        if(content){
            const savedListData = JSON.parse(content)
            setList(savedListData)
        }

    },[])
    const setListData = (list) => {
        localStorage.setItem('ToDoList', JSON.stringify(list));
    }
    return(
        <div className={styles.todoWrapper}>
            <ToDoForm setList = {setList} list={list} setListData = {setListData}/>
            <ToDoList list = {list} setList = {setList} setListData = {setListData}/>
        </div>
    )
  }

// const ToDo = () => {
//     const [list, setList] = useState([])
//     useEffect(() => {
//         let content = localStorage.getItem('ToDoList');
//         if(content){
//             const savedListData = JSON.parse(content)
//             setList(savedListData)
//         }

//     },[])
//     const setListData = (list) => {
//         localStorage.setItem('ToDoList', JSON.stringify(list));
//     }
//     return(
//         <div className='todo-wrapper'>
//             <ToDoForm setList = {setList} list={list} setListData = {setListData}/>
//             <ToDoList list = {list} setList = {setList} setListData = {setListData}/>
//         </div>
//     )
// }

// export default ToDo;