const express =require("express");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");

const _=require("lodash");
const app =express();
//mongoose.connect("mongodb+srv://test1:test2@cluster0.nocstsb.mongodb.net/mono?retryWrites=true&w=majority")
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));//badypaser
app.use(express.static("public"));//mongoose database connection
mongoose.connect("mongodb+srv://test1:test1@cluster0.nocstsb.mongodb.net/todolistDB",{useNewUrlParser:true});
let items =["buy food","cook food","eat food"];
let work =[];
//schema for item
const itemSchema={
  name:String
};
//model for itemschema
const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({
  name:"welcome to your todolis"
});//adding documents in mongodb
const item2 = new Item({
  name:"some"
});
const item3 = new Item({
  name:"<--hit this to delete an item."
});
const DItems =[item1,item2,item3];
// Item.insertMany(DItems,function(err)
// {
//   if(err){
//     console.log(err);
//   }else{
//     console.log("sucessfully saved");
//   }
// })
//schema for custom list

const customlistSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
});
//model for list schema
const List=mongoose.model("List",customlistSchema);
//home get method
app.get("/",function(req,res){

  Item.find({},function(err,foundItems){
    if (foundItems.length===0){
      //save toDB
      Item.insertMany(DItems,function(err)
      {
        if(err){
          console.log(err);
        }else{
          console.log("sucessfully saved");
        }
      })
      res.redirect("/");
  }else{
    res.render("list",{listTitle:"Today",newListItem:foundItems});
  }
  })

});
  //Dynamic paths
  app.get("/:Cname",function(req,res){
    const Cname=_.capitalize(req.params.Cname);
  List.findOne({name:Cname},function(err,foundList){
      if(!err){
        if(!foundList){
          // create new line
          const list =new List({
            name:Cname,
            items:DItems
          });
         list.save();
          res.redirect("/"+Cname);
        }else{
          //show an existing list
          res.render("list",{listTitle:foundList.name,newListItem:foundList.items});
        }
      }
    });
  });//Dynamic list end

app.post("/",function(req,res){

  let itemName=req.body.newItem;
  const listName=req.body.list;
  const item = new Item({
    name:itemName
  });
  if(listName==="Today"){
  item.save();

  res.redirect("/");
}else{
 List.findOne({name:listName},function(err,foundList){
   foundList.items.push(item);
   foundList.save();
   res.redirect("/"+listName);
 })
}
});
app.post("/delete",function(req,res){
  const checkedBox=req.body.checkBox;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedBox,function(err){
    if(!err){

      console.log("succesfully removed");
      res.redirect("/");
    }
  });
}
  else{
    List.findOneAndUpdate({name: listName},{$pull:{items:{_id: checkedBox}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }
});
app.get("/about",function(req,res){
  res.render("about");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.listen(port,function(){
  console.log("server is running");
});



// if(req.body.list==="work"){
//   work.push(item);
//   res.redirect("/work");
// }
// else{
//   items.push(item);
//   res.redirect("/");
//
// }
//














// const dB ="mongodb+srv://test2:test2@cluster0.nocstsb.mongodb.net/?retryWrites=true&w=majority";
// //"mongodb+srv://test2:test2@cluster0.nocstsb.mongodb.net/mono?retryWrites=true&w=majority"
// mongoose.connect(dB,{
//   useNewUrlParser:true,
//   useCreateIndex:true,
//   useUnifiedTopology:true,
//   useFindAndModify:false
// }).then(()=>{
  //   console.log("connection succesfully");
  // }).catch((err)=>console.log("not succesfully"));
//


// var today =new Date();
// if(today.getDay()===0){
//   day="sunday";
//
// }
// else if (today.getDay()===1) {
//   day="monday";
// }
// else if (today.getDay()===2) {
//   day="tuesday";
// }
// else if (today.getDay()===3) {
//   day="wendesday";
// }
// else if (today.getDay()===4) {
//   day="thursday";
// }
// else if (today.getDay()===5) {
//   day="friday";
// }
// else if (today.getDay()===6) {
//   day="saturday";
// }
