const express = require('express')
const cors = require("cors");
const multer = require('multer')
const path = require('path')
const commonController = require('./CommonController/commonController')
const Users = require('./DAL/Schemas/UserSchema')
const Conversations = require('./DAL/Schemas/ConversationSchema')
const Messages = require('./DAL/Schemas/MessageSchema')
const io = require('socket.io')(8080,{
    cors:{
        origin: 'http://192.168.200.84:3000'
    }
})
require('./DAL/DbConnection/mongoConnect')

const app =express()
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/profilepics')
    },
    filename: function(req, file, cb) {
        const format = file.originalname.split('.')[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix +'.'+ format)
    },
})


const upload = multer({storage})

const port = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors({
    origin: '*',
}));

let users=[]
io.on('connection', (socket) =>{
    console.log('socket connected ',socket.id)
    socket.on('addUser', (userId) => {
        isUserExist = users.find(user => user.userId == userId)
        if(!isUserExist){
            const user = {userId, socketId: socket.id}
            users.push(user)
            io.emit('getUsers', users)
        }
        console.log(users, '----------')
    });

    socket.on('sendMessage', async ({senderId, recieverId, message, conversationId}) => {
        console.log({senderId, recieverId, message, conversationId}, 'qqqqqqqqqq')
        console.log(users, 'users')
        const reciever = users.find(user => user.userId === recieverId)
        const sender = users.find(user => user.userId === senderId)
        const user = await Users.findById(senderId)
        const checkConversation = await Conversations.find({members: {$all: [senderId, recieverId]}})
        console.log(sender,reciever, checkConversation , '1111111111111111111111')
        if(checkConversation){
            conversationId = checkConversation[0]._id
        }
        if(reciever){
            io.to(reciever.socketId).to(sender.socketId).emit('getMessage', {
                reciever,
                sender,
                senderId,
                message,
                conversationId,
                recieverId,
                user: {userId: user._id, fullname: user.fullname, email: user.email}
            });
        }else{
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                recieverId,
                user: {userId: user._id, fullname: user.fullname, email: user.email}
            });
        }
        
    })

    socket.on('disConnect',() => {
        users = users.filter(user => user.socketId !== socket.id)
        io.emit('getUsers', users)
    });
})

app.get('/', (req, res) => {
    res.send('welcome its home')
})

app.post('/register', async (req, res) => {
    try {
        const {fullname, email, password} = req.body;
        if(!fullname || !email || !password){
            res.status(400).send('fill all required data')
        }else{
            const isUserExist = await Users.findOne({email})
            if(isUserExist){
                res.status(400).send('An account exist with this email')
            }else{
                const newUser = new Users({fullname, email});
                const encrypedPassword = await commonController.encrypt(password, 'chatappsalekey@1')
                newUser.set('password', encrypedPassword)
                newUser.save();
                return res.status(200).send('User registered Succesfully')
            }
        }

    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).send('fill al required data')
        }else{
            const user = await Users.findOne({email})
            const loginUser = users.find(loginUser => loginUser.userId == user._id)
            if(!user){
                res.status(400).send('No Account is found with this email')
            }else{
                if(loginUser){
                    res.status(400).send('User is already logged in on a device')
                }
                else{
                const userPassword = user.password;
                const decryptedPassword = await commonController.decrypt(userPassword, 'chatappsalekey@1')
                if(decryptedPassword !== password){
                    res.status(400).send('Email or password is incorrect')
                }else{
                    const response = await commonController.createToken(user)
                    if(response.hasOwnProperty('APIError')){
                        res.status(400).send('Some Error occured')
                    }else{
                        res.status(200).send({user: {fullname: response.user.fullname, email: response.user.email ,Image: response.user.Image, userId: response.user._id}, token: response.token})
                    }
                }
                }
                
            }
        }

    } catch (error) {
        console.log(error)
    }
})

app.post('/updatePassword', async (req, res) => {
    try {
        const {userId, currentPassword, newPassword} = req.body
  
        const user = await Users.findById(userId)
        const decryptedPassword = await commonController.decrypt(user.password, 'chatappsalekey@1')
        if(decryptedPassword !== currentPassword){
            res.status(200).send('Wrong current password')
        }else{
            const encrypedPassword = await commonController.encrypt(newPassword, 'chatappsalekey@1')
            await Users.findOneAndUpdate({_id: userId}, {password: encrypedPassword})
            res.status(200).send('Password updated Successfully')
        }

    } catch (error) {
        
    }
})

app.post('/updateProfile', upload.single('avatar'), async (req, res) => {
    try {
        
        const image = req.file;
        const {userId} = req.body;
        await Users.findOneAndUpdate({_id: userId}, {Image: image.filename})
        res.status(200).send('Image uploaded succesfully')
    } catch (error) {
        
    }
    
})

app.get('/logout', async (req, res) => {
    try {
        const userId = req?.query?.userId;
        if(userId){
            const loggedInUsers = users.filter(user => user.userId !== userId)
            users = loggedInUsers
            res.status(200).send('User logged out successfully');
        }else{
            res.status(400).send('Some error occured');
        }

    } catch (error) {
        console.log(error)
    }
})

app.post('/conversation', async(req, res) => {
    try {
        const {senderId, recieverId} = req.body;
        const newConversation = new Conversations({members:[senderId, recieverId]});
        await newConversation.save();
        res.status(200).send('Conversation created successfully')
    } catch (error) {
        console.log(error)
    }
})

app.get('/coversation/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId, 'userIduserIduserId')
        const conversations = await Conversations.find({members: {$in: (userId)}});
        console.log(conversations, 'pppappapap')
        const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
            const reciverId = await conversation.members.find(member => member != userId);
            const user = await Users.findById(reciverId);
            return {user: {userId: user._id, email: user.email, fullname: user.fullname, Image: user.Image}, conversationId: conversation._id}
        }))
        console.log(conversationUserData, 'conversationUserData')
        res.status(200).send(conversationUserData)

    } catch (error) {
        console.log(error)
    }
})

app.post('/message', async (req, res) => {
    try {
        const {conversationId, senderId, message, recieverId=''} = req.body;
        console.log({conversationId, senderId, message, recieverId}, 'opopopo')
        if(conversationId.split('-')[0] == 'new' && recieverId){
            const newConversation = new Conversations({members:[senderId, recieverId]})
            await newConversation.save()
            const newMessage = new Messages({conversationId: newConversation._id, senderId, message})
            await newMessage.save();
            res.status(200).send('Message sent Successfully')
        }else if(!conversationId && !recieverId){
            res.status(200).send('Please fill all required fields')
        }else{
            const newMessage = new Messages({conversationId, senderId, message})
            newMessage.save();
            res.status(200).send('Message sent Successfully')
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/message/:coversationId', async(req, res) => {
    try {
        const getMessage = async (conversationId) => {
            const messages = await Messages.find({conversationId})
            const MessageUserData = await Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return {user: {email: user.email, fullname: user.fullname, userId: user._id}, conversationId: conversationId,  message: message.message}
            }))
            res.status(200).json(MessageUserData)
        }
        const conversationId= req.params.coversationId;
        console.log(conversationId.split('-')[0], conversationId,  'wwwww')
        if(conversationId.split('-')[0] == 'new'){
            console.log(`${req.query.senderId}, ${req.query.recieverId}`,'uuu')
            const checkConversation = await Conversations.find({members: {$all: [req.query.senderId, req.query.recieverId]}})
            console.log(checkConversation, 'checkConversation')
            if(checkConversation.length > 0){
                getMessage(checkConversation[0]._id)
            }else{
                res.status(200).json([])
            }
        }else{
            getMessage(conversationId)
        }
        // }else{
        //     return res.status(200).json([])
        // } 
        
    } catch (error) {
        console.log(error)
    }
})

app.get('/users', async(req, res) => {
    try {
        const users = await Users.find()
        const userData = await Promise.all(users.map(async (user) => {
            return {user: {userId: user._id, email: user.email, fullname: user.fullname, Image: user.Image}, userId: user._id}
        }))
        res.status(200).json(userData)
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`server running on PORT :- ${port}`)
})