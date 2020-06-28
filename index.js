let express=require("express");
const { json } = require("body-parser");
const { Router } = require("express");
let joi=require("@hapi/joi");
let mongoose=require("mongoose");
let app=express();
app.use(express.json());
let Course=require("./course");
let port=process.env.port || 4800

 app.listen(port,()=>console.log(`Port working on ${port}`));

mongoose.connect("mongodb://localhost:27017/tpdp",
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("connected"))
.catch(error=>console.log(`something went wrong ${error.message}`));


//get all courses
app.get("/courses", async (req,res)=>
{
    let courses= await Course.find();
    res.send(courses);
})

//get course by id
app.get("/courses/:id",async(req,res)=>
{
    let course=await Course.findById(req.params.id);
    if(!course)
    {
        return res.status(404).send({message:"Invalid course id"})
    };
    res.send(course);
})

//create course

app.post("/createcourse",async(req,res)=>
{

    let data=new Course({
        name:req.body.name
    })
    let schema=joi.object({
        name:joi.string().min(3).max(10).required()
    })
    let result=schema.validate(req.body);
    if(result.error)
    {
        return res.status(400).send(result.error.details[0].message)
    }

    
    await data.save();
    
    res.send({message:"Saved successfully"});

    
});

//update course
app.put("/updatecourse/:id", async(req,res)=>{
//step1
let schema=joi.object({
    name:joi.string().min(3).max(10).required()
})
let result=schema.validate(req.body);
if(result.error)
{
    return res.status(400).send(result.error.details[0].message)
}



//step2

let course=await Course.findByIdAndUpdate({_id:req.params.id},
    {
        $set:{
            name:req.body.name
        }
    },
    {
        new :true
    })
if(!course)
{
    return res.status(404).send({message:"Invalid course id"})
};

res.send({message:"Updated",data:course});


});


//delete course

app.delete("/deletecourse/:id",async(req,res)=>
{

//step1
let course=Course.findByIdAndRemove({_id:req.params.id})
if(!course)
{
    return res.status(404).send({message:"Invalid course id"})
};

res.send({message:"Deleted"});



})
