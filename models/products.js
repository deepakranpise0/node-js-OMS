var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/OMS');
var mongoSchema =   mongoose.Schema;
var productSchema={
"product_id":Number,
"product_name":{type: String,required: true},
"product_price":{type: Number,min:1,required: true},
"description":{type: String,required: true},
"default_qty":{type: Number,min:1,required: true},
"is_active":Boolean,
"is_deleted":Boolean,
"created_by_id":Number,
"created_date":{type: Date,default: Date.now,required: true},
"updated_by_id":Number,
"updated_date":{type: Date,default: Date.now,required: true}
};
module.exports = mongoose.model('Products',productSchema);