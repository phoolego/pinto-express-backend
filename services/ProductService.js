module.exports = {
    async getProductType(){
        try{
            let sql = `SELECT name, name_eng, price_buy, price_sell, unit, CONCAT(? , picture_of_product) AS picture_of_product
            FROM type_of_product;`;
            return await db.pintodb.query(sql,[process.env.BASE_URL]);
        }catch(err){
            throw err.message;
        }
    },
    async insertProductType(name, nameEng, priceBuy, priceSell, unit){
        try{
            sql = `INSERT INTO type_of_product (name, name_eng, price_buy, price_sell, unit)
            VALUE(?,?,?,?,?);`;
            return await db.pintodb.query(sql,[name, nameEng, priceBuy, priceSell, unit]);
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `duplicte named`;
            }
            throw err.message;
        }
    },
    async updateProductType(oldName,name, nameEng, priceBuy, priceSell, unit){
        try{
            let sql =`UPDATE type_of_product
            SET name=?, name_eng=?, price_buy=?, price_sell=?, unit=?
            WHERE name = ?;`;
            return await db.pintodb.query(sql,[name, nameEng, priceBuy, priceSell, unit, oldName]);
        }catch(err){
            throw err.message;
        }
    },
    async updateProductTypePic(name, productPic){
        try{
            let sql =`UPDATE type_of_product
            SET picture_of_product=?
            WHERE name = ?;`;
            return await db.pintodb.query(sql,[productPic,name]);
        }catch(err){
            throw err.message;
        }
    }
}