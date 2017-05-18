var mongoose    =   require("mongoose");
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/OMS');
var mongoSchema =   mongoose.Schema;
var order_item_Schema={
"order_item_id":Number,
"order_id":Number,
"product_id":Number,
"product_price":{type: Number,min: 1,required: true},
"product_qty":{type: Number,min: 1,required: true},
"total_price":{type: Number,min: 1,required: true},

};

module.exports = mongoose.model('order_items',order_item_Schema);