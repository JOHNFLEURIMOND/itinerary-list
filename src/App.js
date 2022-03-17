import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Button, List, Segment, Header } from "semantic-ui-react";
import "./index.css";
import { CommentBox } from "./CommentBox";

const App = () => {
  const [modalIndex, setModalIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.worldbank.org/v2/countries?format=json")
      .then((res) => {
        setData(res.data[1]);
      });
  }, []);

  const handleClick = () => {
    const n = 10;
    const apiData = data
      .map((x) => ({ x, r: Math.random() }))
      .filter((x) => x.x.capitalCity !== "")
      .sort((a, b) => a.r - b.r)
      .map((a) => a.x)
      .slice(0, n);

    setCountries(apiData);
  };

  const handleRemove = (index) => {
    countries.splice(index, 1);
    setCountries([...countries]);
  };

  const moveCountryListItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = countries[dragIndex];
      const hoverItem = countries[hoverIndex];
      // Swap places of dragItem and hoverItem
      setCountries((countries) => {
        const updatedCountries = [...countries];
        updatedCountries[dragIndex] = hoverItem;
        updatedCountries[hoverIndex] = dragItem;
        return updatedCountries;
      });
    },
    [countries]
  );
  const CountryModal = (props) => {
    let previous = modalIndex - 1;
    if (previous === -1) {
      previous = countries.length - 1;
    }
    let next = modalIndex + 1;
    if (next === countries.length) {
      next = 0;
    }

    return (
      <>
        {showModal ? (
          <div className="modal-container">
            <div className="modal" id="modal">
              <h2>Detail Editor</h2>
              <div className="content">
                <b>Country:</b> {countries[modalIndex].name}
              </div>
              <div className="content">
                <b>Capital City:</b> {countries[modalIndex].capitalCity}
              </div>
              <div className="content">
                <CommentBox />
              </div>
              <div className="actions">
                <Button.Group
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    display: "flex",
                    margin: "1rem auto",
                  }}
                >
                  <Button
                    className="toggle-button"
                    negative
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    color="yellow"
                    onClick={() => setModalIndex(previous)}
                  >
                    Previous
                  </Button>
                  <Button color="green" onClick={() => setModalIndex(next)}>
                    Next
                  </Button>
                </Button.Group>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  };

  const li = countries.map((country, i) => (
    <div key={i}>
      <List.Content>
        <ListItem
          text={country.name}
          index={i}
          setModalIndex={setModalIndex}
          handleRemove={handleRemove}
          moveListItem={moveCountryListItem}
          setShowModal={setShowModal}
        />
        {country.id}
      </List.Content>
    </div>
  ));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Header as="h1" style={{ textAlign: "center" }}>
          Itinerary List
        </Header>
        <Segment
          inverted
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "5px solid #e1e1e1",
          }}
        >
          <List.Header>Countries:</List.Header>
          <List divided inverted relaxed>
            <List.Item>{li}</List.Item>
          </List>
        </Segment>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        ></ul>

        <Button
          onClick={handleClick}
          primary
          style={{
            textAlign: "center",
            margin: "2rem auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Generate New
        </Button>
        <CountryModal />
      </div>
    </DndProvider>
  );
};

const ListItem = ({
  text,
  index,
  moveListItem,
  setModalIndex,
  setShowModal,
  handleRemove,
}) => {
  // useDrag - the list item is draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: "item",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // useDrop - the list item is also a drop area
  const [spec,dropRef] = useDrop({
    accept: "item",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top;

      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveListItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Join the 2 refs together into one (both draggable and can be dropped on)
  const ref = useRef(null);
  const dragDropRef = dragRef(dropRef(ref));

  // Make items being dragged transparent, so it's easier to see where we drop them
  const opacity = isDragging ? 0 : 1;
  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0.05)",
        opacity,
      }}
      ref={dragDropRef}
    >
      <Button
        color="red"
        style={{ display: "inline-block ", padding: "2px" }}
        onClick={() => handleRemove(index)}
      >
        {" "}
        <FontAwesomeIcon icon={faXmark} color="white" />
      </Button>
      <Button
        color="black"
        style={{ display: "inline-block ", padding: "2px" }}
        onClick={() => {
          setModalIndex(index);
          setShowModal(true);
        }}
      >
        {" "}
        <FontAwesomeIcon icon={faCircleInfo} color="white" />
      </Button>

      {text}
    </div>
  );
};

export default App;
