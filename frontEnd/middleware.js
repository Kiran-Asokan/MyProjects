'use server'
import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export default function middleware(req){
    const token = cookies().get('chatappuser:token');
    const url = req.url
    if(!token && url.includes('/dashboard/chatapp') && !url.includes('/dashboard/chatapp/signup') && !url.includes('/dashboard/chatapp/login')){
        return NextResponse.redirect("http://192.168.200.84:3000/dashboard/chatapp/login")
    }
        
    if(token && url.includes('/dashboard/chatapp/login')){
        return NextResponse.redirect("http://192.168.200.84:3000/dashboard/chatapp/home")
    }
}

