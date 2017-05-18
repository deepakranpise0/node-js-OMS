var express = require('express');
var bodyParser = require('body-parser'); /*Parses the data seerved from client*/
var mongoose = require('mongoose');
var mongoOrder_item = require('../models/order_item');

exports.getOrder_items = (function (req, res) {
    var perpage = 10;
    var page = req.params.page;
    console.log(page);
    var response = {};
    mongoOrder_item.find({}).populate('order_items').exec(function (err, data) {
        if (err) {
            response = { "error": true, "message": err};
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    }).limit(perpage).skip(perpage * (page - 1));
});

exports.find = (function (req, res) {
    var response = {};
    var order_item_id = req.body.order_item_id;
    var order_id = req.body.order_id;
    var product_id = req.body.product_id;

    mongoOrder_item.find({
        $or: [{ order_item_id: order_item_id },
        { order_id: order_id },
        { mobile_no: mobile_no },
        { product_id: product_id }
        ]
    },
        function (err, data) {
            if (err) {
                response = { "error": true, "message": err};
            } else {
                response = { "error": false, "message": data };
            }
            res.json(response);
        });
});

exports.saveOrder_item = (function (req, res) {
    var db = new mongoOrder_item();
    var response = {};
    db.order_item_id = req.body.order_item_id;
    db.order_id = req.body.order_id;
    db.product_id = req.body.product_id;
    db.product_price = req.body.product_price;
    db.product_qty = req.body.product_qty;
    db.total_price = req.body.total_price;
    db.save(function (err) {
        if (err) {
            response = { "error": true, "message": err };
        } else {
            response = { "error": false, "message": "Data added" };
        }
        res.json(response);
    });
});

exports.updateOrder_item = (function (req, res) {
    var response = {};
    var db = new mongoOrder_item();
    mongoClient.findById(req.params.id, function (err, db) {
        if (err) {
            response = { "error": true, "message": err };
        }
        else {
            db.order_item_id = req.body.order_item_id;
            db.order_id = req.body.order_id;
            db.product_id = req.body.product_id;
            db.product_price = req.body.product_price;
            db.product_qty = req.body.product_qty;
            db.total_price = req.body.total_price;
            db.save(req.params.id, function (err) {
                if (err) {
                    response = { "error": true, "message": err };
                } else {
                    response = { "error": false, "message": "Data is updated for " + req.params.id };
                }
                res.json(response);
            })
        }
    });
});

exports.deleteOrder_item = (function (req, res) {
    var response = {};
    // mongoOrder_item.findById(req.params.id, function (err, data) {
    //     console.log(data);
    //     if (err) {
    //         response = { "error": true, "message": "Error fetching data" };
    //     } else {
    //         mongoOrder_item.remove({ _id: req.params.id }, function (err) {
    //             if (err) {
    //                 response = { "error": true, "message": "Error deleting data" };
    //             } else {
    //                 response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };
    //             }
    //             res.json(response);
    //         });
    //     }
    // });


     mongoOrder_item.findOneAndUpdate({_id:req.params.id},{$set:{is_deleted:true}},function (err, data) {
        console.log(data);
        if (err) {
            response = { "error": true, "message": err };
        } else {
            response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };
        }
    });
});