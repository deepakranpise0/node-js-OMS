var express = require('express');
var bodyParser = require('body-parser'); /*Parses the data seerved from client*/
var mongoose = require('mongoose');
var mongoProducts = require('../models/products');
var Record_count;
exports.getProducts = (function (req, res) {

    var response = {};
    mongoProducts.find({}, function (err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "error": true, "message": err };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});

exports.find = (function (req, res) {
    var response = {};
    var product_name = req.body.product_name;
    var product_id = req.body.product_id;
    console.log(req.body.mobile_no);
    mongoProducts.find({
        $or: [{ product_name: product_name },
        { product_id: product_id }
         ]
    },function (err, data) {
            if (err) {
                response = { "error": true, "message": err };
            } else {
                response = { "error": false, "message": data };
            }
            res.json(response);
        });
});

exports.getProductId = (function (req, res, next) {
    mongoProducts.find().sort({ _id: -1 }).limit(1).exec(function (err, count) {
        if (err) {
            response = { "error": true, "message": err };
        }
        else {
              Record_count = parseInt(count[0].product_id + 1);
            next();
        }
    });
});



exports.saveProduct = (function (req, res) {
    var db = new mongoProducts();
    var response = {};
           db.product_id = Record_count;;
           db.product_name = req.body.product_name;
           db.product_price = req.body.product_price;
           db.description = req.body.description;
           db.default_qty = req.body.default_qty;
           db.is_active = req.body.is_active;
           db.is_deleted = req.body.is_deleted;
           db.created_by_id = req.body.created_by_id;
           db.created_date = req.body.created_date;
           db.updated_by_id = req.body.updated_by_id;
           db.updated_date = req.body.updated_date;
           db.save(function (err, data) {
               if (err) {
                   console.log(err);
                   response = { "error": true, "message": err };
               } else {
                   response = { "error": false, "message": "Data added for ID :" + data._id ," Product Id ": data.product_id };
               }
               res.json(response);
           }); 
});

exports.findById = (function (req, res) {
    var response = {};
    mongoProducts.findById(req.params.id, function (err, data) {
        // This will run Mongo Query to fetch data based on ID.
        if (err) {
            response = { "error": true, "message":err };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});

exports.updateProduct = (function (req, res) {
    var response = {};
    var db = new mongoProducts();
    mongoProducts.findById(req.params.id, function (err, db) {
        if (err) {
            response = { "error": true, "message": err };
        }
        else {
            db.product_id = req.body.product_id;
            db.product_name = req.body.product_name;
            db.product_price = req.body.product_price;
            db.description = req.body.description;
            db.default_qty = req.body.default_qty;
            db.is_active = req.body.is_active;
            db.is_deleted = req.body.is_deleted;
            db.created_by_id = req.body.created_by_id;
            db.created_date = req.body.created_date;
            db.updated_by_id = req.body.updated_by_id;
            db.updated_date = req.body.updated_date;
            db.save(req.params.id, function (err) {
                if (err) {
                    response = { "error": true, "message":err };
                } else {
                    response = { "error": false, "message": "Data is updated for " + req.params.id };
                }
                res.json(response);
            })
        }
    });
});

exports.deleteProduct = (function (req, res) {
    var response = {};
    // find the data
    // mongoProducts.findById(req.params.id, function (err, data) {
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

      mongoProducts.update(  {_id:req.params.id}, {
    $set: { is_deleted: "True" }},function (err, data) {
        console.log(data);
        if (err) {
            response = { "error": true, "message": err };
        } else {
                response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };
                }
                res.json(response);
    });
});