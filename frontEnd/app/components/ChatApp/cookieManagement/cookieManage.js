'use server'
import { cookies } from "next/headers";

export  async function getData(key){
    const data = cookies().get(key)
    return data.value;
}
export  async function setData(key, value){
    cookies().set(key, value)
}

export  async function deleteData(key){
    cookies().delete(key)
}






