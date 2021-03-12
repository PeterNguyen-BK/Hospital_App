const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

var config = {
    user: "Manager",
    password: "nguyenthuan123",
    connectString: "localhost/xe" 
}

async function Run(sql, binds, autoCommit) {
    let connection = await oracledb.getConnection(config);
    let result = await connection.execute(sql, binds, { autoCommit });
    connection.release();
    return result;
}

exports.Run = Run;