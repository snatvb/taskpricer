# taskpricer
give task csv [title, task, ratio] ratio(1-9, 0 will 0 price) and you get [title, task, price]
**This will RANDOM price! And need for such task!**

Install: `npm i -g taskpricer`

## how use

`taskpricer <filename> <totalprice>`
After, you will get "result.csv". "filename" should be without extention.

example:

`taskpricer mytasks 90000`

Was file "mytasks.csv":

| title                | Task          | Ratio |
| -------------------- | ------------- | ----- |
| I did something      | TASK_NUMBER_1 | 3     |
| I did more something | TASK_NUMBER_2 | 9     |
| I did something more | TASK_NUMBER_3 | 6     |

Will be file "result.csv":

| title                | Task          | Price |
| -------------------- | ------------- | ----- |
| I did something      | TASK_NUMBER_1 | 12000 |
| I did more something | TASK_NUMBER_2 | 45000 |
| I did something more | TASK_NUMBER_3 | 33000 |
