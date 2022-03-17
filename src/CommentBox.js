import { useState, useRef, useCallback, useEffect } from "react";
import { TextArea, Button, Input } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";

export const CommentBox = (props) => {
  const maxChar = 200;
  const rows = 4;
  const [isEditable, setEditable] = useState(false);
  const [todos, setTodos] = useState([]);
  const [userInput, setUseInput] = useState("");
  const [todoIndex, setTodoIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);

  const handleFocus = (e) => {
    setEditable(true);
  };
  const handleBlur = (e) => {
    setEditable(false);
  };

  const addTodoHandler = useCallback(() => {
    const oldTodos = [...todos];

    if (userInput === "") {
      return alert("Comment Box Is Empty!");
    } else {
      const newTodo = {
        id: Math.floor(Math.random() * 1000),
        text: userInput,
      };

      const newTodos = oldTodos.concat(newTodo);

      setTodos(newTodos);
    }

    setUseInput("");
  }, [todos, userInput]);

  const deleteTodoHandler = useCallback(
    (id) => {
      const oldTodos = [...todos];
      const newTodos = oldTodos.filter((todo) => todo.id !== id);

      setTodos(newTodos);
    },
    [todos]
  );

  const editTodoHandler = useCallback((index) => {
    setTodoIndex(index);
    setEditing(true);
  }, []);

  const saveEditTodoHandler = useCallback(
    (id) => {
      setEditing(false);
      setTodoIndex(null);

      const oldTodos = [...todos];

      const newTodos = oldTodos.map((todo) => {
        if (todo.id === id) {
          if (editText !== "") {
            todo.text = editText;
          } else {
            return todo;
          }
        }
        return todo;
      });

      setTodos(newTodos);
    },
    [editText, todos]
  );

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <div className="editbox">
      <div className="custom-label">
        <div className="editbox-label">{props.label}</div>
      </div>
      <TextArea
        type="text"
        ref={ref}
        rows={rows}
        maxLength={maxChar}
        value={userInput}
        onChange={(e) => {
          setUseInput(e.target.value);
        }}
        onBlur={handleBlur}
        onFocus={() => {
          handleFocus();
        }}
        className="editbox-textarea"
      />

      <div style={{ display: "block" }}>
        <Button
          inverted
          color="green"
          onClick={addTodoHandler}
          style={{ display: "block" }}
        >
          Add
        </Button>
      </div>
      {todos.length === 0 && (
        <h2>
          Start Adding Notes Whenever You want...
        </h2>
      )}
      <div>
        {todos.map((todo, index) => (
          <div key={todo.id}>
            {editing && todoIndex === index ? (
              <div>
                <Input
                  type="text"
                  defaultValue={todo.text}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ padding: "2rem  2rem 2rem 0" }}
                />
                <Button
                  color="grey"
                  onClick={() => saveEditTodoHandler(todo.id)}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} color="white" />
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h4
                    className="todo-text"
                    style={{ padding: "2rem 2rem 2rem 0" }}
                  >
                    {todo.text}
                  </h4>
                </div>
                <div>
                  <Button.Group>
                    <Button
                      color="red"
                      onClick={() => deleteTodoHandler(todo.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} color="white" />
                    </Button>
                    <Button.Or />
                    <Button
                      color="black"
                      onClick={() => editTodoHandler(index)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} color="white" />
                    </Button>
                  </Button.Group>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
