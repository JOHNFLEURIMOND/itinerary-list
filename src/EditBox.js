import { useState, useRef, useCallback, useEffect } from "react";
import { TextArea, Button } from "semantic-ui-react";
import { MdEdit, MdDelete } from "react-icons/md";

export const EditBox = (props) => {
  const maxChar = 200;
  const rows = 3;
  const [remainedChar, setRemainedChar] = useState(200);
  const [isEditable, setEditable] = useState(false);
  const [todos, setTodos] = useState([]);
  const [userInput, setUseInput] = useState("");
  const [todoIndex, setTodoIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);

  const handleChange = (e) => {
    setRemainedChar(maxChar - e.target.value.length);
  };
  const handleFocus = (e) => {
    setEditable(true);
  };
  const handleBlur = (e) => {
    setEditable(false);
  };

  const addTodoHandler = useCallback(() => {
    const oldTodos = [...todos];

    if (userInput === "") {
      return;
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
          handleChange();
        }}
        onBlur={handleBlur}
        onFocus={() => {
          handleFocus();
        }}
        className={`editbox-textarea ${
          isEditable ? "text-edit active-box" : ""
        } `}
      />
      <div
        className={`edit-bottom  d-flex justify-content-end text-detail ${
          isEditable ? "" : "invisible"
        }`}
      >
        <i className="remained-char">
          {remainedChar}/{maxChar}
        </i>
      </div>

      <div style={{ display: "block" }}>
        <Button onClick={addTodoHandler} style={{ display: "block" }}>
          Add
        </Button>
        {todos.length === 0 && (
          <h2 style={{ color: "#fff", fontWeight: "bold" }}>
            Start Adding Todos...
          </h2>
        )}
      </div>
      <div className="todos-container-parent">
        {todos.map((todo, index) => (
          <div key={todo.id} className="todos-container-child">
            {editing && todoIndex === index ? (
              <div>
                <input
                  type="text"
                  defaultValue={todo.text}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEditTodoHandler(todo.id)}>
                  Save
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="todo-text">{todo.text}</h4>
                </div>
                <div>
                  <MdDelete
                    className="icon"
                    onClick={() => deleteTodoHandler(todo.id)}
                  />
                  <MdEdit
                    className="icon"
                    onClick={() => editTodoHandler(index)}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
