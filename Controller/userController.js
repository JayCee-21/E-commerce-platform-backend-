const User = require('../Model/userModel')
const bcrypt = require('bcryptjs')

const createUser = async(req,res) => {
    const { username, gmail, password } = req.body
   
    if(!username || !gmail || !password) {
        return res.status(400).json({message: "Please provide all fields"})
    }
    //checking existing user
    try {
          const returningUser = await User.findOne({gmail})
          if(returningUser) {
            return res.status(400).json({message: "User already exist"})
          }

          //hashing of password
          const salt = bcrypt.genSaltSync(10)
          const hashedPassword = bcrypt.hashSync(password, salt)

          if(gmail === process.env.ADMIN) {
            const user = new User({...req.body, password: hashedPassword, admin: true})
            await user.save()
          }
          const newUser = new User({...req.body, password: hashedPassword, admin: false})
          await newUser.save()
          return res.status(200).json({message: "User Created Successfully"})

    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllUsers = async (req, res) => {
     if(!req.user || !req.user.admin) {
        return res.status(400).json({message: "Access Denied, Admin only"})
     }
     try {
        const users = await User.find().select("-password")
        res.status(200).json(users)
     } catch (error) {
        res.status(500).json(error)
     }
}

//get one user by admin

const getUserById = async(req, res) => {
    const {id} = req.params

    if(req.user.admin !== true) {
        return res.status(400).json({message: "Access Denied, Admin only"})
     }
     try {
        const user = await User.findById(id).select("-password")
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(user)
     } catch (error) {
        res.status(500).json(error)
     }
}


module.exports = { createUser, getAllUsers, getUserById }