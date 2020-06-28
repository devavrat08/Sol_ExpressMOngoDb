let mongoose=require("mongoose");

let courseSchema=mongoose.Schema(
    {
        name:{
            type:String
        },

        });

        let course=mongoose.model("courses",courseSchema);

        module.exports=course;
