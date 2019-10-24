import React from "react"
import { Droppable } from "react-beautiful-dnd"

import StudentDraggable from "./StudentDraggable"

const TeamList = props => {
  const [students] = React.useState(props.students)

  const renderStudents = () => {
    const teamPride = students.filter(
      student => student.team === +props.number
    );

    props.setStudents(
      props.students.filter(student => student.id !== props.id)
    );

    return teamPride.map((student, index) => {
      return (
        <StudentDraggable
          key={student.id}
          student={student}
          deleteStudent={props.deleteStudent}
          index={index}
        />
      );
    });
  };

  return (
    <Droppable droppableId={props.number}>
      {provided => (
        <div
          className="team-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="team-title">Team #{props.number}</div>
          <div className="team-students">{renderStudents()}</div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default TeamList
