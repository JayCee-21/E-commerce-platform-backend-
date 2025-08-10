const User = require('../Model/userModel')
const bcrypt = require('bcryptjs')
const generateToken = require('../JWT/getToken')


//loggingIn a User

const loggingIn = async (req, res) => {
    const {gmail, password} = req.body
 
        if(!gmail || !password) {
        return res.status(400).json({message:"Please provide all fields"})
    }
 else {
    try {
        const user = await User.findOne({gmail})
        if(!user) {
            return res.status(400).json({message: "User not found, Register to continue"})
        }

        //comparing password with hashedPassword

        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword) {
            return res.status(400).json({message: "Invalid gmail or password"})
        }

        //set cookie token

        const token = generateToken(user._id)
       return res
                .cookie("token", token, {httpOnly: true, sameSite: 'strict'})
                .status(200)
                .json({message: "Successfully LoggedIn"})
    } catch (error) {
        res.status(500).json(error)
    }    
    } 
}



// loggingout a user
const loggingOut = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({message: "Successfully Loggedout"})
}

module.exports ={
    loggingIn,
    loggingOut
}