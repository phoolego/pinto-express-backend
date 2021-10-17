module.exports = {
    async getProductType(){
        try{
            let sql = `SELECT name, name_eng, price_buy, price_sell, unit, picture_of_product
            FROM type_of_product;`;
            return await db.pintodb.query(sql,[]);
        }catch(err){
            throw err.message;
        }
    },
    async insertProductType(name, nameEng, priceBuy, priceSell, unit, productPic){
        try{
            sql = `INSERT INTO type_of_product (name, name_eng, price_buy, price_sell, unit, picture_of_product)
            VALUE(?,?,?,?,?,?);`;
            return await db.pintodb.query(sql,[name, nameEng, priceBuy, priceSell, unit, productPic]);
        }catch(err){
            throw err.message;
        }
    },
}