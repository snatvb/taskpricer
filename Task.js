/**
 * Created by snatvb on 05.02.2018.
 */


class Task {
  constructor(title, task, ratio) {
    this.title = title;
    this.task = task;
    this.ratio = parseInt(ratio, 10);
    this.price = 0;
  }

  /**
   * @param {Task[]} tasks
   */
  static soring(tasks) {
    return tasks.sort((a,b) => a.ratio - b.ratio);
  }

  clone() {
    const task = new Task(this.title, this.task, this.ratio);
    task.price = this.price;
    return task;
  }

  toCSVRow() {
    return [this.title, this.task, this.price];
  }

  static getCoumnts() {
    return 3;
  }
}

module.exports = Task;