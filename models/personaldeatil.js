const mongoose = require('mongoose');



const personalDetailsSchema = new mongoose.Schema({
    unique_random_id: {
        type: String,
        required: true, // Reference Person's unique_random_id
      },
    age: Number,
    fatherName: String,
});

const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);

module.exports = PersonalDetails;


