const DB = require('../config/config');

module.exports.index = async function(req, res) {
    payments = [];
    res.render('payment/index', payments);
};

module.exports.search = async function(req, res) {
    let q = req.query.q;
    sql = "select ip_fname as fname, ip_lname as lname, ip_dob as dob, ip_gender as gender, ipcode as pcode from inpatient\
           union all\
           select op_fname as fname, op_lname as lname, op_dob as dob, op_gender as gender, opcode as pcode from outpatient";
    let result = await DB.Run(sql, [], false);
    var patientInfo = result.rows.filter(function(patient) {
        fname = patient[0].concat(" ");
        patientName = fname.concat(patient[1]);
        return patientName.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    if (patientInfo.length){
        if (patientInfo[0][4].indexOf("IP") !== -1) {
            try {
                sql1 = "SELECT PRICE, MED_NAME \
                FROM MEDICATION, TREAT\
                WHERE TREAT.MED_CODE = MEDICATION.MED_CODE AND IPCODE = :id";
                let result1 = await DB.Run(sql1, [patientInfo[0][4]], false);
                sql2 = "SELECT FEE, IP_FNAME, IP_LNAME \
                FROM INPATIENT\
                WHERE IPCODE = :id";
                let result2 = await DB.Run(sql2, [patientInfo[0][4]], false);
                var totalMed = 0;
                var payment = result1.rows.concat([result2.rows[0]]);
                for (let price of payment) {
                    totalMed += price[0]
                }
                payment = payment.concat([totalMed]);
            } catch {
                payments=["Patient has just take the treatment."];
                res.render('payment/index', payments);
                return;
            }
            
        }
        else {
            try {
                sql1 = "SELECT PRICE, MED_NAME \
                FROM MEDICATION, PRESCRIPT\
                WHERE PRESCRIPT.MED_CODE = MEDICATION.MED_CODE AND OP_CODE = :id";
                let result1 = await DB.Run(sql1, [patientInfo[0][4]], false);
                sql2 = "SELECT FEE, OP_FNAME, OP_LNAME \
                FROM OUTPATIENT, EXAMINATION\
                WHERE OPCODE = OP_CODE AND OPCODE = :id";
                let result2 = await DB.Run(sql2, [patientInfo[0][4]], false);
                var totalMed = 0;
                var payment = result1.rows.concat([result2.rows[0]]);
                for (let price of payment) {
                    totalMed += price[0]
                }
                payment = payment.concat([totalMed]);
            } catch {
                payments=["Patient has just take the examination."];
                res.render('payment/index', payments);
                return;
            }
            
        }
        payments = payment;
        res.render('payment/index', payments);
    }
    else {
        payments = [true];
        res.render('payment/index', payments)
    }
    
};