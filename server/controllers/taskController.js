import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postTask = async (req, res) => {
  const { title, dueDate } = req.body;
  const task = new Task({ title, dueDate });
  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.title = req.body.title;
    task.dueDate = req.body.dueDate;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const taskId = req.params.taskId;
  const { completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    res.status(500).json({ message: "Ошибка при обновлении задачи" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json("Task not found");
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
