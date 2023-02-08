const { request, response } = require("express")
const db = require("../models/index")
const kamarModel = require(`../models/index`).kamar
const tipe_kamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op

// const Sequelize = require("sequelize")
// const sequelize = new Sequelize("hotel_ukk","root","",{
//     host: "localhost",
//     dialect: "mysql"
// })


exports.getAllKamar = async (request, response) => {
    try{
        let kamars = await kamarModel.findAll()
        return response.json({
        success: true,
        data: kamars,
        message: `semua data sukses ditampilkan`
    })
    // const result = await sequelize.query(
    //     `Select * from kamars`
    // ); response.json(result)
    // console.log(result) 
    }catch{
      response.send("err")  
    }
    
}

exports.findKamar = async (request, response) => {

    try{
        let params = {
            nomor_kamar : request.body.nomor_kamar
        }

        console.log(params.nomor_kamar)
        try{
            const results = await kamarModel.findAll({
                where : params
            })
            return response.json({
                result : results
            })
            // const result = await sequelize.query(
            //     `Select * from kamars"`
            // );
        }catch(err){
            response.json({
                message: "jihan dong",
                error: err

            })
        }
    }catch(err){
        response.json(err)
    }
   
}

exports.addKamar = async (request, response) => {

    let newKamar = {
        nomor_kamar: request.body.nomor_kamar,
        tipeKamarId: request.body.tipeKamarId,

    }
    console.log(newKamar);
    let tipe_kamar = await tipe_kamarModel.findOne({
        where: {
            id: newKamar.tipeKamarId,
        },
    })
    let tes = newKamar.tipeKamarId == tipe_kamar.id
    console.log(tes)
    if (tes) {
        kamarModel.create(newKamar).then((result) => {
            return response.json({
                success: true,
                data: result,
                message: `kamar telah ditambahkan`
            })
        })

            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    } else {
        return response.json({
            success: false,
            message: "Room types doesn't exist"
        })
    }
}




exports.updateKamar = async (request, response) => {

    let id = request.params.id
    let kamar = {
        nomor_kamar: request.body.nomor_kamar,
        tipeKamarId: request.body.tipeKamarId,
    }
    kamarModel.update(kamar, { where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data terupdate`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: 'gabisa'
            })
        })
}


exports.deleteKamar = async (request, response) => {
    let id = request.params.id

    kamarModel.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data tipe kamar has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}