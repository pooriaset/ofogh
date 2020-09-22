const mongoose = require("mongoose");
const Map = require("../models/map");
const ObjectId = mongoose.Types.ObjectId;
const {validationResult} = require("express-validator/check");

class MapController {
    async getById(req, res) {
        try {
            let map = await Map.findById(req.params.id);
            res.status(200).json(map);
        }
        catch (error) {
            res.status(500).json({ message: "خطای ناشناخته رخ داده است!", status: 500 });
        }
    }

    async getByPage(req, res) {
        const pagesize = 2;
        const page = req.params.page;
        try {
            let maps = await Map.find().skip(pagesize * (page - 1)).limit(pagesize);
            if (!maps.length) {
                res.status(500).json({
                    message: "موردی یافت نشد",
                    status: 500
                });
            }
            res.status(200).json({
                data: maps,
                status: 200,
                message: "با موفقیت به روز شد"
            });
        }
        catch (error) {
            res.json({
                message: "خطای ناشناخته رخ داده است!",
                status: 500
            });
        }
    }

    async createMap(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(422).json({
                message : "اعتبارسنجی با شکست مواجه شد. اطلاعات وارد شده صحیح نیست!",
                errors : errors.array()
            });
        }

        try {
            let newMap = new Map({
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                phone: req.body.phone,
                userid: ObjectId(req.user.id)
            });

            await newMap.save();
            res.status(201).json({ message: "با موفقیت ثبت شد!", status: 201 });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "خطای ناشناخته رخ داده است!", status: 500 });
        }

    }

    async updateOne(req, res) {
        try {

            await Map.updateOne({ _id: req.params.id }, { $set: req.body });

            res.status(200).json({
                message: "با موفقیت ویرایش شد!",
                status: 200
            });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "خطای ناشناخته رخ داده است!",
                status: 500
            });
        }
    }

    async deleteOne(req, res) {
        try {
            await Map.deleteOne({ _id: req.params.id });
            res.status(200).json({
                message: "با موفقیت حذف شد!",
                status: 200
            });

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "خطای ناشناخته رخ داده است!",
                status: 500
            });
        }
    }
}


module.exports = new MapController;