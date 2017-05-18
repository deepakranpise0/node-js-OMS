var mongoose    =   require("mongoose"), Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/OMS');
var mongoSchema =   mongoose.Schema;
var orderSchema=Schema({
"order_id":Number,
"client_id":Number,
"order_status":String,
"total_qty":{type: Number,min: 1,required: true},
"final_price":Number,
"is_active":Boolean,
"is_deleted":Boolean,
"created_by_id":Number,
"created_date":{type: Date,default: Date.now,required: true},
"updated_by_id":Number,
"updated_date":{type: Date,default: Date.now,required: true},
});
module.exports = mongoose.model('Orders',orderSchema);