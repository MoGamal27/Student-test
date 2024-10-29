import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId:{typr: String,required:true},
    docId:{typr: String,required:true},
    slotDate:{typr: String,required:true},
    slotTime:{typr: String,required:true},
    userData:{typr: Object,required:true},
    docData:{typr: Object,required:true},
    amount:{typr: Number,required:true},
    date:{typr: Number,required:true},
    cancel:{typr: Boolean,required:false},
    payment:{typr: Boolean,required:false},
    isCompleted:{typr: Boolean,required:false},
    
})


const appointmentModel = mongoose.models.appointment || mongoose.models('appointment' , appointmentSchema)
export default appointmentModel