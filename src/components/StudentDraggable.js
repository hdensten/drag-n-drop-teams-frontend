import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
          <div className="student-card-content-wrapper">
            <div className="student-name-wrapper">
              <p className="student-name">{student.name}</p>
            </div>
            <div className="trash-icon-wrapper">
              <div className="trash-icon">
                <a onClick={() => props.deleteStudent(props.student.id)}>
                  <FontAwesomeIcon icon="trash" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default StudentDraggable
