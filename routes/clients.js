var express = require('express');
var bodyParser = require('body-parser'); /*Parses the data seerved from client*/
var mongoose = require('mongoose');
var mongoClient = require('../models/clients');
var Record_count;
var Doc;

exports.getClients = (function (req, res) {
    var perpage = 10;
    var page = req.params.page;
    console.log(page);
    var response = {};
    mongoClient.find({}, function (err, data) {
        if (err) {
            response = { "error": true, "message": err };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    }).limit(perpage).skip(perpage * (page - 1));
});

exports.find = (function (req, res) {
    var response = {};
    var perpage = req.body.perpage;
    var page = req.body.page;
    var client_name = req.body.client_name;
    var id = req.body.id;
    var email_id = req.body.email_id;
    var mobile_no = req.body.mobile_no;
    console.log(perpage+"  "+page);
    mongoClient.find({
        $or: [{ email_id: email_id },
        { client_name: client_name },
        { mobile_no: mobile_no },
        { _id: req.params.id }
        ]
    },function (err, data) {
            if (err) {
                response = { "error": true, "message": err };
            } else {
                response = { "error": false, "message": data };
            }
            res.json(response);
        }).limit(perpage).skip(perpage * (page - 1));
});

exports.getClientId = (function (req, res, next) {
    mongoClient.find().sort({ _id: -1 }).limit(1).exec(function (err, count) {
        if (err) {
            response = { "error": true, "message": err };
        }
        else {
            var db = new mongoClient();
            Record_count = parseInt(count[0].client_id + 1);
            next();
        }
    });
});

exports.saveClient = (function (req, res) {
    var db = new mongoClient();
    var response = {};
       mongoClient.find({},function (err, data) {
        if (err) {
            response = { "error": true, "message": "Error fetching Numbers of Records " };
        }
        else {
           //Count = parseInt(data[0].client_id + 1);
           db.client_id = Record_count;
           db.client_name = req.body.client_name;
           db.mobile_no = req.body.mobile_no;
           db.email_id = req.body.email_id;
           db.addresses = req.body.addresses;
           db.is_active = req.body.is_active;
           db.is_deleted = req.body.is_deleted;
           db.created_by_id = req.body.created_by_id;
           db.created_date = req.body.created_date;
           db.updated_by_id = req.body.updated_by_id;
           db.updated_date = req.body.updated_date;
           db.save(function (err, data) {
               if (err) {
                   console.log(err);
                   response = { "error": true, "message": err};
               } else {
                   response = { "error": false, "message": "Data added for ID :" + data._id ," Client Id ": data.client_id };
               }
               res.json(response);
           });

        }
        
    }).sort({ _id: -1 }).limit(1);

    // db.client_id =req.body.client_id;
    // db.client_name = req.body.client_name;
    // db.mobile_no = req.body.mobile_no;
    // db.email_id = req.body.email_id;
    // db.addresses = req.body.addresses;
    // db.is_active = req.body.is_active;
    // db.is_deleted = req.body.is_deleted;
    // db.created_by_id = req.body.created_by_id;
    // db.created_date = req.body.created_date;
    // db.updated_by_id = req.body.updated_by_id;
    // db.updated_date = req.body.updated_date;

    
    // db.save(function (err,data) {
    //     if (err) {
    //         console.log(err);
    //         response = { "error": true, "message": "Error adding data" };
    //     } else {
    //         response = { "error": false, "message": "Data added for ID :"+data._id+" Client Id "+data.client_id};
    //     }
    //     res.json(response);
    // });
});

exports.updateClient = (function (req, res) {
    var response = {};
    var db = new mongoClient();
    mongoClient.findById(req.params.id, function (err, db) {
        if (err) {
            response = { "error": true, "message": err };
        }
        else {
            db.client_name = req.body.client_name;
            db.mobile_no = req.body.mobile_no;
            db.email_id = req.body.email_id;
            db.addresses = req.body.addresses;
            db.is_active = req.body.is_active;
            db.is_deleted = req.body.is_deleted;
            db.created_by_id = req.body.created_by_id;
            db.created_date = req.body.created_date;
            db.updated_by_id = req.body.updated_by_id;
            db.updated_date = req.body.updated_date;
            db.save(req.params.id, function (err) {
               if (err) {
                    response = { "error": true, "message": err};
                } else {
                    response = { "error": false, "message": "Data is updated for " + req.params.id };
                }
                res.json(response);
            })
        }
    });
});

exports.deleteClient = (function (req, res) {
    var response = {};
    var db = new mongoClient();
    // mongoClient.find(req.params.id, function (err, data) {
    //     console.log(data);
    //     if (err) {
    //         response = { "error": true, "message": "Error fetching data" };
    //     } else {
    //         mongoClient.remove({ _id: req.params.id }, function (err) {
    //             if (err) {
    //                 response = { "error": true, "message": "Error deleting data" };
    //             } else {
    //                 response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };
    //             }
    //             res.json(response);
    //         });
    //     }
    // });

    mongoClient.update(  {_id:req.params.id}, {
    $set: { is_deleted: "True" }},function (err, data) {
        console.log(data);
        if (err) {
            response = { "error": true, "message":err };
        } else {
                             response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };
                }
                res.json(response);
    });
});