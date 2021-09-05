module.exports = {
    async insertUser(username, email, password, address, contact, role){
        try{
            let sql = `INSERT INTO user (username, email, password, address, contact, role)
            VALUES (?, ?, ?, ?, ?, ?);`;
            return await db.pintodb.query(sql,[username, email, password, address, contact, role]);
        }catch(err){
            throw err.name+': '+err.message;
        }
    },
}