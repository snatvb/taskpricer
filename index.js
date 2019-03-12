#!/usr/bin/env node
/**
 * Created by snatvb on 05.02.2018.
 */
const fs = require('fs');
const path = require('path');
const Task = require('./Task');
const config = require('./config');
const utils = require('./utils');
const csv = require('csv');

console.log('Tasks: ' + process.argv[2] + '.csv');
console.log('Total price: ' + config.totalPrice + '\n');

function checkToEmpty(...args) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[ i ];
    if (typeof arg === 'undefined' || arg === '' || arg === null) {
      return true;
    }
  }
  return false;
}

var parser = csv.parse({ delimiter: ';' }, (err, data) => {
  if (err) {
    throw err;
  }
  if (!data || data.length < 2) {
    console.log(`Invalid data`);
    return;
  }

  let tasks = [];
  for (let i = 1; i < data.length; i++) {
    const line = data[ i ];
    if (checkToEmpty(line[ 0 ], line[ 1 ], line[ 2 ])) {
      continue;
    }
    let task = new Task(line[ 0 ], line[ 1 ], line[ 2 ]);
    tasks.push(task);
  }
  save(calculate(tasks));
});

fs.createReadStream(path.join(config.baseDir, process.argv[2] + '.csv')).pipe(parser);

/**
 * @param {Task[]} taskList
 */
function calculate(taskList) {
  if(taskList.length < 1) {
    return;
  }
  const totalPrice = config.totalPrice;

  return distributionMoney(taskList, totalPrice);
}

/**
 * @param {Task[]} tasks
 */
function save(tasks) {
  const input = tasks.map(task => task.toCSVRow());
  csv.stringify(input, function(err, output){
    fs.writeFileSync(path.join(config.baseDir, '/result.csv'), output);
  });
  console.log('Well done!');
}

function distributionMoney(tasks, totalPrice) {
  let prices = [];
  let total = 0;
  let residue = 0;
  const ratioCount = tasks.reduce((ratios, task) => task.ratio + ratios, 0)
  const pricePerRatio = totalPrice / ratioCount
  tasks.forEach((task) => {
    task = task.clone();
    const price = pricePerRatio * task.ratio;
    const priceRand = Math.round(utils.randomInteger(price * 0.9, price + residue));
    residue = priceRand - price;
    task.price = priceRand;
    prices.push(task);
    total += price;
  });
  if (total !== totalPrice) {
    console.warn('End total price in not compare with you:', total)
  }
  return prices;
}
