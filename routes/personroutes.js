const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req body

const Person = require('./../models/Person');
const PersonalDetails = require('./../models/personaldeatil');
const AddressDetails = require('./../models/adressdetail');





const jwt = require('jsonwebtoken');

const SECRET_KEY = '9354948601'; // Replace with a strong secret key
const tokenExpiry = '1h'; // Token expiration time


// Email validation function
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


// Password validation function
function validatePassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}


router.post('/', async (req,res) => {
  const { firstname, lastname, email, password,createdAt,mobile, age, fatherName, address } = req.body;
  if (!firstname || !lastname  || !email || !password || !mobile){
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a digit.',
    });
  }
  try{
    //const data = req.body;// asssuming the request body conatins the person data
  
      //create a new person documents using the mongoose model
    

    const newPerson = await Person.create({firstname, lastname, email, password,createdAt, mobile});
    const uniqueId = newPerson.unique_random_id;



    await PersonalDetails.create({ unique_random_id: uniqueId, age, fatherName });
    await AddressDetails.create({ unique_random_id: uniqueId, address });




    console.log('data saved');
    res.status(201).json({
      message: 'User registered successfully',
      unique_random_id: uniqueId,
    });

  }catch (err){
    console.log(err);
    res.status(500).json({eroor:'internal serever eroor'});
  }
})


  // read the data for the get method

// router.get('/', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const data = await Person.findOne({ email, password });
//     console.log("signin successful");
//     if (!data) {
//       res.status(401).send('Error: Invalid email or password');
//     } else {
//       res.status(200).send(`Welcome ${data.firstname} ${data.lastname}`);
//     }
//     console.log("data fetched"); 
//     res.status(200).json({
//       message: 'Login successful',
//       data: {
//         firstname: data.firstname,
//         lastname: data.lastname,
//       },
//     });
//   }catch (error) {
//     console.log(error);
//     res.status(500).send({error:'internal serever errror'});
//     return;
//   }
// });








router.post('/login', async (req, res) => {
  const { email, password, mobile } = req.body;

  try {
    const user = await Person.findOne({email: email});
    if( !user || !(await user.comparePassword(password))){
      return res.status(401).json({ message: 'Invalid email or password' });
    }



    
    const token = jwt.sign({ email, firstName: user.firstname, lastName: user.lastname}, SECRET_KEY, { expiresIn: tokenExpiry });
    res.json({token, firstname: user.firstname, lastname: user.lastname, user:user});

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});


// Verify JWT middleware
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(403).json({ message: 'Token required' });

  const token = authorization.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

router.get('/home', verifyJWT, (req, res) => {
  res.json({ user: req.user });
  
});





// router.get('/:worktype', async (req,res) => {
//     try{
//         const worktype = req.params.worktype; // extract the worktype of url paramater
//         if (worktype == 'chef' || worktype == 'waiter' || worktype == 'manager'){
//             const response = await Person.find({work:worktype});
//             console.log("response feteched");
//             res.status(200).json(response);
//         }else{
//             res.status(404).json({error:"invalid work type"})
//         }
//     }catch (error) {
//         res.status(500).send('Error signing in: ' + error.message);
//     }
// })

// puth method
// router.put('/:id', async (req,res) => {
//     try{
//         const personid = req.params.id; // extract the worktype of url paramater
//         const updatedPersonData = req.body; // updated data for person

//         const response = await Person.findByIdAndUpdate(personid,updatedPersonData ,{
//             new : true, //return the updated document 
//             runValidators:true // run mongoose validation 
//         })

//         if(!response){
//             return res.status(404).json({error:"person not found"})
//         }

//         console.log("data updated");
//         res.status(200).json(response);

//     }catch (error) {
//         res.status(500).send('Error signing in: ' + error.message);
//     }

// })


module.exports=router;