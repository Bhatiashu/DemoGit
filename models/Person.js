const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');




// define  person schema 
const Personschema = new mongoose.Schema({
    unique_random_id: {
        type: String,
        default: uuidv4, // Automatically generate a unique ID
        unique: true, // Ensure ID is unique
      },
      
    firstname : {
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    createdAt: { 
        type: Date, 
        default: () => new Date()
    },
    mobile:{
        type:String,
        required:true
    }

})


Personschema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

Personschema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}








//create person schema
const Person = mongoose.model('Person',Personschema);


module.exports = Person;
