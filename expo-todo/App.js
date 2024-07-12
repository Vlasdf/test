import React, { useState, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from "expo-checkbox";
import $api from "./http";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const addTask = async () => {
    try {
      const response = await $api.post("/task", { title, dueDate });
      setTitle("");
      setDueDate("");
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error("Ошибка при добавлении новой задачи:", error);
      setError("Не удалось добавить задачу");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await $api.get(`/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка при получении списка задач", error);
      setError("Не удалось получить список задач");
    }
  };

  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDueDate(task.dueDate ? task.dueDate : "");
  };

  const saveEditTask = async () => {
    try {
      await $api.put(`/task_update/${editingTaskId}`, {
        title,
        dueDate,
      });
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task._id === editingTaskId) {
            return {
              ...task,
              title: title,
              dueDate: dueDate,
            };
          }
          return task;
        });
      });
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
      await $api.put(`/task/${taskId}`, {
        completed,
      });

      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, completed } : task
      );
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

  const deleteTask = async (taskId) => {
    try {
      await $api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      setError("Не удалось удалить задачу");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDueDate(date.toISOString());
    hideDatePicker();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskRow}>
        <CheckBox
          value={item.completed}
          onValueChange={() => toggleTaskCompletion(item._id, !item.completed)}
        />
        <Text style={styles.taskTitle}>{item.title}</Text>
      </View>
      {item.dueDate && (
        <Text style={styles.dueDate}>
          Должна быть выполнена до:{" "}
          {new Date(item.dueDate).toLocaleString()}
        </Text>
      )}
      <Text style={styles.completed}>
        {item.completed ? "завершено" : "не завершено"}
      </Text>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => startEditTask(item)}
        >
          <Text style={styles.buttonText}>Редактировать</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={() => deleteTask(item._id)}
        >
          <Text style={styles.buttonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Название задачи"
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      <Button title="Выбрать дату" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime" 
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {editingTaskId ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 16,
          }}
        >
          <Button title="Сохранить" onPress={saveEditTask} />
          <Button title="Отменить" onPress={cancelEdit} />
        </View>
      ) : (
        <Button title="Добавить" onPress={addTask} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: {
    marginLeft: 8,
    fontSize: 16,
  },
  dueDate: {
    marginLeft: 28,
    fontSize: 16,
  },
  completed: {
    marginLeft: 28,
    fontSize: 16,
  },
  taskItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  button: {
    marginLeft: 26,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "blue",
    marginHorizontal: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
