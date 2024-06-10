import React, { useState } from 'react';
import styles from '../dashboard/todo/todo.module.css'
const ToDoForm = (props) => {
    const [inputValue, setInputValue] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(inputValue !== ""){
            props.setList((prev)=>{
                const sameValue = prev.filter(element => element.name === inputValue);
                if(sameValue.length === 0){
                    return [{name:inputValue, flag: false}, ...prev]
                }else{
                    return [...prev]
                }
                
            })
            props.setListData([{name:inputValue, flag: false}, ...props.list])
            setInputValue("")
        }
        
      };
    return(
        <div>
            <form onSubmit={handleSubmit} className={styles.todoForm}>
            <input type="text" className={styles.todoFormInput} value={inputValue} onChange={(e)=> setInputValue(e.target.value)}></input>
            <button type="submit" className={styles.todoFormButton}>Add</button>
            </form>
            
        </div>
    )
}

export default ToDoForm;