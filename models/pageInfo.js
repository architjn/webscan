const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageInfoSchema = new Schema({
    stageOne: {
        ip: String,
        destination: String,
        origin: String,
        screenshot: String
    },
    stageTwo: {
        asn: String,
        ssl: {
            subjectName: String,
            issuer: String,
            validFrom: String,
            validTo: String,
            protocol: String
        }
    },
    stageThree: {
        body: String,
        text: String
    }
});
const PageInfo = mongoose.model('PageInfo', PageInfoSchema);
module.exports = PageInfo;