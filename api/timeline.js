// RETURNS OBJECT WITH TASKS PREPARED TO DISPLAY ON TIMELINE
export const timelineArrange = (tasks) => {
  // arranged by date
  const overDueTasksByDate = {};
  const futureTasksByDate = {};

  // arrays for three main groups
  const overdueTasks = [];
  const todayTasks = [];
  const futureTasks = [];

  // divide tasks into three main groups
  tasks.forEach(task => {
    const today = new Date();
    const dueDate = new Date(task.due.date);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
        overdueTasks.push(task);
    } else if (dueDate.getTime() === today.getTime()) {
        todayTasks.push(task);
    } else {
        futureTasks.push(task);
    }
  });

  // fill days without tasks with empty arrays
  overdueTasks.forEach(task => {
    const dueDate = task.due.date;

    if (!overDueTasksByDate[dueDate]) { overDueTasksByDate[dueDate] = []; }

    overDueTasksByDate[dueDate].push(task);
  });

  futureTasks.forEach(task => {
    const dueDate = task.due.date;

    if (!futureTasksByDate[dueDate]) { futureTasksByDate[dueDate] = []; }

    futureTasksByDate[dueDate].push(task);
  });

  // grouped tasklist
  let tasksLists = [Object.values(overDueTasksByDate), todayTasks, Object.values(futureTasksByDate)];

  let idx = -1;

  tasksLists[0] = tasksLists[0].map(overdue => {
    let tasks = transfromTasks(overdue, idx, true);
    idx = tasks[tasks.length - 1].index;
    return tasks;
  });

  tasksLists[1] = tasksLists[1].flatMap((task, index) => {
    idx++;
    if (task.labels.includes("EVENT")) {
      return [ {
        id: task.id,
        index: idx,
        date: task.due.date,
        time: task.due.string,
        title: task.content,
        description: task.description,
        tags: task.labels.filter(tag => tag != "EVENT"),
        priority: task.priority,
        event: true,
        today: true
      } ];
    }
    return [ {
      id: task.id,
      index: idx,
      date: task.due.date,
      time: task.due.string,
      title: task.content,
      description: task.description,
      tags: task.labels,
      priority: task.priority,
      today: true
    } ];
  });

  tasksLists[2] = tasksLists[2].map(tasks => { return transfromTasks(tasks, idx, false); });

  return tasksLists;
}

const transfromTasks = (tasks, idx, overdue) => {
  return tasks.flatMap((task, index) => {
    idx++;
    if (index == 0) {
      let date = new Date(task.due.date);
      if (task.labels.includes("EVENT")) {
        return [ {
          dateChange: true,
          date: date.toLocaleDateString('en-US', {weekday: 'short', day: 'numeric', month: 'short'}),
          overdue: overdue,
          normalDate: date
        }, {
          id: task.id,
          index: idx,
          date: task.due.date,
          time: task.due.string,
          title: task.content,
          description: task.description,
          tags: task.labels.filter(tag => tag != "EVENT"),
          priority: task.priority,
          overdue: overdue,
          event: true
        } ];
      }
      return [ {
        dateChange: true,
        date: date.toLocaleDateString('en-US', {weekday: 'short', day: 'numeric', month: 'short'}),
        overdue: overdue,
        normalDate: date
      }, {
        id: task.id,
        index: idx,
        date: task.due.date,
        time: task.due.string,
        title: task.content,
        description: task.description,
        tags: task.labels.filter(tag => tag != "EVENT"),
        priority: task.priority,
        overdue: overdue,
      } ];
    }
    if (task.labels.includes("EVENT")) {
        return [ {
          id: task.id,
          index: idx,
          date: task.due.date,
          time: task.due.string,
          title: task.content,
          description: task.description,
          tags: task.labels.filter(tag => tag != "EVENT"),
          priority: task.priority,
          overdue: overdue,
          event: true
        } ];
      }
      return [ {
        id: task.id,
        index: idx,
        date: task.due.date,
        time: task.due.string,
        title: task.content,
        description: task.description,
        tags: task.labels,
        priority: task.priority,
        overdue: overdue
      } ];
  });
}
