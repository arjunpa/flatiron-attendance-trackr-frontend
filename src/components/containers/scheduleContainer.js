import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker'
import "../../assets/calendar-style.css"
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AttendanceRecordContainer from './attendanceRecordContainer';
import StudentsContainer from './studentsContainer';
import * as currentUserActions from '../../actions/currentUserActions';
import * as attendanceRecordActions from '../../actions/attendanceRecordActions';
import * as instructorActions from '../../actions/instructorActions';

class ScheduleContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {selectedStudent: null, selectedRecord: null, selectedDay: '2016-08-08T00:00:00.000Z'}
    this.selectStudent = this.selectStudent.bind(this)
  }

  currentUserPresent() {
    return Object.keys(this.props.currentUser).length > 0 ? true : false
  }

  componentDidMount() {
    console.log('in CDM')
    if (!this.currentUserPresent()) {
      this.props.actions.fetchCurrentUser();
    }

    if (this.props.attendanceRecords.length == 0) {
      this.props.actions.fetchAttendanceRecords();
    }

  }

  selectStudent(studentId) {
    const student = this.props.students.find(student => student.id == studentId)
    const recordsBySelectedDate = this.props.attendanceRecords.find(recordsByDate => {
      return recordsByDate.date == this.state.selectedDay
    })
    const record = recordsBySelectedDate.records.find(record => record.student_id == studentId)
    this.setState({selectedStudent: student, selectedRecord: record})
  }

  render() {
    return ( 
      <div>
        <div className="col-lg-12">
          {this.props.currentUser.instructor ? <StudentsContainer selectedStudent={this.state.selectedStudent} selectStudent={this.selectStudent}/> : null}
          <div className='col-lg-6'>
            <DayPicker
            initialMonth={ new Date(2016, 9) }
            onDayClick={(event, day) => {console.log(day)}}/> 
          </div>
          <AttendanceRecordContainer 
            day={this.state.selectedDay} 
            student={this.state.selectedStudent} 
            record={this.state.selectedRecord}/>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state, ownProps) {
  if (state.currentUser.instructor) {    
    return {currentUser: state.currentUser, attendanceRecords: state.attendanceRecords, students: state.students}
  } else {
    return {currentUser: state.currentUser, attendanceRecords: state.attendanceRecords}
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(Object.assign(currentUserActions, attendanceRecordActions, instructorActions), dispatch)}
}


export default connect(mapStateToProps, mapDispatchToProps)(ScheduleContainer);

