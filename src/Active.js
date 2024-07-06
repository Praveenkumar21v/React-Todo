import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./Active.css";

const Active = () => {
  const [todo, setTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [updatedTodoText, setUpdatedTodoText] = useState("");
  const [todoList, setTodoList] = useState([]);

  const fetchTodoList = () => {
    axios
      .get("http://localhost:3003/todos")
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTodoList();
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();

    if (!todo && !editingTodo) {
      alert("Please add a todo");
      return;
    }

    if (editingTodo) {
      axios
        .put(`http://localhost:3003/todos/${editingTodo.id}`, {
          todo: updatedTodoText,
          isCompleted: editingTodo.isCompleted,
        })
        .then(() => {
          setEditingTodo(null);
          fetchTodoList();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post("http://localhost:3003/todos", {
          todo: todo,
          isCompleted: false,
        })
        .then(() => {
          fetchTodoList();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setTodo("");
    setUpdatedTodoText("");
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3003/todos/${id}`)
      .then(() => {
        fetchTodoList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id, currentTodo) => {
    setTodo(currentTodo.todo);
    setUpdatedTodoText(currentTodo.todo);
    setEditingTodo({ id, isCompleted: currentTodo.isCompleted });
  };

  const handleCheck = (id, isChecked) => {
    axios
      .put(`http://localhost:3003/todos/${id}`, {
        ...todoList.find((todo) => todo.id === id),
        isCompleted: isChecked,
      })
      .then(() => {
        fetchTodoList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container mt-5" id="todoContainer">
        <h1 className="text-center mb-4">ToDoList</h1>
        <Form onSubmit={handleAddTodo} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter a Todo"
            value={editingTodo ? updatedTodoText : todo}
            onChange={(e) =>
              editingTodo
                ? setUpdatedTodoText(e.target.value)
                : setTodo(e.target.value)
            }
          />
          <Button type="submit" variant="outline-info" className="mt-2">
            {editingTodo ? "Update Todo" : "Add Todo"}
          </Button>
        </Form>

        <div className="d-flex flex-wrap">
          {todoList.map(({ id, todo, isCompleted }) => (
            <Card
              key={id}
              className={`m-2 ${
                isCompleted ? "completed-card" : "initial-card"
              }`}
            >
              <Card.Body>
                <Card.Title className={isCompleted ? "completed-task" : ""}>
                  {todo}
                </Card.Title>
                <>
                  <Form.Check
                    className="check"
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleCheck(id, !isCompleted)}
                    label={isCompleted ? "Completed" : "Incomplete"}
                  />
                </>
                <div className="d-flex justify-content-between card-actions">
                {!isCompleted && (
                  <FaUserEdit
                    size={20}
                    className="text-primary cursor-pointer icon"
                    onClick={() => handleEdit(id, { id, todo, isCompleted })}
                  />
                )}
                  <MdDelete
                    size={20}
                    className="text-danger cursor-pointer icon"
                    onClick={() => handleDelete(id)}
                  />
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Active;
