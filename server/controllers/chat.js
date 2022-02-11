import Chat from "../models/chat.js";




export const getChat = async (req, res) => {
    try {
        const chat = await Chat.find()
        res.status(200).json(chat);
    } catch (error) {;
        res.status(404).json({message: error.message})
    }
  }

  export const createNewChat = async (req, res)=>{
    const chat = req.body;  
    
    newChat = new Chat(chat)
    try {
        await newPost.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(409 ).json({message: error.message})

      }
  }