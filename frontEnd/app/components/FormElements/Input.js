import { useState } from "react";


const Input = (props) => {
    const [input, setInput] = useState(props.value? props.value : '')
    return (
        <div>
        <label htmlFor="">{props.label}</label>
        <input type={`${props.type ? props.type : 'text'}`} 
        placeholder={`${props.placeholder ? props.placeholder : ''}`} 
        value={input} onChange={(e)=> setInput(e.target.value)}/> 
        </div>
        
    )
}

export default Input;