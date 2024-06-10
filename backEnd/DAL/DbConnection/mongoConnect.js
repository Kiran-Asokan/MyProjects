const mongoose = require('mongoose');

const uri = "mongodb+srv://kiranasokan:RcpRgdgCCl2G00kA@cluster0.dgkpp0n.mongodb.net/";


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log('Connected to DB')).catch((e) => console.log('Error', e))

