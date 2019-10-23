import React from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import TitleBar from "./components/TitleBar"
import StudentDraggable from "./components/StudentDraggable"
import TeamList from "./components/TeamList"
import mockData from "./mockData"
import Icons from "./helpers/icons"

const App = () => {
  Icons()

  const [student, setStudent] = React.useState("")
  const [students, setStudents] = React.useState(mockData)

  const renderStudents = () => {
    const noTeam = students.filter(student => student.team === 0)
    return noTeam.map((student, index) => {
      return (
        <StudentDraggable key={student.id} student={student} index={index} />
      )
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setStudents([
      ...students,
      { id: students.length + 1, name: student, team: 0 }
    ])
  }

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }

    const droppedStudent = students.find(
      student => student.id === result.draggableId
    )
    droppedStudent.team = +result.destination.droppableId
  }

  document.addEventListener("scroll", () => {
    document.documentElement.dataset.scroll = window.scrollY
    console.log("hello")
  })

  return (
    <div className="page-wrapper">
      <TitleBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="trash-icon-wrapper">
          <Droppable droppableId={"100"}>
            {provided => (
              <div
                className="trash"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="trash-icon">
                  <FontAwesomeIcon icon="trash" />
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="add-number-of-teams-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="add-teams-form-wrapper">
              <div className="teams-input">
                <input
                  type="text"
                  placeholder="Number of Teams"
                  value={student}
                  onChange={e => setStudent(e.target.value)}
                />
              </div>

              <div className="buttons">
                <button className="add-button">Add Teams</button>
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
                        <button className="add-button">Add Student</button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="unsorted-students-wrapper">
                  <div className="unsorted-header-text">Unsorted Students</div>
                  <button className="random-assignment-button">
                    Randomize
                  </button>
                  {renderStudents()}
                </div>
              </div>
            )}
          </Droppable>

          <div className="teams-wrapper">
            <TeamList students={students} number={"1"} />
            <TeamList students={students} number={"2"} />
            <TeamList students={students} number={"3"} />
            <TeamList students={students} number={"4"} />
            <TeamList students={students} number={"5"} />
            <TeamList students={students} number={"6"} />
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
