const express = require("express")
const connectDB = require('./MongoDB/mongoDB')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const userRouter = require('./Routes/userRoute')
const authRouter = require('./Routes/authRoute')
const productRouter = require('./Routes/productRoute')
const fileRouter = require('./Routes/uploadImageRoute')
const cartRouter = require('./Routes/cartRoute')
const orderRouter = require('./Routes/orderRoute')

dotenv.config()
connectDB()

const app = express()


//top-level middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())



app.use('/api', userRouter)
app.use('/api', authRouter)
app.use('/api', productRouter)
app.use('/api', fileRouter)
app.use('/api', cartRouter)
app.use('/api', orderRouter)



const port = process.env.PORT

app.listen(port, () => {
    console.log(`Our Server is up and running on port ${port}`)
})
