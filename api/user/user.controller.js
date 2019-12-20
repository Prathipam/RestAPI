const { create,getUsers,getUsersById,getUsersByEmail,updateUser,deleteUser } = require('./user.service');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require('jsonwebtoken');

//var decrypted = sfet.rsa.decrypt(keys.private, encrypted);
module.exports = {
    createUser:(req,res) =>{
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body,(err,result) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message:'Database Connection error'
                });                
            }
            return res.status(200).json({
                success:1,
                data:result
            });
        });
    },

    login:(req,res) =>{
        const body = req.body;
        getUsersByEmail(body.email,(err,result)=>{
            if(err){
                console.log(err);
                return
            }
            console.log(result);
            if(!result){
               return res.json({
                    success:0,
                    message:'Invalid Email or Password'
                }); 
            }     
            const check = compareSync(body.password, result.password);
            if(check){
                result.password = undefined;
                const token = sign({result:result},"restapi",{expiresIn:"1h"});
                return res.json({
                    success:1,
                    message:"Login Successfully",
                    token:token
                });
            }
            else{
                return res.json({
                    success:0,
                    message:'Invalid Email or Password'
                }); 
            }
        })
    },

    getUsers:(req,res) =>{
       
        getUsers((err,result) => {
            if(err){
                console.log(err);
                return;
            }
            if(!result){
                console.log('Record not found');
                return res.json({
                    success:0,
                    message:'Record not found'
                });
            }
            return res.json({
                success:1,
                message:result
            });
        });
    },
    getUsersById:(req,res) => {
        const id = req.params.id;
       
        getUsersById(id,(err,result) => {
            if(err){
                console.log(err);
                return;
            }
            if(!result){
                console.log('Record not found');
                return res.json({
                    success:0,
                    message:'Record not found'
                });
            }
            return res.json({
                success:1,
                data:result
            });
        });
    },

    updateUser: (req,res) =>{
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body,(err,result) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message:'Database Connection error'
                });                
            }
            return res.status(200).json({
                success:1,
                message:'Record Updated successfully'
            });
        });
    },
    deleteUser:(req,res) => {
        const id = req.params.id;
       
        deleteUser(id,(err,result) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success:1,
                message:'Record deleted successfully'
            });
        });
    }
}
