const mongoose=require('mongoose')
const Connect=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB Connected')
    } catch (error) {
        return error
    }
}
module.exports=Connect