import { useState } from "react";
import Modal from "./ChatApp/Modal/Modal";
import styles from '../dashboard/todo/todo.module.css'

const ToDoList = (props) => {
    const [formshow, setFormShow] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [editElem, setEditElem] = useState({})
    
    const handleTick = (e, element) => {
        e.preventDefault()
        const newData = props.list.map(data => {
            if(data.name === element.name){
                data.flag = true;
            }
            return data
        });
        props.setListData(newData);
        props.setList(newData);
        setFormShow(false)
        

    }

    const handleDelete = (e, element) => {
        let updatedData = props.list.filter((data) => data !== element);
        props.setList(updatedData);
        props.setListData(updatedData);
        setFormShow(false)
    }
    const handleEdit = (e, element) => {
        setFormShow(true)
        setEditElem(element)
        setInputValue(element.name)
    }
    const handleSubmit = () => {
        const newData = props.list.map(data => {
            if(data.name === editElem.name){
                data.name = inputValue;
            }
            return data
        });
        props.setListData(newData);
        props.setList(newData);
        setFormShow(false)
    }
        return (
        <div className={styles.listTodo}>
            <Modal 
            inputValue={inputValue}
            setInputValue={setInputValue}
            show={formshow}
            submit={handleSubmit}
            onHide={() => setFormShow(false)}/>
            {props.list?.map((element) => {
                    return(
                        <span className={`${element.flag ? styles.strikeList : ''}`}>
                            {element.name}
                            <div>
                                <button type="button" onClick={(e) => handleTick(e, element)}>
                                    <img width={25} height={25} src='/check-mark-button.svg' alt='tick'/>
                                </button>
                                <button type="button" onClick={(e) => handleEdit(e, element)}>
                                    <img width={25} height={25} src='/edit.png' alt='tick'/>
                                </button>
                                <button type="button" onClick={(e) => handleDelete(e, element)} >
                                <img width={25} height={25} src='/trash.svg' alt='delete'/>
                                </button>
                            </div>
                        </span>
                    )
                })}  
        </div>
    )
    
    
}

export default ToDoList;