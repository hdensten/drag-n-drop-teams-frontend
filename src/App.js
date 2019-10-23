import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd"

import StudentDraggable from "./StudentDraggable"
import TeamList from "./TeamList"
import mockData from "./mockData"

const App = () => {
  const [student, setStudent] = React.useState("")
  const [students, setStudents] = React.useState(mockData)

  //   fetch("https://mar-todo-api.herokuapp.com/todos")
  //     .then(response => response.json())
  //     .then(data => setStudents({ students: data }));
  // }

  useEffect(() => {
    fetch("https://localhost:/students")
      .then( res => res.json())
      .then( data => {setStudents(data)})
  })


  const renderStudents = () => {
    const noTeam = students.filter(student => student.team === 0)
    return noTeam.map((student, index) => {
      return (
        <StudentDraggable 
        key={student.id} 
        student={student} 
        index={index}
        id={student.id}
         />
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

  const addStudent = e => {
    e.preventDefault()
    fetch("https://localhost:3000/students", {
      method: "POST",
      headers: { "content-type": "aplication/json" },
      body: JSON.stringify({
        student: student
      })
    })
    .then(res => res.json())
    .then(data => {
      setStudent: "",
      setStudents: [...student, data]
    })
  }

  const deletStudent = id => {
    fetch(`https://localhost/${id}`, 
    {method:"DELETE"
  }).then(
    setStudents: students.filter(student => student.id !==id)
  )
  }

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }
  
    // const addTodo = event => {
    //   event.preventDefault();
    //   fetch("https://mar-todo-api.herokuapp.com/todo", {
    //     method: "POST",
    //     headers: { "content-type": "application/json" },
    //     body: JSON.stringify({
    //       title: this.state.todo,
    //       done: false
    //     })
    //   })
    //     .then(response => response.json())
    //     .then(data =>
    //       this.setState({
    //         todos: [...this.state.todos, data],
    //         todo: ""
    //       })
    //     );
    // };
  

    const droppedStudent = students.find(
      student => student.id === result.draggableId
    )
    droppedStudent.team = +result.destination.droppableId
  }

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
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
