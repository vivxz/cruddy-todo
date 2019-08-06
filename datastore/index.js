const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
      if (err) {
        throw ('')
      } else {
        callback(null, { id, text });
      }
    })
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      _.map(files, (id) => {
        id = id.slice(0, 5);
        data.push({ id: id, text: id })
      });
      callback(null, data)
    }
  })
};


exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + `/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
      // console.log('id ', id);
      // console.log('object', { id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
        if(err){
          callback (err);
        } else {
          callback(null, { id, text });
        }
      }
    )};
  }
)};

exports.delete = (id, callback) => {
  exports.readOne(id, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(exports.dataDir + `/${id}.txt`, (err) =>{
        if (err){
          callback (err);
        } else {
          callback();
        }
      })
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
