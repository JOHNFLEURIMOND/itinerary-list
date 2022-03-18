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
  const [comments, setComments] = useState([]);
  const [userInput, setUseInput] = useState("");
  const [commentIndex, setCommentIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  const [notes, setNotes] = useState([]);

  const handleFocus = (e) => {
    setEditable(true);
  };
  const handleBlur = (e) => {
    setEditable(false);
  };

  const addTodoHandler = useCallback((note) => {
    const oldComments = [...comments];
    props.notes[modalIndex] = note;
    props.setNotes([...notes]);

    if (userInput === "") {
      return alert("Comment Box Is Empty!");
    } else {
      const newComment = {
        id: Math.floor(Math.random() * 1000),
        text: userInput,
      };

      const newComments = oldTodos.concat(newComment);

      setTodos(newComments);
    }

    setUseInput("");
  }, [comments, userInput]);

  const deleteTodoHandler = useCallback(
    (id) => {
      const oldComments = [...comments];
      const newComments = oldComments.filter((comment) => comment.id !== id);

      setComments(newComments);
    },
    [comments]
  );

  const editTodoHandler = useCallback((index) => {
    setCommentIndex(index);
    setEditing(true);
  }, []);

  const saveEditTodoHandler = useCallback(
    (id) => {
      setEditing(false);
      setCommentIndex(null);

      const oldComments = [...comments];

      const newComments = oldComments.map((comment) => {
        if (comment.id === id) {
          if (editText !== "") {
            comment.text = editText;
          } else {
            return comment;
          }
        }
        return comment;
      });

      setComments(newComments);
    },
    [editText, comments]
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
      {comments.length === 0 && (
        <h2>
          Start Adding Notes Whenever You want...
        </h2>
      )}
      <div>
        {comments.map((comment, index) => (
          <div key={comment.id}>
            {editing && commentIndex === index ? (
              <div>
                <Input
                  type="text"
                  defaultValue={comment.text}
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
                    {comment.text}
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
