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
  const priceToTask = config.totalPrice / taskList.length;
  const middleRatioTasks = utils.middleNumber(taskList, task => task.ratio);
  const maxPrice = priceToTask / middleRatioTasks;
  const minimalPrice = maxPrice * .9;
  const totalPrice = config.totalPrice;
//  console.log({ maxPrice, minimalPrice, m: utils.middleNumber(tasks, task => task.ratio) });

  let {tasks, total, residue} = distributionMoney(taskList, {minimalPrice, maxPrice, priceToTask});

  if(residue !== 0) {
    const toUp = tasks.filter((task) => task.ratio >= middleRatioTasks);
    const toTask = Math.floor(residue / toUp.length);
    toUp.forEach(task => task.price += toTask);
  }

  total = 0;
  tasks.forEach(task => total += task.price);
  if(total != totalPrice) {
    tasks[utils.randomInteger(0, tasks.length-1)].price += totalPrice - total;
  }
  total = 0;
  tasks.forEach(task => total += task.price);
  return tasks;
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

function distributionMoney(tasks, {minimalPrice, maxPrice, priceToTask}) {
  let prices = [];
  let total = 0;
  let residue = 0;
  tasks.forEach((task) => {
    task = task.clone();
    const factor = config.factors[ task.ratio ];
    let bias = residue * .9;
    if(bias > minimalPrice * factor) {
      bias = 0;
    }
    let price = utils.randomInteger(minimalPrice * factor, maxPrice * factor) + bias;
    price = Math.round(price);
    residue += priceToTask - price;
    //    console.log(price, residue);
    task.price = price;
    prices.push(task);
    total += price;
  });
  return {tasks: prices, total, residue};
}
