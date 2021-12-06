const UserService = require("../services/UserService");
const StockService = require("../services/StockService");
const AdminSerivce = require("../services/AdminService");
const ProductService = require("../services/ProductService");
const UploadFile = require('../services/FileUpload');

module.exports = {
  async registerUser(req, res){
    try{
      param = req.body
      if(param.firstname && param.lastname && param.email && param.password && param.address && param.contact){
        result = await UserService.insertUser(param.firstname, param.lastname, param.email, param.password, param.address, param.contact, 'CUSTOMER');
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${param.firstname?'':' firstname'}${param.lastname?'':' lastname'}${param.email?'':' email'}${param.password?'':' password'}${param.address?'':' address'}${param.contact?'':' contact'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getSellProduct(req, res){
    try{
      sellProduct = await ProductService.getSellProduct();
      preOrderProduct = await ProductService.getPreOrderProduct()
      result = sellProduct.concat(preOrderProduct);
      res.send(result);
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getSellProductDetail(req, res){
    try{
      if(req.query.productType)
      {
        result = await ProductService.getSellProductDetail(req.query.productType);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${req.query.productType?'':' productType'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getPreOrderProductDetail(req, res){
    try{
      if(req.query.productType)
      {
        result = await ProductService.getPreOrderProductDetail(req.query.productType);
        res.send(result);
      }else{
        res.status(403).send({
          message: `missing parameter${req.query.productType?'':' productType'}`
        });
      }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
  async getStockDetail(req, res){
    try{
        const param = req.query;
        if(param.productType){
            result = await StockService.getStockDetail(param.productType);
            res.send(result);
        }else{
            res.status(403).send({
                message: `missing parameter${param.productType?'':' productType'}`,
            });
        }
    }catch(err){
      if(err.message){
        res.status(500).send({ message: err.message });
      }else{
        res.status(500).send({ message: err });
      }
    }
  },
};
  