import React from "react"
import { Draggable } from "react-beautiful-dnd"

const StudentDraggable = props => {
  const { student } = props

  return (
    <Draggable draggableId={student.id} index={props.index}>
      {provided => (
        <div
          className="student-draggable"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <p className="student-name">{student.name}</p>
        </div>
      )}
    </Draggable>
  )
}

export default StudentDraggable
