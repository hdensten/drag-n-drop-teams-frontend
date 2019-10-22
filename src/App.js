import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import axios from "axios";

import StudentDraggable from "./components/StudentDraggable";
import TeamList from "./components/TeamList";
import mockData from "./mockData";

const App = () => {
  const [student, setStudent] = React.useState("");
  const [students, setStudents] = React.useState(mockData);

  const renderStudents = () => {
    const noTeam = students.filter(student => student.team === 0);
    return noTeam.map((student, index) => {
      return (
        <StudentDraggable key={student.id} student={student} index={index} />
      );
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (student === "") {
      return console.log("UNSUCCESSFUL SUBMIT:\nNO NAME\n");
    }
    axios
      .post("http://127.0.0.1:5000/student", {
        name: student,
        team: 0
      })
      .then(response => {
        console.log("successful post", response);
      })
      .catch(error => {
        console.log("student post error", error);
      });
  };

  // const handleSubmit = e => {
  //   e.preventDefault()
  //   setStudents([
  //     ...students,
  //     { id: students.length + 1, name: student, team: 0 }
  //   ])
  // }

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const droppedStudent = students.find(
      student => student.id === result.draggableId
    );
    droppedStudent.team = +result.destination.droppableId;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page-wrapper">
        <div className="title-bar">
          <h1>Team Organizer</h1>
        </div>
        <div className="app">
          <Droppable droppableId={"0"}>
            {provided => (
              <div
                className="left-student-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {provided.placeholder}
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Enter Student Name"
                    value={student}
                    onChange={e => setStudent(e.target.value)}
                  />

                  <div className="buttons">
                    <button className="add-student-button">Add Student</button>

                    {/* NEED TO CHANGE WHAT THE BUTTON DOES. RIGHT NOW IT MIMICS THE ADD BUTTON */}
                    <button className="random-assignment-button">
                      Randomize
                    </button>
                  </div>
                </form>
                <div className="unsorted-students">
                  <div className="unsorted-header-text">Unsorted Students</div>
                  {renderStudents()}
                </div>
                {/* <div className="separator-skew" /> */}
              </div>
            )}
          </Droppable>

          <div className="teams-wrapper">
            <TeamList students={students} number={"1"} />
            <TeamList students={students} number={"2"} />
            <TeamList students={students} number={"3"} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
