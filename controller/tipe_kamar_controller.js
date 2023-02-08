const { request, response } = require("express")
const tipe_kamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op
const upload = require(`./upload-foto`).single(`foto`)
const path  = require("path")
const fs = require(`fs`)

exports.getAllTipeKamar = async (request, response) => {
    let tipe_kamars = await tipe_kamarModel.findAll()
    return response.json({
    success: true,
    data: tipe_kamars,
    message: `semua data sukses ditampilkan`
    })
}

exports.findTipeKamar = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar
    let harga = request.body.harga

    let tipe_kamars = await tipe_kamarModel.findAll({
    where: {
    [Op.or]: [
    { nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } },
    { harga: { [Op.substring]: harga
    } },
    ]
    }
    })
    return response.json({
        success: true,
        data: tipe_kamars,
        message: `ini tipe kamar yang anda cari yang mulia`
        })
}

exports.addTipeKamar = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        
        if (!request.file) {
            return response.json({ message: `Nothing to Upload(minimal upload file sek lah!)`
        })
    }
    
    let newTipeKamar = {
        nama_tipe_kamar: request.body.nama_tipe_kamar,
        harga: request.body.harga,
        deskripsi: request.body.deskripsi,
        foto: request.file.filename,
        
    }
    
    tipe_kamarModel.create(newTipeKamar).then(result => {
        return response.json({
            success: true,
            data: result,
            message: `tipe kamar telah ditambahkan`
        })
    })
    
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
})
}

exports.updateTipeKamar = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        let id = request.params.id
        let tipe_kamar = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
            foto: request.file.filename,
            
        }
        
        if (request.file) {
            const selectedTipeKamar = await tipe_kamarModel.findOne({
                where: { id: id }
            })
            
            const oldFotoTipeKamar = selectedTipeKamar.foto
            const pathFoto = path.join(__dirname, `../foto`, oldFotoTipeKamar)
            
            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                    console.log(error))
                }
                tipe_kamar.foto = request.file.filename
            }
            
            tipe_kamarModel.update(tipe_kamar, { where: { id: id } })
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data terupdate`
                })
            })
            .catch(error => {
                return response.json({

                })
            })
        })
}

exports.deleteTipeKamar = async (request, response) => {
    const id = request.params.id
    const tipe_kamar = await tipe_kamarModel.findOne({ where: { id: id } })
    const oldFotoTipeKamar = tipe_kamar.foto
    const pathFoto = path.join(__dirname, `../foto`, oldFotoTipeKamar)
    
    if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, error => console.log(error))
    }
    
    tipe_kamarModel.destroy({ where: { id: id } })
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