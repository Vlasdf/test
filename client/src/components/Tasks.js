import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Checkbox, DatePicker } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const addTask = async () => {
    try {
      await axios.post("http://localhost:5000/task", { title, dueDate });
      setTitle("");
      setDueDate("");
      fetchTasks();
    } catch (error) {
      console.error("Ошибка при добавлении новой задачи:", error);
      setError("Не удалось добавить задачу");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      setError("Не удалось удалить задачу");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
      console.log("Fetched tasks:", response.data);
    } catch (error) {
      console.error("Ошибка при получении списка задач:", error);
      setError("Не удалось получить список задач");
    }
  };

  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
  };

  const saveEditTask = async () => {
    try {
      await axios.put(`http://localhost:5000/task_update/${editingTaskId}`, {
        title,
        dueDate,
      });
      console.log("Task updated:", editingTaskId, title);
      await fetchTasks();
      setEditingTaskId(null);
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Ошибка при редактировании задачи:", error);
      setError("Не удалось отредактировать задачу");
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axios.put(`http://localhost:5000/task/${taskId}`, {
        completed,
      });

      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, completed };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Ошибка при изменении состояния задачи:", error);
      setError("Не удалось изменить состояние задачи");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setTitle("");
    setDueDate("");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="center-container">
      <div className="task-container">
        <h1 className="title">ToDo List</h1>
        <Input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача"
        />
        <DatePicker
          className="date"
          value={dueDate ? moment(dueDate, "YYYY-MM-DD") : null}
          onChange={(date, dateString) => setDueDate(dateString)}
          placeholder="Дата завершения"
        />
        <Button
          onClick={editingTaskId ? saveEditTask : addTask}
          className="add-button"
        >
          {editingTaskId ? "Сохранить" : "Добавить"}
        </Button>
        {editingTaskId && (
          <Button className="add-button" onClick={cancelEdit}>
            Отмена
          </Button>
        )}
        {error && <p>{error}</p>}
        <ul>
          <hr></hr>
          {tasks.map((task) => (
            <li key={task._id} className="li">
              <Checkbox
                className="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task._id, !task.completed)}
              />
              <div>
                <span className="task-title">{task.title}</span>
                <span className="task-due">
                  {task.dueDate
                    ? ` Должна быть выполнена до: ${new Date(
                        task.dueDate
                      ).toLocaleDateString()}`
                    : ""}
                </span>
                <span className="task-status">
                  {task.completed ? " завершено" : " не завершено"}
                </span>
              </div>
              <Button
                className="edit-button"
                onClick={() => startEditTask(task)}
                icon={<EditOutlined />}
              >
                Редактировать
              </Button>
              <Button
                className="del-button"
                onClick={() => deleteTask(task._id)}
                icon={<DeleteOutlined />}
              >
                Удалить
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
