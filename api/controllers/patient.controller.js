const DB = require('../../config/config');
const oracledb = require('oracledb');

module.exports.index = async (req, res) => {
    sql = `select ip_fname "ip_fname", ip_lname "ip_lname", ip_dob "ip_dob", ip_gender "ip_gender", ipcode "ip_pcode" from inpatient`;
    let result = await DB.Run(sql, [], false);
    res.json(result.rows);
};

module.exports.search = async (req, res) => {
    let q = req.query.q;
    sql = `select ip_fname as fname, ip_lname as lname, ip_dob as dob, ip_gender as gender, ipcode as pcode from inpatient\
           union all\
           select op_fname as fname, op_lname as lname, op_dob as dob, op_gender as gender, opcode as pcode from outpatient`;
    let result = await DB.Run(sql, [], false);
    var parentInfo = result.rows.filter((patient) => {
        fname = patient[0].concat(" ");
        patientName = fname.concat(patient[1]);
        return patientName.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    patients = parentInfo;
    res.render('patients/index', patients);
};

module.exports.get = async (req, res) => {
    let id = req.params.id;
    if (id.indexOf('IP') !== -1) {
        sql = `select ip_fname, ip_lname, ip_phone_no, startdate, enddate, sick_room, ip_diagnostic, result, med_name, inpatient.ipcode \
        from inpatient, treat, medication \
        where inpatient.ipcode = treat.ipcode and treat.med_code = medication.med_code and inpatient.ipcode = :ipcode`;
        var result = await DB.Run(sql, [id], false);
        if (result.rows.length > 0) {
            patientInfo = result.rows[0]
            res.render('patients/view', patientInfo);
        }
        else res.send("Patient did not take treatment!")
    }
    else {
        sql = `select op_fname, op_lname, op_phone_no, exam_date, second_exam_date, diagnosis, outpatient.opcode \
        from outpatient, examination \
        where outpatient.opcode = examination.op_code and outpatient.opcode = :opcode`;
        var result = await DB.Run(sql, [id], false);
        if (result.rows.length > 0) {
            patientInfo = result.rows[0]
            res.render('patients/view', patientInfo);
        }
        else {
            sql1 = `select op_fname, op_lname, op_phone_no, outpatient.opcode \
            from outpatient \
            where outpatient.opcode = :opcode`;
            var resultNewPatient = await DB.Run(sql1, [id], false);
            patientInfo = resultNewPatient.rows[0]
            res.render('patients/view', patientInfo);
        }
        
    }
};

module.exports.create = async (req, res) => {
    res.render('patients/create');
};

module.exports.post = async (req, res) => {
    let errors = [];
    if (!req.body.fname) {
        errors.push('First name is required.');
    }
    if (!req.body.lname) {
        errors.push('Last name is required.');
    }
    if (req.body.phone_no.length != 10 && req.body.phone_no.length != 12) {
        errors.push('Phone number is invalid.');
    }
    if (req.body.gender === 'Choose...') {
        errors.push('Gender is required.')
    }
    if (errors.length) {
        res.render('patients/create', {
            errors: errors,
            values: req.body
        });
        return;
    }
    if (req.body.dob) {
        var dob = req.body.dob.split("-");
        var year = dob[0].substr(2,2);
        var month = '';
        if (dob[1] === '01') month = 'JAN'
        else if (dob[1] === '02') month = 'FEB'
        else if (dob[1] === '03') month = 'MAR'
        else if (dob[1] === '04') month = 'APR'
        else if (dob[1] === '05') month = 'MAY'
        else if (dob[1] === '06') month = 'JUN'
        else if (dob[1] === '07') month = 'JUL'
        else if (dob[1] === '08') month = 'AUG'
        else if (dob[1] === '09') month = 'SEP'
        else if (dob[1] === '10') month = 'OCT'
        else if (dob[1] === '11') month = 'NOV'
        else if (dob[1] === '12') month = 'DEC'
        var day = dob[2];
        var newDOB = day + '-' + month + '-' + year;
    }
    
    if (req.body.admission_date) {
        var admission = req.body.admission_date.split("-");
        var year1 = admission[0].substr(2,2);
        var month1 = '';
        if (admission[1] === '01') month1 = 'JAN'
        else if (admission[1] === '02') month1 = 'FEB'
        else if (admission[1] === '03') month1 = 'MAR'
        else if (admission[1] === '04') month1 = 'APR'
        else if (admission[1] === '05') month1 = 'MAY'
        else if (admission[1] === '06') month1 = 'JUN'
        else if (admission[1] === '07') month1 = 'JUL'
        else if (admission[1] === '08') month1 = 'AUG'
        else if (admission[1] === '09') month1 = 'SEP'
        else if (admission[1] === '10') month1 = 'OCT'
        else if (admission[1] === '11') month1 = 'NOV'
        else if (admission[1] === '12') month1 = 'DEC'
        var day1 = admission[2];
        var newAdmissiondate = day1 + '-' + month1 + '-' + year1;
    }
    var gender = '';
    if (req.body.gender === 'male') gender = 'M'
    else gender = 'F';

    if (req.body.kindOfPatient === 'inpatient'){
        const sql1 = "Select max(ipcode) from inpatient";
        const result1 = await DB.Run(sql1, [], false);
        let newestIPcode = result1.rows[0][0];
        let newNumber = (parseInt(newestIPcode.substr(2,5)) + 1).toString()
        while (newNumber.length < 5) {
            newNumber = '0' + newNumber;
        }
        var newID = 'IP' + newNumber;
    }
    else {
        const sql1 = "Select max(opcode) from outpatient";
        const result1 = await DB.Run(sql1, [], false);
        let newestOPcode = result1.rows[0][0];
        let newNumber = (parseInt(newestOPcode.substr(2,5)) + 1).toString()
        while (newNumber.length < 5) {
            newNumber = '0' + newNumber;
        }
        var newID = 'OP' + newNumber;
    }
    if (req.body.kindOfPatient === 'inpatient'){
        const sql = `Insert into INPATIENT (IPCODE,IP_DOB,IP_GENDER,IP_ADDRESS,IP_FNAME,IP_LNAME,IP_PHONE_NO,SICK_ROOM,IP_DIAGNOSTIC,FEE,ADMISSION_DATE) \
        values (:id,to_date(:dob,'DD-MON-RR'),:gender,:address,:fname,:lname,:phone_no,:sick_room,:diagnostic,:fee,to_date(:admission_date,'DD-MON-RR'))`;
        var result = await DB.Run(sql, {
            id: newID,
            dob: newDOB,
            gender: gender,
            address:req.body.address,
            fname:req.body.fname,
            lname:req.body.lname,
            phone_no:req.body.phone_no,
            sick_room:parseInt(req.body.sick_room),
            diagnostic:req.body.diagnosis,
            fee:parseInt(req.body.fee),
            admission_date: newAdmissiondate
        }, true);
    }
    else {
        const sql = `Insert into OUTPATIENT (OPCODE,OP_DOB,OP_GENDER,OP_ADDRESS,OP_FNAME,OP_LNAME,OP_PHONE_NO) \
        values (:id,to_date(:dob,'DD-MON-RR'),:gender,:address,:fname,:lname,:phone_no)`;
        var result = await DB.Run(sql, {
            id: newID,
            dob: newDOB,
            gender: gender,
            address:req.body.address,
            fname:req.body.fname,
            lname:req.body.lname,
            phone_no:req.body.phone_no
        }, true);
    }
    res.redirect('/patients');
};