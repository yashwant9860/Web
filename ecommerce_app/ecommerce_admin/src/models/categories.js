const { model,models,Schema } = require("mongoose");

const CategorySchema = new Schema({
    name:{type:String,required:true},
    parent:{type:mongoose.Types.ObjectId},
    
});
export const Category = models?.Category || model('Category',CategorySchema);