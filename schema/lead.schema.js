const mongoose=require('mongoose')
const Leadschema=mongoose.Schema({
    name:{type:String},
    phone:{type:String,required:true},
    email:{type:String},
    imoview:{type:Boolean,default:false},
    nameMessage:{type:Boolean,default:false},
    emailMessage:{type:Boolean,default:false},
})
let LeadModel
try {
    LeadModel=mongoose.model('leads',Leadschema)
} catch (error) {
    LeadModel=mongoose.model('leads')
}
module.exports= LeadModel