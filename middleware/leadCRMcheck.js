const LeadModel=require('../schema/lead.schema')
const Connection=require('../mongodb')
const leadController=require('../controller/lead.controller')
module.exports.lead_Check=async(req,res,next)=>{
    const {name,email,phone}=req.query
    try {
        Connection()
         const lead=LeadModel.findOne({phone:phone})
         if(lead){
            if(!lead.name && lead.nameMessage===false){
                await leadController.send_message(phone,"Please enter your name")
                await lead.updateOne({phone:phone},{sendMessage:true})
            }else if(!lead.name && lead.nameMessage){
                await lead.updateOne({phone:phone},{name:name})
            }else if(!lead.email && lead.emailMessage===false){
                await lead.updateOne({phone:phone},{email:email})
            }else if(!lead.email&&lead.emailMessage){
                await lead.updateOne({phone:phone},{})
            }
         }else{
            const create=new LeadModel({phone:req.query.phone})
            await create.save()
         }
    } catch (error) {
        return error
    }
}