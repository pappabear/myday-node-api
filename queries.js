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

function getTasksForWeek(req, res, next) {
	//var dt = req.query.dt;	
	db.any("select * from tasks where due_date between CURRENT_DATE and CURRENT_DATE + INTERVAL '5 days' order by due_date, is_complete, id")
  	.then(function (data) {
    	  res.status(200)
      	.json({
          status: 'success',
          data: data,
          message: 'Retrieved tasks for week'
        });
    })
    .catch(function (err) {
        return next(err);
      });
  }

function getTasksDueToday(req, res, next) {
	//var dt = req.query.dt;	
  	db.any("select * from tasks where due_date=CURRENT_DATE or (due_date < CURRENT_DATE and is_complete = false) order by is_complete, id")
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
  	db.any("select * from tasks where due_date=CURRENT_DATE + INTERVAL '1 day' order by is_complete, id")
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
        message: 'Retrieved ONE task with id=' + taskID
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

function toggleStatus(req, res, next) {
	var taskID = parseInt(req.params.id);
	var oldStatus = false;
	var newStatus = false;
	db.one('select * from tasks where id = $1', taskID)
	    .then(function (data) {
	    res.status(200)
	        oldStatus = data.is_complete;
			//console.log("data.is_complete=" + data.is_complete);
			if (oldStatus === true)
				newStatus = false;
			else
				newStatus = true;

			//console.log("newStatus=" + newStatus);
			db.none('update tasks set is_complete=$1 where id=$2', [newStatus, parseInt(req.params.id)])
		        .then(function () {
		          res.status(200)
		            .json({
		              status: 'success',
		              message: 'Toggled task status'
		            });
		        })
		        .catch(function (err) {
		          return next(err);
		        });
	    })
	    .catch(function (err) {
	    return next(err);
	    });
    }

function updateTask(req, res, next) {
    db.none('update tasks set subject=$1, due_date=$2 where id=$3',
      [req.body.subject, req.body.due_date, parseInt(req.params.id)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated task with id=' + req.params.id
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
  getTasksForWeek: getTasksForWeek,
  getSingleTask: getSingleTask,
  createTask: createTask,
  updateTask: updateTask,
  toggleStatus: toggleStatus,
  removeTask: removeTask
};
