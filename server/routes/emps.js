var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

if(process.env.DATABASE_URL) {//connecting to outside heroku database
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else{//connecting to local database before being connected to heroku for testing purposes
  connectionString = 'postgress://localhost:5432/db_employees';
}




router.post("/*", function(req,res){
  var fldEmpFirstName = req.body.empFirstName;
  var fldEmpLastName = req.body.empLastName;
  var fldEmpNumber = req.body.empIdNumber;
  var fldEmpSalary = req.body.empAnnualSalary;
  var fldEmpTitle = req.body.empTitle;
  var fldEmpActive = 'true';
  var strSql = '';
  var arrFields =[];


  console.log("totally insert into employees",req.body);

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    // fldEmpFirstName, fldEmpLastName, fldEmpNumber, fldEmpSalary, fldEmpTitle, fldEmpActive

    strSql = 'INSERT INTO tbl_employees ("fldEmpFirstName", "fldEmpLastName", "fldEmpNumber",';
    strSql += ' "fldEmpSalary", "fldEmpTitle", "fldEmpActive") VALUES ($1,$2,$3,$4,$5,$6);';
    arrFields = [fldEmpFirstName,fldEmpLastName,fldEmpNumber,fldEmpSalary,fldEmpTitle,fldEmpActive];
    var query = client.query(strSql,arrFields);

    // var query = client.query('INSERT INTO tbl_employees (fldEmpFirstName, fldEmpLastName, fldEmpNumber,fldEmpSalary, fldEmpTitle, fldEmpActive) VALUES ($1,$2,$3,$4,$5,$6);',[fldEmpFirstName,fldEmpLastName,fldEmpNumber,fldEmpSalary,fldEmpTitle,fldEmpActive]);


    console.log("strSql = ", strSql);
    console.log("arrFields = ", arrFields);


    query.on('end', function(){
      res.status(200).send("successful insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting employee into DB:", error);
      res.status(500).send(error);
      done();

    });


  })



});

router.get("/*", function(req,res){

  console.log("hey you got employees");

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    var results=[];
    var query = client.query('SELECT * FROM tbl_employees  ORDER  BY "fldEmpActive", "fldEmpLastName";');


    query.on('row', function(row){
    //   console.log("we got a row",row);
      results.push(row);


    });

    query.on('end', function(){
      res.send(results);

      done();
    });

    query.on('error', function(error){
      console.log("error returning employees:", error);
      res.status(500).send(error);
      done();

    });


  })

});

router.put("/*", function(req,res){

    var fldEmpID = req.body.empID;
    var newStatus = req.body.empStatus;



  console.log("totally UPDATE into employees",req.body);

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }
    // fldEmpFirstName, fldEmpLastName, fldEmpNumber, fldEmpSalary, fldEmpTitle, fldEmpActive

    strSql = 'UPDATE tbl_employees SET "fldEmpActive" = ' + newStatus + ' WHERE "fldEmpID" = ' + fldEmpID + ';';
    var query = client.query(strSql);

    // var query = client.query('INSERT INTO tbl_employees (fldEmpFirstName, fldEmpLastName, fldEmpNumber,fldEmpSalary, fldEmpTitle, fldEmpActive) VALUES ($1,$2,$3,$4,$5,$6);',[fldEmpFirstName,fldEmpLastName,fldEmpNumber,fldEmpSalary,fldEmpTitle,fldEmpActive]);


    console.log("strSql = ", strSql);


    query.on('end', function(){
      res.status(200).send("successful update");
      done();
    });

    query.on('error', function(error){
      console.log("error updating employee into DB:", error);
      res.status(500).send(error);
      done();

    });


  })



});

// var connectionString;
//
// if(process.env.DATABASE_URL) {//connecting to outside heroku database
//   pg.defaults.ssl = true;
//   connectionString = process.env.DATABASE_URL;
// } else{//connecting to local database before being connected to heroku for testing purposes
//   connectionString = 'postgress://localhost:5432/patroni_assigner';
// }

// pg.connect(connectionString, function(err, client, done){
//   if (err){
//     console.log("Error connecting to DB!", err);
//   } else {
//     var query = client.query('CREATE TABLE IF NOT EXISTS tbl_patroni (' +
//                               'patronus_id SERIAL PRIMARY KEY,' +
//                               'patronus_name varchar(20) NOT NULL );' +
//                               'CREATE TABLE IF NOT EXISTS tbl_people (' +
//                               'person_id SERIAL PRIMARY KEY,' +
//                               'first_name varchar(20) NOT NULL,' +
//                               'last_name varchar(20) NOT NULL,' +
//                               'patronus_id integer FOREIGN KEY REFERENCES tbl_patroni(patronus_id));');
//   }
//
//   query.on('end')
//
// });

module.exports = router;
