const FarmProductService = require("../services/FarmProductService");
module.exports = {
    async getFarmerProduct(req, res){
        try{
            const farmerId = req.farmerId;
            if(farmerId){
                result = await FarmProductService.getFarmerProduct(farmerId);
                res.send(result);
            }else{
                res.status(403).send({message: 'missing parameter userId'});
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
    async insertFarmerProduct(req, res){
        try{
            const farmerId = req.farmerId;
            const param = req.body;
            if(farmerId && param.productType && param.area && param.plantDate){
                result = await FarmProductService.insertFarmerProduct(farmerId, param.productType, param.area, param.plantDate);
                res.send(result);
            }else{
                res.status(403).send({message: `missing parameter${farmerId?'':' farmerId'}${param.productType?'':' productType'}${param.area?'':' area'}${param.plantDate?'':' plantDate'}`});
            }
        }catch(err){
            res.status(500).send({ message: err });
        }
    },
}