const express = require('express')
const auth = require('../../middleware/auth')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {body,validationResult} = require('express-validator')
const User = require('../../models/User')
const router = express.Router();

// @route GET api/auth
// @desc  Test route
// @access Public

router.get('/',auth,async (req,res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch (err) {
    console.log(err)
    res.status(500).send('Server Error');        
    }
})

// @route POST api/auth
// @desc  Authenticate user & get Token
// @access Public
router.post('/',[
    body('email','Please insert a valid Email').isEmail(),
    body('password','Password is required').exists()
        ],
    async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password} = req.body;

    try {

    let user = await User.findOne({email})

    if(!user){
       return  res.status(400).json({errors:[{msg:'Invalid Credentials'}]})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return  res.status(400).json({errors:[{msg:'Invalid Credentials'}]})
    }
    
    const payload = {
        user:{
            id:user.id
        }
    }
    jwt.sign(payload,config.get('JWTSecret'),{expiresIn:360000},(err,token) =>{
        if(err) throw err
        res.json({token})
    })
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')    
    }



})


module.exports = router