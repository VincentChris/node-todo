const db = require("./db");
const inquirer = require("inquirer");

module.exports = {
  add(task) {
    db.readFile().then(
      (data) => {
        data.push({ title: task, done: false });
        db.writeFile(data).then(
          (res) => {
            console.log("添加成功");
          },
          (err) => {
            console.log("添加任务失败");
          }
        );
      },
      (err) => {
        console.log("添加任务失败");
      }
    );
  },
  async clear() {
    await db.writeFile([]);
  },
  async showAll() {
    const list = await db.readFile();
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "index",
        message: "请选择你想操作的任务",
        choices: [{ name: "退出", value: "-1" }]
          .concat(
            list.map((task, index) => ({
              name: `${task.done ? "[x]" : "[_]"} ${index + 1} - ${task.title}`,
              value: index.toString(),
            }))
          )
          .concat([
            { name: "+ 创建任务", value: "-2" },
            { name: "X 清空所有任务", value: "-3" },
          ]),
      },
    ]);
    const index = parseInt(answer.index);
    if (index >= 0) {
      inquirer
        .prompt([
          {
            type: "list",
            name: "action",
            message: "请选择操作",
            choices: [
              { name: "退出", value: "quit" },
              { name: "已完成", value: "markAsDone" },
              { name: "未完成", value: "markAsUndone" },
              { name: "改标题", value: "updateTitle" },
              { name: "删除", value: "remove" },
            ],
          },
        ])
        .then((res) => {
          switch (res.action) {
            case "markAsDone": {
              list[index].done = true;
              db.writeFile(list);
              break;
            }
            case "markAsUndone": {
              list[index].done = false;
              db.writeFile(list);
              break;
            }
            case "updateTitle": {
              inquirer
                .prompt({
                  type: "input",
                  name: "title",
                  message: "新的标题",
                  default: list[index].title,
                })
                .then((ans) => {
                  list[index].title = ans.title;
                  db.writeFile(list);
                });
              break;
            }
            case "remove": {
              list.splice(index, 1);
              db.writeFile(list);
              break;
            }
            default: {
              break;
            }
          }
        });
    } else if (index === -2) {
      inquirer
        .prompt({
          type: "input",
          name: "title",
          message: "输入任务标题",
        })
        .then((answer) => {
          list.push({ title: answer.title, done: false });
          db.writeFile(list);
        });
    } else if (index === -3) {
      await this.clear();
    }
  },
};
