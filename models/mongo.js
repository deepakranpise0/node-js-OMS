var mongoose    =   require("mongoose");
//mongoose.connect('mongodb://localhost:27017/OMS');
var mongoSchema =   mongoose.Schema;
var userSchema  = {
    "userEmail" : String,
    "userPassword" : String
};

mongoose.model('user_login',userSchema);
module.exports = mongoose.model('userLogin',userSchema);
