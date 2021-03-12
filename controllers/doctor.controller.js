const DB = require('../config/config');

module.exports.index = async function(req, res) {
    // sql = 'select * from doctor, employee where dcode = ecode';
    // let result = await DB.Run(sql, [], false);
    // doctors = result.rows;
    doctors = [true];
    res.render('doctors/index',doctors);
    // res.render('doctors/index', doctors)
};

module.exports.search = async function(req, res) {
    let q = req.query.q;
    sql = 'WITH patient AS \
    (\
        SELECT DOC_CODE, OP_FNAME AS FNAME, OP_LNAME AS LNAME, OP_PHONE_NO AS PHONE_NO, OP_DOB AS DOB\
        FROM OUTPATIENT, EXAMINATION\
        WHERE OUTPATIENT.OPCODE = EXAMINATION.OP_CODE\
        UNION ALL\
        SELECT DOC_CODE, IP_FNAME AS FNAME, IP_LNAME AS LNAME, IP_PHONE_NO AS PHONE_NO, IP_DOB AS DOB\
        FROM INPATIENT, TREAT\
        WHERE INPATIENT.IPCODE = TREAT.IPCODE\
    )\
    SELECT patient.FNAME, patient.LNAME, patient.PHONE_NO, patient.DOB, employee.fname, employee.lname\
    FROM patient, DOCTOR, EMPLOYEE\
    WHERE DOCTOR.DCODE = EMPLOYEE.ECODE AND patient.DOC_CODE = DOCTOR.DCODE'
    let result = await DB.Run(sql, [], false);
    console.log(result.rows);
    var listDoctors = result.rows.filter(function(patient) {
        fname = patient.FNAME_1.concat(" ");
        doctorName = fname.concat(patient.LNAME_1);
        // console.log(doctorName);
        return doctorName.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });
    // res.send(doctors);
    doctors = listDoctors;
    res.render('doctors/index', doctors)
};