var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://oms_user:oms_user@ds064299.mlab.com:64299/oms');
var mongoSchema = mongoose.Schema;

var clientSchema = {
    "client_id": Number,
    "client_name": {type: String,required: true},
    "mobile_no": {type: Number,required: true},
    "email_id": {type: String,required: true},
    "addresses": [{
        "address_type": String,
        "address": String,
        "city": String,
        "state": String,
        "pincode": Number
    }],
    "is_active": Boolean,
    "is_deleted": Boolean,
    "created_by_id": Number,
    "created_date": {type: Date,default: Date.now,required: true},
    "updated_by_id": Number,
    "updated_date": {type: Date,default: Date.now,required: true}
};


module.exports = mongoose.model('clients', clientSchema);