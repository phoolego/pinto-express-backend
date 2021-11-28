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
            let sql = `INSERT INTO type_of_product (name, name_eng, price_buy, price_sell, unit)
            VALUE(?,?,?,?,?);`;
            await db.pintodb.query(sql,[name, nameEng, priceBuy, priceSell, unit]);
            sql = `INSERT INTO stock (product_type)
            VALUE(?);`;
            return await db.pintodb.query(sql,[name]);
        }catch(err){
            if(err.code=='ER_DUP_ENTRY'){
                throw `duplicate named`;
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
    },
    async getSellProduct(){
        try{
            let sql = `SELECT name, name_eng, price_buy, unit, selling_amount, CONCAT(? , picture_of_product) AS picture_of_product
            FROM type_of_product
            JOIN stock ON stock.product_type = type_of_product.name
            where selling_amount > 0;
            ;`;
            return await db.pintodb.query(sql,[process.env.BASE_URL]);
        }catch(err){
            throw err.message;
        }
    },
    async getSellProductDetail(productType){//ยังไม่เสร็จ
        try{
            let sql = `SELECT name, name_eng, price_buy, unit, selling_amount, CONCAT(? , picture_of_product) AS picture_of_product
            FROM type_of_product
            JOIN stock ON stock.product_type = type_of_product.name
            where stock.product_type = ?;
            ;`;
            const productDetail = await db.pintodb.query(sql,[process.env.BASE_URL,productType]);
            sql = `SELECT 
            FROM send_stock_product as ssp
            JOIN stock ON stock.product = type_of_product.name
            where stock.product_type = ?;
            ;`;
            const sourceFarm = await db.pintodb.query(sql,[process.env.BASE_URL,productType]);
        }catch(err){
            throw err.message;
        }
    },
}