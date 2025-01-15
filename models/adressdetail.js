const mongoose = require('mongoose');


const addressDetailsSchema = new mongoose.Schema({
    unique_random_id: {
        type: String,
        required: true, // Reference Person's unique_random_id
      },
    address: String,
});
  

const AddressDetails = mongoose.model('AddressDetails', addressDetailsSchema);

module.exports = AddressDetails;

