const express = require('express');
const app = express();
const db = require('./db');
const bcrypt = require('bcrypt');
var cors = require('cors')

const Person = require('./models/Person');
const PersonalDetails = require('./models/personaldeatil');
const AddressDetails = require('./models/adressdetail');



app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));


const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req body




//console.log("In router")


app.get('/', function (req, res) {
  res.send('welcome to our hotel')
});



app.post('/api/data', async (req, res) => {

  const { firstname, mobile, startDate, endDate, page = 1, limit = 10} = req.body;

  



  let query = {};

  if (firstname) {
    query.firstname = { $regex: new RegExp(`^${firstname}`, 'i') };
  }

  if (mobile) {
    query.mobile = mobile;
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lt: new Date(new Date(endDate).setUTCDate(new Date(endDate).getUTCDate() + 1)), // Start of the next day
    };
  }


  try {
    // Calculate pagination

    const skip = (page - 1) * limit;

    const data = await Person.find(query)
      .skip(skip)
      .limit(limit);


      

    const totalCount = await Person.countDocuments(query); // Count total documents for pagination
    
    const totalPages = Math.ceil(totalCount / limit);



    const uniqueIds = data.map((Person) => Person.unique_random_id);
    

    const personDetailsData = await PersonalDetails.find({ unique_random_id: { $in: uniqueIds } }).lean();
    const personAddressData = await AddressDetails.find({ unique_random_id: { $in: uniqueIds } }).lean();
    
    
    console.log('Unique IDs:', uniqueIds);

    // Merge the data
    const mergedData = data.map((Person) => {
      const details = personDetailsData.find((detail) => detail.unique_random_id === Person.unique_random_id) || null;
      const address = personAddressData.find((address) => address.unique_random_id === Person.unique_random_id) || null;
      return {
        ...Person.toObject(),
        details,
        address,
      };
    });





    



    if (mergedData.length > 0) {
      res.status(200).json({data: mergedData, totalPages }); // Send data and total pages to client
    } else {
      res.status(404).json({ message: 'No data found' }); // Handle no data case
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});






//import route file
const personroutes = require('./routes/personroutes');
//use the routes
app.use('/person',personroutes);


app.listen(3000, () =>{
  console.log('listern on port 3000')
});














