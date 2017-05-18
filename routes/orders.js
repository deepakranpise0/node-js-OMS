var express = require('express');
var bodyParser = require('body-parser'); /*Parses the data seerved from client*/
var mongoose = require('mongoose');
var mongoOrders = require('../models/orders');
var mongoOrder_item = require('../models/order_item');
var Record_count;

exports.getOrders = (function (req, res) {
    mongoOrders.aggregate([
        {
            $lookup:
            {
                from: "order_items",
                localField: "order_id",
                foreignField: "order_id",
                as: "OrderItems"
            }
        }
    ]).exec(function (err, data) {
        if (err) {
            response = { "error": true, "message": err };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});


exports.getOrderId = (function (req, res, next) {
    mongoOrders.find().sort({ _id: -1 }).limit(1).exec(function (err, count) {
        if (err) {
            response = { "error": true, "message": err };
        }
        else {
           
            Record_count = parseInt(count[0].order_id + 1);
            next();
        }
    });
});

exports.saveOrder = (function (req, res) {
    var db = new mongoOrders();
    var db_orderItem = new mongoOrder_item();
    var response = {};
    var saveOrder = new mongoOrders({
        order_id: Record_count,
        client_id: req.body.client_id,
        order_status: req.body.order_status,
        total_qty: req.body.total_qty,
        final_price: req.body.final_price,
        is_active: req.body.is_active,
        is_deleted: req.body.is_deleted,
        created_by_id: req.body.created_by_id,
        created_date: req.body.created_date,
        updated_by_id: req.body.updated_by_id,
        updated_date: req.body.updated_date
    });
    saveOrder.save(function(err) {
        if (err) {
            response = { "error": true, "message": err};
        } else {
            for (var i = 0; i < req.body.total_qty; i++) {
                (function (i) {
                    console.log("Array" + i);
                    mongoOrder_item.find({}, function (err, data) {
                        if (err) {
                            response = { "error": true, "message": "Error fetching Numbers of Records " };
                            console.log("Find Order err item");
                        }
                        else {
                            console.log("Find Order data item");
                            var Record_Count = data[0].order_item_id;
                            console.log("Array Count" + i);
                            var saveOrderItems = new mongoOrder_item({
                                order_item_id: parseInt(Record_Count + (i + 1)),
                                order_id: Record_count,
                                product_id: req.body.OrderItems[i].product_id,
                                product_price: req.body.OrderItems[i].product_price,
                                product_qty: req.body.OrderItems[i].product_qty,
                                total_price: req.body.OrderItems[i].total_price,
                            })
                            saveOrderItems.save(function (err) {
                                if (err) {
                                    response = { "error": true, "message": err };
                                } else {
                                    response = { "error": false, "message": "Order Items Data added" };
                                    res.json(response);
                                }
                            });
                        }
                    }).sort({ _id: -1 }).limit(1);

                    response = { "error": false, "message": "Data added" };
                    //res.json(response);
                })(i);
            }
        }
    });
});

exports.findById = (function (req, res) {
    var response = {};
    mongoOrders.findById(req.params.id, function (err, data) {
        // This will run Mongo Query to fetch data based on ID.
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});

exports.find = (function (req, res) {
    var dateOne = req.body.start_date;
    var dateTwo = req.body.end_date;
    var perpage = req.body.perpage;
    var page = req.body.page;
    var order_id = req.body.order_id;
    var order_status = req.body.order_status;


    // mongoOrders.find({ created_date: { $gt: new Date(dateOne) } }).count({}, function (err, count) {
    //     if (err) {
    //         response = { "error": true, "message": "Error fetching data" };
    //     }
    //     else {
    //         Record_count = count;
    //         console.log(Record_count);
    //     }
    // });


    // var response = {};
    // mongoOrders.find({$or:[
    //     { created_date: { $gt: new Date(dateOne), $lt: new Date(dateTwo) }},
    //     {order_id:req.params.order_id},
    //     {order_status:req.params.order_status}
    //     ]},
    //      function (err, data) {
    //     if (err) {
    //         response = { "error": true, "message": "Error fetching data" };
    //         console.log(err);
    //     } else {
    //         response = { "error": false, "message":data };
    //     }
    //     res.json(response);
    // }).limit(perpage).skip(perpage * (page - 1));

    mongoOrders.aggregate([
        {
            $match: {
                created_date: { $gt: new Date(dateOne), $lt: new Date(dateTwo) },

            }
        },
        {
            $lookup: {
                from: "order_items",
                localField: "order_id",
                foreignField: "order_id",
                as: "OrderItems"
            }
        }], function (err, data) {
            if (err) {
               // console.log(err);
                response = { "error": true, "message": err };
            } else {
                console.log(order_id);
                console.log(order_id);
                console.log(order_status);
                response = { "error": false, "message": data };
            }
            res.json(response);
        });

});

exports.updateOrder = (function (req, res) {
    var response = {};
    var db = new mongoOrders();
    mongoOrders.findById(req.params.id, function (err, db) {
        if (err) {
            response = { "error": true, "message":err};
        }
        else {
            db.order_id = req.body.order_id;
            db.client_id = req.body.client_id;
            db.order_status = req.body.order_status;
            db.total_qty = req.body.total_qty;
            db.final_price = req.body.final_price;
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

exports.deleteOrder = (function (req, res) {
    var response = {};

    // find the data

    // mongoOrders.findById(req.params.id, function (err, data) {
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

    mongoOrders.findOneAndUpdate({ _id: req.params.id }, { $set: { is_deleted: true } }, function (err, data) {
        console.log(data);
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };
        }
    });
});