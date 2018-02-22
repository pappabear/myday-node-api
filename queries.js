var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'myday-node-db',
  user: 'postgres',
  password: 'postgres'
};
const db = pgp(cn);

// add query functions

function getAllTasks(req, res, next) {
    db.any('select * from tasks')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL tasks'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

function getTasksDueToday(req, res, next) {
	//var dt = req.query.dt;	
  	db.any("select * from tasks where due_date=CURRENT_DATE")
    	.then(function (data) {
      	  res.status(200)
        	.json({
	          status: 'success',
	          data: data,
	          message: 'Retrieved tasks for date 2018-02-02'
	        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTasksDueTomorrow(req, res, next) {
	//var dt = req.query.dt;	
  	db.any("select * from tasks where due_date=CURRENT_DATE + INTERVAL '1 day'")
    	.then(function (data) {
      	  res.status(200)
        	.json({
	          status: 'success',
	          data: data,
	          message: 'Retrieved tasks for date 2018-02-03'
	        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleTask(req, res, next) {
var taskID = parseInt(req.params.id);
db.one('select * from tasks where id = $1', taskID)
    .then(function (data) {
    res.status(200)
        .json({
        status: 'success',
        data: data,
        message: 'Retrieved ONE task'
        });
    })
    .catch(function (err) {
    return next(err);
    });
}

function createTask(req, res, next) {
    req.body.age = parseInt(req.body.age);
    db.none('insert into tasks(subject, is_complete, due_date)' +
        'values(${subject}, ${is_complete}, ${due_date})',
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one task'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function updateTask(req, res, next) {
    db.none('update tasks set subject=$1, is_complete=$2, due_date=$3 where id=$4',
      [req.body.subject, req.body.is_complete, req.body.due_date, parseInt(req.params.id)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated task'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
  
  function removeTask(req, res, next) {
    var taskID = parseInt(req.params.id);
    db.result('delete from tasks where id = $1', taskID)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} task(s)`
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  }

  
module.exports = {
  getAllTasks: getAllTasks,
  getTasksDueToday: getTasksDueToday,
  getTasksDueTomorrow: getTasksDueTomorrow,
  getSingleTask: getSingleTask,
  createTask: createTask,
  updateTask: updateTask,
  removeTask: removeTask
};
