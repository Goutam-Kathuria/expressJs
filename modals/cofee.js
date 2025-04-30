const mongoose = require('mongoose');
const slugify = require('slugify');
const { image } = require('../config/cloudinary');

const cofeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    calories: { type: Number, required: true },
    price: { type: Number, required: true },
},{ timestamps: true });
cofeeSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name);
    }
    next()
})
const Cofee = mongoose.model('Cofee', cofeeSchema)
module.exports = Cofee