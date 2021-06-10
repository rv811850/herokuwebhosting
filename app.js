//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://rv811850:robravin@999@cluster0.pb6la.mongodb.net/todolistDB?retryWrites=true&w=majority",{ useUnifiedTopology: true,useNewUrlParser: true });

const itemsSchema = {
  name: String
}
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "Buy Food"
});
const item2 = new Item({
  name: "Cook Food"
});
const item3 = new Item({
  name: "Eat Food"
});

const defaultArry=[item1,item2,item3];


app.get("/", function(req, res) {


  const day = date.getDate();
  Item.find({},function(err,foundItem){

    if(foundItem.length === 0){
      Item.insertMany(defaultArry,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully saved");
        }
      });
    }

    res.render("list", {listTitle: day, newItems: foundItem});
  });

});

app.post("/", function(req, res){

  const item = new Item({
    name: req.body.newItem
  });
  item.save();

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    res.redirect("/");
  }
});

app.post("/delete",function(req,res){
  const deleteitem = req.body.deleteitem;
  Item.findByIdAndRemove(deleteitem,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("successfully deleted");
    }
  });
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
