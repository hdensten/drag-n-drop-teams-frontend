import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TitleBar from "./components/TitleBar";
import StudentDraggable from "./components/StudentDraggable";
import TeamList from "./components/TeamList";

import mockData from "./mockData";
import Icons from "./helpers/icons";
import { existsTypeAnnotation } from "@babel/types";

const App = () => {
  Icons();

  const [student, setStudent] = React.useState("");
  const [students, setStudents] = React.useState([]);
  const [reRender, setReRender] = React.useState(false);
  const [teamsEntry, setTeamsEntry] = React.useState(""); // CHANGES HERE!!!!!!!
  const [teamsArray, setTeamsArray] = React.useState([1, 2, 3]); // CHANGES HERE!!!!!!!

  const renderStudents = () => {
    const noTeam = students.filter(student => student.team === 0);
    return noTeam.map((student, index) => {
      return (
        <StudentDraggable
          key={student.id}
          student={student}
          index={index}
          deleteStudent={deleteStudent}
          // id={student.id}
        />
      );
    });
  };

  //   fetch("https://mar-todo-api.herokuapp.com/todos")
  //     .then(response => response.json())
  //     .then(data => setStudents({ students: data }));
  // }

  // useEffect(() => {
  //   fetch("https://127.0.0.1:5000/students")
  //     .then(res => res.json())
  //     .then(data => {
  //       setStudents(data);
  //     });
  // });

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
        setStudents([...students, response.data]);
        setStudent("");
      })
      .catch(error => {
        console.log("student post error", error);
      });
  };

  const getStudents = () => {
    axios
      .get("http://127.0.0.1:5000/students")
      .then(response => {
        console.log("setStudent response", response.data);
        setStudents(response.data);
      })
      .catch(error => {
        console.log("setStudent error", error);
      });
  };

  useEffect(() => {
    getStudents();
  }, [reRender]);

  // FUNCTION TO PREVENT AUTO-SORTING LISTS WHEN STUDENT IS DROPPED IN A TEAM
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const deleteStudent = id => {
    axios
      .delete(`http://127.0.0.1:5000/student/${id}`)
      .then(response => {
        console.log("student deleted", response);
        setStudents(students.filter(student => student.id !== id));
        // window.location.reload(true);
      })
      .catch(error => {
        console.log("error deleting student", error);
      });
  };

  const updateStudent = (id, newTeam) => {
    axios
      .put(`http://127.0.0.1:5000/student/${id}`, { team: newTeam })
      .then(response => {
        console.log(response);
        setStudents([...students, response.data]);
      })
      .catch(error => {
        console.log("update student error", error);
      });
  };

  const setNumberOfTeams = e => {
    e.preventDefault();
    let numberOfTeamsArray = [];
    for (let i = teamsEntry; i > 0; i--) {
      numberOfTeamsArray.unshift(i);
    }
    setTeamsArray(numberOfTeamsArray);
    renderTeams();
  };

  const renderTeams = () => {
    // CHANGES HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return teamsArray.map((team, idx) => {
      return (
        <TeamList
          key={idx}
          id={student.id}
          students={students}
          deleteStudent={deleteStudent}
          number={team}
          setStudents={setStudents}
        />
      );
    });
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    // const { destination, source, draggableId } = result;
    // if (!result.destination) {
    //   return;
    // }
    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // ) {
    //   return;
    // }
    // const students = setStudents[source.droppableId];
    // const newStudentIds = Array.from(students.id);
    // newStudentIds.splice(source.index, 1);
    // newStudentIds.splice(destination.index, 0, draggableId);

    // CALLING REORDER FUNCTION -- NOT WORKING
    // reorder(students, result.source.index, result.destination.index);

    // const newStudent = {
    //   ...students,
    //   [student.id]: newStudentIds
    // }
    // const newSate = {
    //   ...setStudents: {
    //     ...this.state.students,
    //     [newStudent.id]: newStudent
    //   }
    //   }

    const droppedStudent = students.find(
      student => student.id === result.draggableId
    );

    updateStudent(droppedStudent.id, result.destination.droppableId);

    droppedStudent.team = +result.destination.droppableId;

    setReRender(!reRender);
    // getStudents();
  };

  // * * * * * *  Activates top title bar  * * * * * *
  React.useEffect(() => {
    window.scrollTo(0, 1);
  });

  document.addEventListener("scroll", () => {
    document.documentElement.dataset.scroll = window.scrollY;
  });

  // * * * * * *  Scroll to top on refresh  * * * * * *
  window.onbeforeunload = function() {
    window.scrollTo(0, 0);
  };

  return (
    <div className="page-wrapper">
      <TitleBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="add-number-of-teams-wrapper">
          <form onSubmit={setNumberOfTeams}>
            <div className="add-teams-form-wrapper">
              <div className="teams-input">
                <input
                  type="text"
                  placeholder="Number of Teams"
                  value={teamsEntry}
                  onChange={e => setTeamsEntry(e.target.value)}
                />
              </div>

              <div className="buttons">
                <button className="add-team-button">Add Teams</button>
              </div>
            </div>
          </form>
        </div>

        <div className="left-column-droppable-wrapper">
          <Droppable droppableId={"0"}>
            {provided => (
              <div
                className="left-student-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {provided.placeholder}

                <div className="add-students-inputs-and-buttons-wrapper">
                  <form onSubmit={handleSubmit}>
                    <div className="add-students-form-wrapper">
                      <div className="students-input">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={student}
                          onChange={e => setStudent(e.target.value)}
                        />
                      </div>

                      <div className="buttons">
                        <button className="add-student-button">
                          Add Student
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="unsorted-students-wrapper">
                  <div className="unsorted-header-text">Unsorted Students</div>
                  <div className="buttons">
                    <button className="randomize-button">Randomize</button>
                  </div>
                  <div className="render-unsorted-students">
                    {renderStudents()}
                  </div>
                </div>
              </div>
            )}
          </Droppable>

          <div className="teams-wrapper">
            {students.length !== 0 ? renderTeams() : null}
            {/* <TeamList students={students} number={"1"} />
            <TeamList students={students} number={"2"} />
            <TeamList students={students} number={"3"} />
            <TeamList students={students} number={"4"} />
            <TeamList students={students} number={"5"} />
            <TeamList students={students} number={"6"} /> */}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;

// Database link: "https://dragn-drop-teams.herokuapp.com"

// GET: https://dragn-drop-teams.herokuapp.com/students
// GET: https://dragn-drop-teams.herokuapp.com/student/${id}
// POST: https://dragn-drop-teams.herokuapp.com/student
// PUT: https://dragn-drop-teams.herokuapp.com/student/${id}
// DELETE: https://dragn-drop-teams.herokuapp.com/student/${id}

// "id" : int
// "name" : string
// "team" : int
