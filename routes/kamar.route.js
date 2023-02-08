const express = require(`express`)
const app = express()
app.use(express.json())
const kamarController = require(`../controller/kamar_controller`)


app.get("/getAllKamar", kamarController.getAllKamar)
app.get("/findKamar", kamarController.findKamar)
app.post("/addKamar", kamarController.addKamar)
app.put("/updateKamar/:id", kamarController.updateKamar)
app.delete("/deleteKamar/:id", kamarController.deleteKamar)

module.exports = app 