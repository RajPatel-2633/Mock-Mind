import mongoose,{Schema} from "mongoose";


const questionSchema = new mongoose.Schema({
    interview:{
        type:Schema.Types.ObjectId,
        ref:"Interview",
        required:true
    },
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        default:""
    },
    feedback:{
        type:String,
        default:""
    },
    score:{
        type:Number,
        default:0
    },
    difficulty:{
        type:String,
        enum:[
            "easy",
            "medium",
            "hard"
        ]
    },
    questionNumber:{
        type:Number
    },
    timeTaken:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});


const Question = mongoose.model("Question",questionSchema);

export default Question;