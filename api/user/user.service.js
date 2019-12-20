const { createPool } = require('mysql');

const pool = createPool({
    connectionLimit : 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,    
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    
});
module.exports = {
    create: (data, callBack) => {
        pool.query(`insert into users (first_name,last_name,email,password,phone_number) values(?,?,?,?,?)`,        [
            data.first_name,
            data.last_name,
            data.email,
            data.password,
            data.phone_number
        ],(err,result,fields) =>{
            if(err){
                callBack(err);
            }
            return callBack(null,result);
        })
    },

    getUsers: (callBack) =>{
        pool.query(`select id, first_name,last_name,email,password,phone_number from users`,
        [],
        (err,result,fields) => {
            if(err){
                callBack(err);
            }
            return callBack(null,result); 
        });
    },

    getUsersById:(id,callBack) => {
        pool.query(`select id, first_name,last_name,email,password,phone_number from users where id = ?`,
        [id],
        (err,result,fields)=> {
            if(err){
                callBack(err);
            }
            
            return callBack(null,result[0]); 
        });
    },

    getUsersByEmail: (email,callBack) => {
        pool.query(`select *from users where email =?`,
        [email],
        (err,result,fields)=> {
            if(err){
                callBack(err);
            }
            return callBack(null,result[0]); 
        });
        
    },

    updateUser: (data,callBack) => {
        pool.query(`update users set first_name=?,last_name= ?,email=?,password=?,phone_number =? where id=?`,
        [data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.phone_number,
        data.id
         ],
         (err,result,fields)=> {
            if(err){
                callBack(err);
            }
            return callBack(null,result[0]); 
        });
         
    },

    deleteUser:(id,callBack) =>{
        pool.query('delete from users where id = ?',
        id,
        (err,result,fields)=> {
            if(err){
                callBack(err);
            }
            return callBack(null,result[0]); 
        });
        
    }
    
}

