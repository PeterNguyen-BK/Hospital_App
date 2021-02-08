const DB = require('../config/config');
const oracledb = require('oracledb');

module.exports.get = async (req, res) => {
    res.render('login');
}

module.exports.post = async (req, res) => {
    try {
        let connection = await oracledb.getConnection({
            user: req.body.username,
            password: req.body.password,
            connectString: "localhost/xe" 
        });
        res.cookie('userId', 'qwdxweASADsdmn');
        res.redirect('/patients')
    } catch (err){
        error=[];
        error.push("Login failed. Username/Password is incorrect.");
        if (error.length) {
            res.render('login', {
                errors: error,
                values: req.body
            });
            return;
        }
    }
    
}