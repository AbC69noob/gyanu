


import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import "../styles/Dashboard.css";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Dashboard = () => {
  const { logout, userRole } = useAuth();

  const isAdmin = userRole === 'ADM';
  const isTeacher = userRole === 'TEA' || userRole === 'user' || isAdmin; // Admins can also do teacher tasks
  const isStudent = userRole === 'STD';
  const isUser = userRole === 'USE';
  const isUserDashboard = isTeacher && !isAdmin;
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCourseAllocation, setShowCourseAllocation] = useState(false);

  const [showHome, setShowHome] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchData, setBatchData] = useState({ name: "" });
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [editingBatches, setEditingBatches] = useState({});
  const [editBatchData, setEditBatchData] = useState({});
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [facultyData, setFacultyData] = useState({ name: "" });
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [editingFaculties, setEditingFaculties] = useState({});
  const [editFacultyData, setEditFacultyData] = useState({});
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingAllocation, setIsAddingAllocation] = useState(false);
  const [teacherData, setTeacherData] = useState({ name: "", email: "", status: 1 });
  const [programData, setProgramData] = useState({ name: "", facultyId: "" });
  const [subjectData, setSubjectData] = useState({ name: "", code: "", program: "", semester: "", teacher: "" });
  const [viewAttendanceDate, setViewAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    status: true,
    role: "",
    fullName: "",
    address: "",
    contact: "",
    rollNo: "",
    program: "",
    semester: "",
    faculty: "",
    batch: ""
  });
  const [studentData, setStudentData] = useState({ name: "", rollNo: "", status: 1, program: "", semester: "" });
  const [courseData, setCourseData] = useState({ course: "", faculty: "", semester: "" });
  const [allocationData, setAllocationData] = useState({ faculty: "", semester: "", subject: "", teacher: "" });
  const [attendanceData, setAttendanceData] = useState({ student: "", subject: "", date: "", status: "" });
  const [isAddingAttendance, setIsAddingAttendance] = useState(false);
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocationFaculty, setSelectedAllocationFaculty] = useState("");
  const [selectedAllocationTeacher, setSelectedAllocationTeacher] = useState("");
  const [users, setUsers] = useState([]);
  const [editingStudents, setEditingStudents] = useState({});
  const [editStudentData, setEditStudentData] = useState({});
  const [editingUsers, setEditingUsers] = useState({});
  const [editUserData, setEditUserData] = useState({});
  const [editingSubjects, setEditingSubjects] = useState({});
  const [editSubjectData, setEditSubjectData] = useState({});
  const [editingAllocations, setEditingAllocations] = useState({});
  const [editAllocationData, setEditAllocationData] = useState({});
  const [editingPrograms, setEditingPrograms] = useState({});
  const [editProgramData, setEditProgramData] = useState({});
  const [editingTeachers, setEditingTeachers] = useState({});
  const [editTeacherData, setEditTeacherData] = useState({});
  const [editingAttendance, setEditingAttendance] = useState({});
  const [editAttendanceData, setEditAttendanceData] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [homeSelectedProgram, setHomeSelectedProgram] = useState("");
  const [homeSelectedSemester, setHomeSelectedSemester] = useState("");
  const [homeSelectedSubject, setHomeSelectedSubject] = useState("");
  const [homeSelectedBatch, setHomeSelectedBatch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [studentHomeProgram, setStudentHomeProgram] = useState("");
  const [studentHomeSemester, setStudentHomeSemester] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [markAttendanceProgram, setMarkAttendanceProgram] = useState("");
  const [markAttendanceSemester, setMarkAttendanceSemester] = useState("");
  const [markAttendanceSubject, setMarkAttendanceSubject] = useState("");
  const [attendanceDashboardDate, setAttendanceDashboardDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceDashboardMode, setAttendanceDashboardMode] = useState(null); // 'view' or 'mark'
  const handleBulkPromotion = async () => {
    try {
      setLoading(true);
      await api.put("/api/student/promote", null, {
        params: {
          programId: promotionData.programId,
          currentSemesterId: promotionData.currentSemesterId,
          targetSemesterId: promotionData.targetSemesterId
        }
      });
      setSuccess("Students promoted successfully!");
      setIsPromoting(false);
      fetchStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote students");
    } finally {
      setLoading(false);
    }
  };
  const [dashboardProgram, setDashboardProgram] = useState("");
  const [dashboardSemester, setDashboardSemester] = useState("");
  const [dashboardSubject, setDashboardSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [reportType, setReportType] = useState("daily"); // daily, weekly, monthly
  const [reportStartDate, setReportStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportProgram, setReportProgram] = useState("");
  const [reportSemester, setReportSemester] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [teachersPage, setTeachersPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);
  const [subjectsPage, setSubjectsPage] = useState(1);
  const [allocationsPage, setAllocationsPage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [programsPage, setProgramsPage] = useState(1);
  const [facultiesPage, setFacultiesPage] = useState(1);
  const [batchesPage, setBatchesPage] = useState(1);
  const itemsPerPage = 10;
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionData, setPromotionData] = useState({
    programId: "",
    currentSemesterId: "",
    targetSemesterId: ""
  });
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const visibleSubjects = (isTeacher && !isAdmin)
    ? subjects.filter((s) => String(s.teacher?.id) === String(currentTeacher?.id))
    : subjects;
  const homeSubjectOptions = visibleSubjects.filter((subject) => {
    const matchesProgram = !homeSelectedProgram ||
      subject.program?.id?.toString() === homeSelectedProgram;
    const matchesSemester = !homeSelectedSemester ||
      subject.semester?.id?.toString() === homeSelectedSemester;
    return matchesProgram && matchesSemester;
  });

  useEffect(() => {
    setPdfGenerated(false);
  }, [reportProgram, reportSemester, reportSubject, reportStartDate, reportEndDate]);

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchPrograms();
    fetchSemesters();
    fetchFaculties();
    fetchSubjects();
    fetchAttendance();
    fetchBatches();
    if (isStudent) {
      fetchCurrentStudent();
      fetchAllStudentsForStudent();
    }
    if (isTeacher && !isAdmin) {
      fetchCurrentTeacher();
      fetchAllocations();
    }
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/api/faculties");
      setFaculties(response.data);
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await api.get("/api/course-allocations");
      setAllocations(response.data);
    } catch (err) {
      console.error("Failed to fetch allocations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.get("/api/program");
      setPrograms(response.data);
    } catch (err) {
      console.error("Failed to fetch programs:", err);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await api.get("/semester");
      setSemesters(response.data);
    } catch (err) {
      console.error("Failed to fetch semesters:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/api/attendance");
      setAttendance(response.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await api.get("/api/batches");
      setBatches(response.data);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/api/teachers");
      setTeachers(response.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      <button onClick={() => switchToForm('programs')} className="sidebar-button">
        📚 Programs
      </button>
      console.log("Fetching students...");
      const response = await api.get("/api/student");
      console.log("Students response:", response.data);
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchCurrentStudent = async () => {
    try {
      const response = await api.get("/api/student/current");
      console.log("Current student:", response.data);
      setCurrentStudent(response.data);
    } catch (err) {
      console.error("Failed to fetch current student:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchCurrentTeacher = async () => {
    try {
      const response = await api.get("/api/teachers/current");
      console.log("Current teacher:", response.data);
      setCurrentTeacher(response.data);
    } catch (err) {
      console.error("Failed to fetch current teacher:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchStudentsByProgramSemester = async () => {
    if (studentHomeProgram && studentHomeSemester) {
      try {
        const response = await api.get("/api/student/by-program-semester", {
          params: {
            programId: studentHomeProgram,
            semesterId: studentHomeSemester
          }
        });
        setFilteredStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    } else {
      setFilteredStudents([]);
    }
  };

  const fetchAllStudentsForStudent = async () => {
    try {
      const response = await api.get("/api/student");
      setFilteredStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch all students:", err);
    }
  };

  useEffect(() => {
    if (isStudent && studentHomeProgram && studentHomeSemester) {
      fetchStudentsByProgramSemester();
    }
  }, [studentHomeProgram, studentHomeSemester]);

  useEffect(() => {
    if (!homeSelectedSubject) return;
    const isStillValid = homeSubjectOptions.some(
      (subject) => String(subject.id) === String(homeSelectedSubject)
    );
    if (!isStillValid) {
      setHomeSelectedSubject("");
    }
  }, [homeSelectedProgram, homeSelectedSemester, homeSelectedSubject, homeSubjectOptions]);

  const computeAttendanceSummary = (records) => {
    const summary = { P: [], A: [], L: [] };
    records.forEach(r => {
      if (r.status === 'P') summary.P.push(r);
      else if (r.status === 'A') summary.A.push(r);
      else if (r.status === 'L') summary.L.push(r);
    });
    return summary;
  };

  const markAttendance = async (studentId, status) => {
    // Determine which subject ID to use based on context
    let subjectId = markAttendanceSubject || homeSelectedSubject;

    console.log('markAttendance called with:', { studentId, status, subjectId, markAttendanceSubject, homeSelectedSubject });

    if (!subjectId) {
      setError("Please select a subject before marking attendance");
      setTimeout(() => setError(""), 3000);
      return;
    }

    let statusValue = '';
    if (status === 'present') {
      statusValue = 'P';
    } else if (status === 'absent') {
      statusValue = 'A';
    } else if (status === 'leave') {
      statusValue = 'L';
    }

    // Use attendanceDashboardDate if in dashboard mode, otherwise use current date
    const attendanceDate = attendanceDashboardMode ? attendanceDashboardDate : new Date().toISOString().split('T')[0];

    try {
      const payload = {
        date: attendanceDate,
        status: statusValue,
        student: { id: studentId },
        subject: { id: parseInt(subjectId) }
      };

      console.log('API call payload:', payload);

      const response = await api.post("/api/attendance", payload);
      console.log('API response:', response);

      setSuccess(`Attendance marked as ${status}!`);
      setTimeout(() => setSuccess(""), 3000);
      fetchAttendance();
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || `Failed to mark ${status}`);
      setTimeout(() => setError(""), 3000);
    } finally {
      setAttendanceLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!teacherData.name || !teacherData.email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/teachers", {
        fullName: teacherData.name,
        email: teacherData.email,
        contact: "",
        status: teacherData.status
      });
      setSuccess("Teacher added successfully!");
      setTeacherData({ name: "", email: "", status: 1 });
      await fetchTeachers();
      setIsAddingTeacher(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAllocationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!allocationData.faculty || !allocationData.semester || !allocationData.subject || !allocationData.teacher) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/course-allocations", {
        faculty: { id: parseInt(allocationData.faculty) },
        semester: { id: parseInt(allocationData.semester) },
        subject: { id: parseInt(allocationData.subject) },
        teacher: { id: parseInt(allocationData.teacher) }
      });
      setSuccess("Course allocated successfully!");
      setAllocationData({ faculty: "", semester: "", subject: "", teacher: "" });
      fetchAllocations();
      setIsAddingAllocation(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to allocate course");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentData.name || !studentData.rollNo || !studentData.program || !studentData.semester) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/student", {
        name: studentData.name,
        rollNo: studentData.rollNo,
        status: parseInt(studentData.status),
        program: { id: parseInt(studentData.program) },
        semester: { id: parseInt(studentData.semester) }
      });
      setSuccess("Student added successfully!");
      setStudentData({ name: "", rollNo: "", status: 1, program: "", semester: "" });
      fetchStudents();
      setIsAddingStudent(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentCheckbox = (studentId, isChecked) => {
    setEditingStudents(prev => ({
      ...prev,
      [studentId]: isChecked
    }));

    if (isChecked) {
      const student = students.find(s => s.id === studentId);
      setEditStudentData(prev => ({
        ...prev,
        [studentId]: {
          name: student.name,
          rollNo: student.rollNo,
          program: student.program?.id || '',
          semester: student.semester?.id || ''
        }
      }));
    }
  };

  const handleEditStudentChange = (studentId, field, value) => {
    setEditStudentData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleUpdateStudent = async (studentId) => {
    try {
      setLoading(true);
      const data = editStudentData[studentId];
      const student = students.find(s => s.id === studentId);
      await api.put(`/api/student/${studentId}`, {
        name: data.name,
        rollNo: data.rollNo,
        status: student.status,
        program: { id: parseInt(data.program) },
        semester: { id: parseInt(data.semester) },
        batch: { id: parseInt(data.batch) }
      });
      setSuccess("Student updated successfully!");
      setEditingStudents(prev => ({ ...prev, [studentId]: false }));
      fetchStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to block this student?")) {
      try {
        setLoading(true);
        await api.delete(`/api/student/${studentId}`);
        setSuccess("Student blocked successfully!");
        fetchStudents();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to block student");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnblockStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to unblock this student?")) {
      try {
        setLoading(true);
        const student = students.find(s => s.id === studentId);
        await api.put(`/api/student/${studentId}`, {
          name: student.name,
          rollNo: student.rollNo,
          status: 1,
          program: { id: student.program?.id },
          semester: { id: student.semester?.id }
        });
        setSuccess("Student unblocked successfully!");
        fetchStudents();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to unblock student");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubjectCheckbox = (subjectId, isChecked) => {
    setEditingSubjects(prev => ({
      ...prev,
      [subjectId]: isChecked
    }));

    if (isChecked) {
      const subject = subjects.find(s => s.id === subjectId);
      setEditSubjectData(prev => ({
        ...prev,
        [subjectId]: {
          name: subject.name,
          code: subject.code,
          program: subject.program?.id || '',
          semester: subject.semester?.id || '',
          teacher: subject.teacher?.id || ''
        }
      }));
    }
  };

  const handleEditSubjectChange = (subjectId, field, value) => {
    setEditSubjectData(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value
      }
    }));
  };

  const handleUpdateSubject = async (subjectId) => {
    try {
      setLoading(true);
      const data = editSubjectData[subjectId];
      await api.put(`/subjects/${subjectId}`, {
        name: data.name,
        code: data.code,
        program: { id: parseInt(data.program) },
        semester: { id: parseInt(data.semester) },
        teacher: { id: parseInt(data.teacher) }
      });
      setSuccess("Subject updated successfully!");
      setEditingSubjects(prev => ({ ...prev, [subjectId]: false }));
      fetchSubjects();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subject");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocationCheckbox = (allocationId, isChecked) => {
    setEditingAllocations(prev => ({
      ...prev,
      [allocationId]: isChecked
    }));

    if (isChecked) {
      const allocation = allocations.find(a => a.id === allocationId);
      setEditAllocationData(prev => ({
        ...prev,
        [allocationId]: {
          faculty: allocation.faculty?.id || '',
          semester: allocation.semester?.id || '',
          subject: allocation.subject?.id || '',
          teacher: allocation.teacher?.id || ''
        }
      }));
    }
  };

  const handleEditAllocationChange = (allocationId, field, value) => {
    setEditAllocationData(prev => ({
      ...prev,
      [allocationId]: {
        ...prev[allocationId],
        [field]: value
      }
    }));
  };

  const handleUpdateAllocation = async (allocationId) => {
    try {
      setLoading(true);
      const data = editAllocationData[allocationId];
      await api.put(`/api/course-allocations/${allocationId}`, {
        faculty: { id: parseInt(data.faculty) },
        semester: { id: parseInt(data.semester) },
        subject: { id: parseInt(data.subject) },
        teacher: { id: parseInt(data.teacher) }
      });
      setSuccess("Allocation updated successfully!");
      setEditingAllocations(prev => ({ ...prev, [allocationId]: false }));
      fetchAllocations();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update allocation");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCheckbox = (userId, isChecked) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: isChecked
    }));

    if (isChecked) {
      const user = users.find(u => u.id === userId);
      setEditUserData(prev => ({
        ...prev,
        [userId]: {
          username: user.username,
          email: user.email,
          role: user.role?.code || ''
        }
      }));
    }
  };

  const handleEditUserChange = (userId, field, value) => {
    setEditUserData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handleUpdateUser = async (userId) => {
    try {
      setLoading(true);
      const data = editUserData[userId];
      const role = roles.find(r => r.code === data.role);
      const user = users.find(u => u.id === userId);
      await api.put(`/api/users/${userId}`, {
        username: data.username,
        email: data.email,
        status: user.status,
        role: { id: role?.id }
      });
      setSuccess("User updated successfully!");
      setEditingUsers(prev => ({ ...prev, [userId]: false }));
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        setLoading(true);
        await api.delete(`/api/users/${userId}`);
        setSuccess("User blocked successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to block user");
      } finally {
        setLoading(false);
      }
    }
  };


  const handleUnblockUser = async (userId) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        setLoading(true);
        const user = users.find(u => u.id === userId);
        await api.put(`/api/users/${userId}`, {
          username: user.username,
          email: user.email,
          status: true,
          role: { id: user.role?.id }
        });
        setSuccess("User unblocked successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to unblock user");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userData.username || !userData.email || !userData.password || !userData.role || !userData.fullName) {
      setError("Please fill in all required fields");
      return;
    }

    if (userData.role === 'STD' && (!userData.rollNo || !userData.program || !userData.semester || !userData.faculty || !userData.batch)) {
      setError("Roll No, Program, Semester, Faculty and Batch are required for students");
      return;
    }

    try {
      setLoading(true);

      // Create user first
      const userResponse = await api.post("/api/users/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        address: userData.address
      });

      const createdUser = userResponse.data;

      // Create student or teacher record based on role
      if (userData.role === 'STD') {
        console.log('Creating student with data:', {
          name: userData.fullName,
          rollNo: userData.rollNo,
          contact: userData.contact || '',
          address: userData.address || '',
          status: 1,
          userId: createdUser.id,
          programId: parseInt(userData.program),
          semesterId: parseInt(userData.semester),
          batchId: parseInt(userData.batch)
        });

        const studentResponse = await api.post("/api/student", {
          name: userData.fullName,
          rollNo: userData.rollNo,
          contact: userData.contact || '',
          address: userData.address || '',
          status: 1,
          userId: createdUser.id,
          programId: parseInt(userData.program),
          semesterId: parseInt(userData.semester),
          batchId: parseInt(userData.batch)
        });

        console.log('Student created:', studentResponse.data);
      } else if (userData.role === 'TEA') {
        const teacherResponse = await api.post("/api/teachers", {
          fullName: userData.fullName,
          email: userData.email,
          contact: userData.contact || '',
          address: userData.address || '',
          status: 1,
          userId: createdUser.id
        });

        console.log('Teacher created:', teacherResponse.data);
      }

      setSuccess("User added successfully!");
      setUserData({
        username: "",
        email: "",
        password: "",
        status: true,
        role: "",
        fullName: "",
        address: "",
        contact: "",
        rollNo: "",
        program: "",
        semester: "",
        faculty: "",
        batch: ""
      });
      await fetchUsers();
      setShowAddUserForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subjectData.name || !subjectData.code || !subjectData.program || !subjectData.semester || !subjectData.teacher) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/subjects", {
        name: subjectData.name,
        code: subjectData.code,
        program: { id: parseInt(subjectData.program) },
        semester: { id: parseInt(subjectData.semester) },
        teacher: { id: parseInt(subjectData.teacher) }
      });
      setSuccess("Subject added successfully!");
      setSubjectData({ name: "", code: "", program: "", semester: "", teacher: "" });
      fetchSubjects();
      setIsAddingSubject(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!programData.name) {
      setError("Please enter program name");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/program", {
        name: programData.name,
        faculty: { id: parseInt(programData.facultyId) }
      });
      setSuccess("Program added successfully!");
      setProgramData({ name: "", facultyId: "" });
      await fetchPrograms();
      setIsAddingProgram(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add program");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!batchData.name) {
      setError("Please enter batch name");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/batches", batchData);
      setSuccess("Batch added successfully!");
      setBatchData({ name: "" });
      fetchBatches();
      setIsAddingBatch(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Batch creation error:', err);
      setError(err.response?.data?.message || "Failed to add batch");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchCheckbox = (batchId, isChecked) => {
    setEditingBatches(prev => ({
      ...prev,
      [batchId]: isChecked
    }));

    if (isChecked) {
      const batch = batches.find(b => b.id === batchId);
      setEditBatchData(prev => ({
        ...prev,
        [batchId]: {
          name: batch.name
        }
      }));
    }
  };

  const handleEditBatchChange = (batchId, value) => {
    setEditBatchData(prev => ({
      ...prev,
      [batchId]: {
        name: value
      }
    }));
  };

  const handleUpdateBatch = async (batchId) => {
    try {
      setLoading(true);
      const data = editBatchData[batchId];
      await api.put(`/api/batches/${batchId}`, {
        name: data.name
      });
      setSuccess("Batch updated successfully!");
      setEditingBatches(prev => ({ ...prev, [batchId]: false }));
      fetchBatches();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update batch");
    } finally {
      setLoading(false);
    }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!facultyData.name) {
      setError("Please enter faculty name");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/faculties", facultyData);
      setSuccess("Faculty added successfully!");
      setFacultyData({ name: "" });
      await fetchFaculties();
      setIsAddingFaculty(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyCheckbox = (facultyId, isChecked) => {
    setEditingFaculties(prev => ({
      ...prev,
      [facultyId]: isChecked
    }));

    if (isChecked) {
      const faculty = faculties.find(f => f.id === facultyId);
      setEditFacultyData(prev => ({
        ...prev,
        [facultyId]: {
          name: faculty.name
        }
      }));
    }
  };

  const handleEditFacultyChange = (facultyId, value) => {
    setEditFacultyData(prev => ({
      ...prev,
      [facultyId]: {
        name: value
      }
    }));
  };

  const handleUpdateFaculty = async (facultyId) => {
    try {
      setLoading(true);
      const data = editFacultyData[facultyId];
      await api.put(`/api/faculties/${facultyId}`, {
        name: data.name
      });
      setSuccess("Faculty updated successfully!");
      setEditingFaculties(prev => ({ ...prev, [facultyId]: false }));
      fetchFaculties();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramCheckbox = (programId, isChecked) => {
    setEditingPrograms(prev => ({
      ...prev,
      [programId]: isChecked
    }));

    if (isChecked) {
      const program = programs.find(p => p.id === programId);
      setEditProgramData(prev => ({
        ...prev,
        [programId]: {
          name: program.name
        }
      }));
    }
  };

  const handleEditProgramChange = (programId, value) => {
    setEditProgramData(prev => ({
      ...prev,
      [programId]: {
        name: value
      }
    }));
  };

  const handleUpdateProgram = async (programId) => {
    try {
      setLoading(true);
      const data = editProgramData[programId];
      await api.put(`/api/program/${programId}`, {
        name: data.name
      });
      setSuccess("Program updated successfully!");
      setEditingPrograms(prev => ({ ...prev, [programId]: false }));
      fetchPrograms();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update program");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherCheckbox = (teacherId, isChecked) => {
    setEditingTeachers(prev => ({
      ...prev,
      [teacherId]: isChecked
    }));

    if (isChecked) {
      const teacher = teachers.find(t => t.id === teacherId);
      setEditTeacherData(prev => ({
        ...prev,
        [teacherId]: {
          fullName: teacher.fullName,
          email: teacher.email
        }
      }));
    }
  };

  const handleEditTeacherChange = (teacherId, field, value) => {
    setEditTeacherData(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [field]: value
      }
    }));
  };

  const handleUpdateTeacher = async (teacherId) => {
    try {
      setLoading(true);
      const data = editTeacherData[teacherId];
      const teacher = teachers.find(t => t.id === teacherId);
      await api.put(`/api/teachers/${teacherId}`, {
        fullName: data.fullName,
        email: data.email,
        contact: teacher.contact || '',
        status: teacher.status
      });
      setSuccess("Teacher updated successfully!");
      setEditingTeachers(prev => ({ ...prev, [teacherId]: false }));
      fetchTeachers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!attendanceData.student || !attendanceData.subject || !attendanceData.date || !attendanceData.status) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/attendance", {
        student: { id: parseInt(attendanceData.student) },
        subject: { id: parseInt(attendanceData.subject) },
        date: attendanceData.date,
        status: attendanceData.status
      });
      setSuccess("Attendance added successfully!");
      setAttendanceData({ student: "", subject: "", date: "", status: "" });
      fetchAttendance();
      setIsAddingAttendance(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceCheckbox = (attendanceId, isChecked) => {
    setEditingAttendance(prev => ({
      ...prev,
      [attendanceId]: isChecked
    }));

    if (isChecked) {
      const record = attendance.find(a => a.id === attendanceId);
      setEditAttendanceData(prev => ({
        ...prev,
        [attendanceId]: {
          student: record.student?.id || '',
          subject: record.subject?.id || '',
          date: record.date || '',
          status: record.status || ''
        }
      }));
    } else {
      // Clear edit data when unchecked
      setEditAttendanceData(prev => {
        const newData = { ...prev };
        delete newData[attendanceId];
        return newData;
      });
    }
  };

  const handleEditAttendanceChange = (attendanceId, field, value) => {
    setEditAttendanceData(prev => ({
      ...prev,
      [attendanceId]: {
        ...prev[attendanceId],
        [field]: value
      }
    }));
  };

  const handleUpdateAttendance = async (attendanceId) => {
    try {
      setLoading(true);
      const data = editAttendanceData[attendanceId];

      // Ensure all required fields are present
      if (!data.student || !data.subject || !data.date || !data.status) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }

      await api.put(`/api/attendance/${attendanceId}`, {
        date: data.date,
        status: data.status,
        student: { id: parseInt(data.student) },
        subject: { id: parseInt(data.subject) }
      });

      setSuccess("Attendance updated successfully!");
      setEditingAttendance(prev => ({ ...prev, [attendanceId]: false }));
      fetchAttendance();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if attendance is already marked for a student on a date
  const isAttendanceAlreadyMarked = (studentId, subjectId, date) => {
    return attendance.some(record =>
      record.student?.id === studentId &&
      record.subject?.id === parseInt(subjectId) &&
      record.date === date
    );
  };

  // Helper function to get existing attendance record for update
  const getExistingAttendanceRecord = (studentId, subjectId, date) => {
    return attendance.find(record =>
      record.student?.id === studentId &&
      record.subject?.id === parseInt(subjectId) &&
      record.date === date
    );
  };

  const Pagination = ({ currentPage, setCurrentPage, totalItems, itemsPerPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        <span style={{ color: '#ffffff' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === totalPages || totalPages === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    );
  };

  const switchToForm = (formName) => {
    setShowHome(false);
    setShowTeacherForm(false);
    setShowProgramForm(false);
    setShowSubjects(false);
    setShowAttendance(false);
    setShowUserForm(false);
    setShowCourseAllocation(false);
    setShowReport(false);
    setShowStudentForm(false);
    setShowAddUserForm(false);
    setShowBatchForm(false);
    setShowFacultyForm(false);
    setIsAddingStudent(false);
    setIsAddingTeacher(false);
    setIsAddingProgram(false);
    setIsAddingSubject(false);
    setIsAddingAllocation(false);
    setIsAddingBatch(false);
    setIsAddingFaculty(false);
    setCurrentPage(1);
    setTeachersPage(1);
    setStudentsPage(1);
    setSubjectsPage(1);
    setAllocationsPage(1);
    setAttendancePage(1);
    setProgramsPage(1);
    setFacultiesPage(1);
    setBatchesPage(1);

    switch (formName) {
      case 'home': setShowHome(true); break;
      case 'users': setShowUserForm(true); fetchRoles(); fetchUsers(); fetchPrograms(); fetchSemesters(); break;
      case 'teachers': setShowTeacherForm(true); fetchTeachers(); break;
      case 'students': setShowStudentForm(true); fetchStudents(); fetchPrograms(); fetchSemesters(); break;
      case 'subjects': setShowSubjects(true); fetchSubjects(); fetchPrograms(); fetchSemesters(); fetchTeachers(); break;
      case 'programs': setShowProgramForm(true); fetchPrograms(); break;
      case 'attendance': setShowAttendance(true); fetchAttendance(); fetchPrograms(); fetchSemesters(); break;
      case 'allocations': setShowCourseAllocation(true); fetchFaculties(); fetchSemesters(); fetchSubjects(); fetchTeachers(); fetchAllocations(); break;
      case 'report': setShowReport(true); break;
      case 'subjects': setShowSubjects(true); setIsAddingSubject(false); fetchSubjects(); fetchPrograms(); fetchSemesters(); fetchTeachers(); break;
      case 'allocations': setShowCourseAllocation(true); setIsAddingAllocation(false); fetchFaculties(); fetchSemesters(); fetchSubjects(); fetchTeachers(); fetchAllocations(); break;
      case 'batches': setShowBatchForm(true); setIsAddingBatch(false); fetchBatches(); break;
      case 'faculties': setShowFacultyForm(true); setIsAddingFaculty(false); fetchFaculties(); break;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Get all attendance data for the selected filters (within date range)
    let allFilteredAttendance = attendance.filter(record => {
      const matchesProgram = reportProgram ? record.student?.program?.id?.toString() === reportProgram : true;
      const matchesSemester = reportSemester ? record.student?.semester?.id?.toString() === reportSemester : true;
      const matchesSubject = reportSubject ? record.subject?.id?.toString() === reportSubject : true;
      const matchesStartDate = reportStartDate ? record.date >= reportStartDate : true;
      const matchesEndDate = reportEndDate ? record.date <= reportEndDate : true;
      return matchesProgram && matchesSemester && matchesSubject && matchesStartDate && matchesEndDate;
    });

    // 1. Identify students in view (all students matching program/semester, and NOT blocked)
    const studentsInView = students.filter(s =>
      s.status !== 0 &&
      (!reportProgram || s.program?.id?.toString() === reportProgram) &&
      (!reportSemester || s.semester?.id?.toString() === reportSemester) &&
      (!isStudent || (currentStudent && s.id === currentStudent.id))
    );

    // 2. Group attendance by student
    const markingsByStudent = {};
    allFilteredAttendance.forEach(record => {
      const sId = record.student?.id;
      if (!sId) return;
      if (!markingsByStudent[sId]) markingsByStudent[sId] = [];
      markingsByStudent[sId].push(record);
    });

    // 3. Find max markings
    const maxMarkings = Math.max(0, ...Object.values(markingsByStudent).map(m => m.length));

    // 4. Calculate stats for each student including synthetic absences
    const studentsWithPercentages = studentsInView.map(student => {
      const studentMarkings = markingsByStudent[student.id] || [];
      const present = studentMarkings.filter(r => r.status === 'P').length;
      const leave = studentMarkings.filter(r => r.status === 'L').length;
      const absent = maxMarkings - present - leave;

      return {
        student,
        present,
        absent,
        leave,
        total: maxMarkings,
        presentPercentage: maxMarkings > 0 ? ((present / maxMarkings) * 100).toFixed(1) : '0.0',
        absentPercentage: maxMarkings > 0 ? ((absent / maxMarkings) * 100).toFixed(1) : '0.0',
        leavePercentage: maxMarkings > 0 ? ((leave / maxMarkings) * 100).toFixed(1) : '0.0'
      };
    });

    // Header
    doc.setFontSize(20);
    doc.text('Comprehensive Attendance Report', 20, 20);

    // Report details
    doc.setFontSize(12);
    const program = programs.find(p => p.id?.toString() === reportProgram);
    const semester = semesters.find(s => s.id?.toString() === reportSemester);
    const subject = subjects.find(s => s.id?.toString() === reportSubject);

    doc.text(`Program: ${program?.name || 'All'}`, 20, 35);
    doc.text(`Semester: ${semester?.number || 'All'}`, 20, 45);
    doc.text(`Subject: ${subject?.name || 'All'}`, 20, 55);
    doc.text(`Range: ${reportStartDate || 'N/A'} to ${reportEndDate || 'N/A'}`, 20, 65);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 75);
    doc.text(`Total Students: ${studentsWithPercentages.length}`, 20, 85);

    // Student Details with Attendance Percentages
    if (studentsWithPercentages.length > 0) {
      autoTable(doc, {
        startY: 95,
        head: [['Student Name', 'Roll No', 'Total Classes', 'Present', 'Absent', 'Leave', 'Attendance %']],
        body: studentsWithPercentages.map(data => [
          data.student?.name || 'N/A',
          data.student?.rollNo || 'N/A',
          data.total.toString(),
          `${data.present} (${data.presentPercentage}%)`,
          `${data.absent} (${data.absentPercentage}%)`,
          `${data.leave} (${data.leavePercentage}%)`,
          `${data.presentPercentage}%`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          6: { halign: 'center', fontStyle: 'bold' }
        }
      });
    }

    // Save PDF
    const fileName = `attendance-report-${reportStartDate}-to-${reportEndDate}.pdf`;
    doc.save(fileName);
    setPdfGenerated(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Attendance Dashboard</h1>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-layout">
        {!isStudent && (
          <div className="sidebar">

            {/* ── Home ─────────────────────────────── */}
            <button onClick={() => switchToForm('home')} className="sidebar-button home-button">
              🏠 Home
            </button>

            {/* ── PEOPLE ───────────────────────────── */}
            {isAdmin && (
              <>
                <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0.6rem 0.2rem', marginTop: '0.5rem' }}>
                  People
                </p>
                <button onClick={() => switchToForm('users')} className="sidebar-button">
                  👤 Manage Users
                </button>
                <button onClick={() => switchToForm('teachers')} className="sidebar-button">
                  👨‍🏫 Manage Teachers
                </button>
                <button onClick={() => switchToForm('students')} className="sidebar-button">
                  🎓 Manage Students
                </button>
              </>
            )}

            {/* ── ACADEMICS ────────────────────────── */}
            {isAdmin && (
              <>
                <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0.6rem 0.2rem', marginTop: '0.5rem' }}>
                  Academics
                </p>
                <button onClick={() => switchToForm('faculties')} className="sidebar-button">
                  🏛️ Faculties
                </button>
                {/*
              <button onClick={() => switchToForm('programs')} className="sidebar-button">
                📚 Programs
              </button>
              */}
                <button onClick={() => switchToForm('subjects')} className="sidebar-button">
                  📖 Subjects
                </button>
                <button onClick={() => switchToForm('batches')} className="sidebar-button">
                  🗂️ Batches
                </button>
                <button onClick={() => switchToForm('allocations')} className="sidebar-button">
                  📋 Course Allocation
                </button>
              </>
            )}

            {/* Teacher-only subjects */}
            {isUserDashboard && (
              <>
                {/*
              <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0.6rem 0.2rem', marginTop: '0.5rem' }}>
                Academics
              </p>
              */}
                {/*
              <button onClick={() => switchToForm('subjects')} className="sidebar-button">
                📖 Subjects
              </button>*/}
              </>
            )}

            {/* ── ATTENDANCE ───────────────────────── */}
            {/*}
          <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0.6rem 0.2rem', marginTop: '0.5rem' }}>
            Attendance
          </p>
          {/*<button onClick={() => switchToForm('attendance')} className="sidebar-button">
            {isStudent ? '📅 View Attendance' : isTeacher && !isAdmin ? '✅ Mark Attendance' : '📅 Manage Attendance'}
          </button>/*}

          {/* ── REPORTS ──────────────────────────── */}
            {(isAdmin || isTeacher || isStudent) && (
              <>
                <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 0.6rem 0.2rem', marginTop: '0.5rem' }}>
                  Reports
                </p>
                <button onClick={() => switchToForm('report')} className="sidebar-button">
                  📊 {isStudent ? 'View Report' : 'Generate Report'}
                </button>
              </>
            )}
          </div>
        )}

        <div className={`main-content ${isStudent ? 'full-width' : ''}`}>

          {showHome && (
            <div className="students-section">
              {isStudent ? (
                <div className="student-premium-dashboard" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                  {/* Premium Student Profile Header */}
                  <div className="student-profile-header">
                    <div className="student-avatar-large">
                      {currentStudent?.name?.charAt(0) || 'S'}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      {currentStudent?.name || 'Student Name'}
                    </h1>
                    <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.1rem' }}>
                      {currentStudent?.program?.name || 'Program Name'}
                    </p>

                    <div className="student-info-grid">
                      <div className="info-item">
                        <span className="info-label">Semester</span>
                        <span className="info-value">{currentStudent?.semester?.number || '-'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Roll Number</span>
                        <span className="info-value">{currentStudent?.rollNo || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance History Section */}
                  <div className="attendance-history-section">
                    <h2>Attendance History</h2>
                    <div className="table-container">
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance
                            .filter(a => a.student?.id === currentStudent?.id)
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((record) => (
                              <tr key={record.id}>
                                <td>{record.subject?.name}</td>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>
                                  <span className={`status-badge ${record.status === 'PRESENT' ? 'present' :
                                    record.status === 'ABSENT' ? 'absent' : 'leave'
                                    }`}>
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          {attendance.filter(a => a.student?.id === currentStudent?.id).length === 0 && (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No attendance records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : isTeacher && !isAdmin ? (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.35rem' }}>👋 Welcome, {currentTeacher?.fullName || 'Teacher'}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Your assigned subjects are listed below. Select a subject to start marking attendance.</p>
                  </div>

                  {(() => {
                    // Filter subjects directly by teacher_id (linked in subject table)
                    const myAllocations = subjects.filter(
                      (s) => s.teacher?.id === currentTeacher?.id
                    ).map((s) => ({ id: s.id, subject: s, faculty: s.program?.faculty, semester: s.semester }));

                    if (myAllocations.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
                          <p style={{ fontWeight: '600', color: '#94a3b8' }}>No subjects assigned yet</p>
                          <p style={{ fontSize: '0.875rem', marginTop: '0.35rem' }}>Please contact an administrator to allocate subjects to you.</p>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {myAllocations.map((allocation) => (
                          <div
                            key={allocation.id}
                            onClick={() => {
                              setHomeSelectedSubject(String(allocation.subject?.id));
                              setHomeSelectedProgram(String(allocation.subject?.program?.id || ''));
                              setHomeSelectedSemester(String(allocation.semester?.id || ''));
                            }}
                            style={{
                              background: homeSelectedSubject === String(allocation.subject?.id)
                                ? 'rgba(99, 102, 241, 0.18)'
                                : 'rgba(255,255,255,0.04)',
                              border: homeSelectedSubject === String(allocation.subject?.id)
                                ? '1px solid rgba(99,102,241,0.5)'
                                : '1px solid rgba(255,255,255,0.09)',
                              borderRadius: '12px',
                              padding: '1.25rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: homeSelectedSubject === String(allocation.subject?.id)
                                ? '0 4px 20px rgba(99,102,241,0.2)'
                                : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                              <div style={{ fontSize: '1.6rem' }}>📖</div>
                              {homeSelectedSubject === String(allocation.subject?.id) && (
                                <span style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '999px', letterSpacing: '0.05em' }}>SELECTED</span>
                              )}
                            </div>
                            <div style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.25rem' }}>
                              {allocation.subject?.name || 'N/A'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
                              {allocation.subject?.code || ''}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                🏛️ <span style={{ color: '#cbd5e1' }}>{allocation.subject?.program?.name || 'N/A'}</span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                📅 Semester <span style={{ color: '#cbd5e1' }}>{allocation.subject?.semester?.number || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Attendance marking filter row — shown only after a subject is selected */}
                  {/*
                  {homeSelectedSubject && (
                    <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Filter students for the selected subject:</p>
                      <div className="filter-container">
                        <select value={homeSelectedProgram} onChange={(e) => setHomeSelectedProgram(e.target.value)} className="filter-select">
                          <option value="">All Programs</option>
                          {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <select value={homeSelectedSemester} onChange={(e) => setHomeSelectedSemester(e.target.value)} className="filter-select">
                          <option value="">All Semesters</option>
                          {semesters.map((s) => <option key={s.id} value={s.id}>{s.number}</option>)}
                        </select>
                        <select value={homeSelectedBatch} onChange={(e) => setHomeSelectedBatch(e.target.value)} className="filter-select">
                          <option value="">All Batches</option>
                          {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  */}

                  {homeSelectedSubject && (
                    <div className="mark-attendance-section" style={{ marginTop: '1.5rem' }}>
                      {(() => {
                        const selectedSubject = subjects.find(
                          (s) => String(s.id) === String(homeSelectedSubject)
                        );
                        const subjectProgramId = selectedSubject?.program?.id?.toString() || homeSelectedProgram;
                        const subjectSemesterId = selectedSubject?.semester?.id?.toString() || homeSelectedSemester;

                        const filtered = students.filter((student) => {
                          const matchesProgram = !subjectProgramId ||
                            student.program?.id?.toString() === subjectProgramId;
                          const matchesSemester = !subjectSemesterId ||
                            student.semester?.id?.toString() === subjectSemesterId;
                          const matchesBatch = !homeSelectedBatch ||
                            student.batch?.id?.toString() === homeSelectedBatch;
                          return student.status !== 0 && matchesProgram && matchesSemester && matchesBatch;
                        });

                        return (
                          <>
                            <h4>
                              Mark Attendance — {selectedSubject?.name || 'Selected Subject'} ({attendanceDashboardDate})
                            </h4>
                            {filtered.length === 0 ? (
                              <p className="no-attendance">No students found for the selected subject</p>
                            ) : (
                              <div className="table-container">
                                <table className="students-table">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Roll No</th>
                                      <th>Program</th>
                                      <th>Semester</th>
                                      <th>Mark Attendance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filtered.map((student) => (
                                      <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.rollNo}</td>
                                        <td>{student.program?.name || 'N/A'}</td>
                                        <td>{student.semester?.number || 'N/A'}</td>
                                        <td>
                                          {isAttendanceAlreadyMarked(student.id, homeSelectedSubject, attendanceDashboardDate) ? (
                                            <div className="attendance-marked-status">
                                              <span className="marked-badge">✓ Already Marked</span>
                                              <p className="edit-instruction">Go to View Attendance to update</p>
                                            </div>
                                          ) : (
                                            <div className="attendance-buttons">
                                              <button
                                                type="button"
                                                onClick={() => markAttendance(student.id, 'present')}
                                                disabled={attendanceLoading[student.id]}
                                                className="attendance-btn present-btn"
                                              >
                                                Present
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => markAttendance(student.id, 'absent')}
                                                disabled={attendanceLoading[student.id]}
                                                className="attendance-btn absent-btn"
                                              >
                                                Absent
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => markAttendance(student.id, 'leave')}
                                                disabled={attendanceLoading[student.id]}
                                                className="attendance-btn leave-btn"
                                              >
                                                Leave
                                              </button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3>Student Attendance</h3>
                  <div className="filter-container">
                    <select
                      value={homeSelectedProgram}
                      onChange={(e) => setHomeSelectedProgram(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Programs</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={homeSelectedSemester}
                      onChange={(e) => setHomeSelectedSemester(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Semesters</option>
                      {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.number}
                        </option>
                      ))}
                    </select>

                    <select
                      value={homeSelectedBatch}
                      onChange={(e) => setHomeSelectedBatch(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Batches</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={homeSelectedSubject}
                      onChange={(e) => setHomeSelectedSubject(e.target.value)}
                      className="filter-select"
                      style={{ border: homeSelectedSubject ? '2px solid #10b981' : '2px solid #dc2626' }}
                    >
                      <option value="">Select Subject *</option>
                      {homeSubjectOptions.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {!homeSelectedSubject && (
                    <div className="subject-warning" style={{
                      backgroundColor: '#fff3cd',
                      border: '2px solid #ffc107',
                      borderRadius: '8px',
                      padding: '15px 20px',
                      marginBottom: '20px',
                      maxWidth: '600px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ fontSize: '24px' }}>⚠️</span>
                      <p style={{ margin: 0, color: '#856404', fontWeight: '500', fontSize: '16px' }}>Please select a subject to mark attendance</p>
                    </div>
                  )}

                  {students.length > 0 ? (
                    <div className="table-container">
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Program</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students
                            .filter(student => {
                              const matchesProgram = !homeSelectedProgram ||
                                student.program?.id?.toString() === homeSelectedProgram;

                              const matchesSemester = !homeSelectedSemester ||
                                student.semester?.id?.toString() === homeSelectedSemester;

                              return matchesProgram && matchesSemester;
                            })
                            .map((student) => (
                              <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.rollNo}</td>
                                <td>{student.program?.name || 'N/A'}</td>
                                <td>
                                  <span className={`status-badge ${student.status === 1 ? 'active' : 'inactive'}`}>
                                    {student.status === 1 ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-students">No students found</p>
                  )}
                </>
              )}
            </div>
          )}

          {showTeacherForm && (
            <div className="teacher-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>All Teachers (Count: {teachers.length})</h3>
              </div>
              {success && <div className="success-message">{success}</div>}
              {teachers.length > 0 ? (
                <>
                  <div className="table-container">
                    <table className="teachers-table">
                      <thead>
                        <tr>
                          <th>Edit</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.slice((teachersPage - 1) * itemsPerPage, teachersPage * itemsPerPage).map((teacher) => (
                          <tr key={teacher.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={editingTeachers[teacher.id] || false}
                                onChange={(e) => handleTeacherCheckbox(teacher.id, e.target.checked)}
                                className="edit-checkbox"
                              />
                            </td>
                            <td>
                              {editingTeachers[teacher.id] ? (
                                <input
                                  type="text"
                                  value={editTeacherData[teacher.id]?.fullName || ''}
                                  onChange={(e) => handleEditTeacherChange(teacher.id, 'fullName', e.target.value)}
                                  className="edit-input"
                                />
                              ) : (
                                teacher.fullName
                              )}
                            </td>
                            <td>
                              {editingTeachers[teacher.id] ? (
                                <input
                                  type="email"
                                  value={editTeacherData[teacher.id]?.email || ''}
                                  onChange={(e) => handleEditTeacherChange(teacher.id, 'email', e.target.value)}
                                  className="edit-input"
                                />
                              ) : (
                                teacher?.email || 'N/A'
                              )}
                            </td>
                            <td>{teacher.contact || 'N/A'}</td>
                            <td>{teacher.address || 'N/A'}</td>
                            <td>
                              <span className={`status-badge ${teacher.status === 1 ? 'active' : 'inactive'}`}>
                                {teacher.status === 1 ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              {editingTeachers[teacher.id] && (
                                <button
                                  onClick={() => handleUpdateTeacher(teacher.id)}
                                  disabled={loading}
                                  className="update-btn"
                                >
                                  {loading ? 'Updating...' : 'Update'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={teachersPage} setCurrentPage={setTeachersPage} totalItems={teachers.length} itemsPerPage={itemsPerPage} />
                </>
              ) : (
                <p className="no-teachers">No teachers found</p>
              )}
            </div>
          )}

          {showUserForm && (
            <div className="user-section">
              {!showAddUserForm ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Users (Total: {users.length})</h3>
                    <button
                      onClick={() => {
                        setUserData({
                          username: "",
                          email: "",
                          password: "",
                          status: true,
                          role: "",
                          fullName: "",
                          address: "",
                          contact: "",
                          rollNo: "",
                          program: "",
                          semester: "",
                          faculty: "",
                          batch: ""
                        });
                        setError("");
                        setShowAddUserForm(true);
                      }}
                      className="submit-button"
                    >
                      Add New User
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {users.length > 0 ? (
                    <>
                      <div className="table-container">
                        <table className="users-table">
                          <thead>
                            <tr>
                              <th>Edit</th>
                              <th>Email</th>
                              <th>Username</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.filter(u => u.status).slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={editingUsers[user.id] || false}
                                    onChange={(e) => handleUserCheckbox(user.id, e.target.checked)}
                                    className="edit-checkbox"
                                  />
                                </td>
                                <td>
                                  {editingUsers[user.id] ? (
                                    <input
                                      type="email"
                                      value={editUserData[user.id]?.email || ''}
                                      onChange={(e) => handleEditUserChange(user.id, 'email', e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    user.email
                                  )}
                                </td>
                                <td>
                                  {editingUsers[user.id] ? (
                                    <input
                                      type="text"
                                      value={editUserData[user.id]?.username || ''}
                                      onChange={(e) => handleEditUserChange(user.id, 'username', e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    user.username
                                  )}
                                </td>
                                <td>
                                  {editingUsers[user.id] ? (
                                    <select
                                      value={editUserData[user.id]?.role || ''}
                                      onChange={(e) => handleEditUserChange(user.id, 'role', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Role</option>
                                      {roles.map((role) => (
                                        <option key={role.id} value={role.code}>
                                          {role.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    user.role?.name || 'N/A'
                                  )}
                                </td>
                                <td>
                                  <span className={`status-badge ${user.status ? 'active' : 'inactive'}`}>
                                    {user.status ? 'Active' : 'Blocked'}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    {editingUsers[user.id] && (
                                      <button
                                        onClick={() => handleUpdateUser(user.id)}
                                        disabled={loading}
                                        className="update-btn"
                                      >
                                        {loading ? 'Updating...' : 'Update'}
                                      </button>
                                    )}
                                    {user.status ? (
                                      <button
                                        onClick={() => handleBlockUser(user.id)}
                                        disabled={loading}
                                        className="delete-btn"
                                      >
                                        Block
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleUnblockUser(user.id)}
                                        disabled={loading}
                                        className="unblock-btn"
                                      >
                                        Unblock
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Previous
                        </button>
                        <span style={{ color: '#ffffff' }}>
                          Page {currentPage} of {Math.ceil(users.length / usersPerPage)}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(users.length / usersPerPage)))}
                          disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: currentPage === Math.ceil(users.length / usersPerPage) ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: currentPage === Math.ceil(users.length / usersPerPage) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="no-users">No users found</p>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add User Details</h3>
                    <button
                      onClick={() => setShowAddUserForm(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUserSubmit} className="user-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={userData.fullName}
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Username *"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Email *"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="password"
                        placeholder="Password *"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Address"
                        value={userData.address}
                        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Contact (10 digits) *"
                        value={userData.contact}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) {
                            setUserData({ ...userData, contact: val });
                          }
                        }}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={userData.role}
                        onChange={(e) => {
                          console.log('Role selected:', e.target.value);
                          setUserData({ ...userData, role: e.target.value });
                        }}
                        className="form-input"
                      >
                        <option value="">Select Role *</option>
                        {roles.filter(role => ['ADM', 'STD', 'TEA'].includes(role.code)).map((role) => (
                          <option key={role.id} value={role.code}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {userData.role === 'STD' && (
                      <>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Roll Number *"
                            value={userData.rollNo}
                            onChange={(e) => setUserData({ ...userData, rollNo: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <select
                            value={userData.program}
                            onChange={(e) => setUserData({ ...userData, program: e.target.value })}
                            className="form-input"
                          >
                            <option value="">Select Program *</option>
                            {programs.map((program) => (
                              <option key={program.id} value={program.id}>
                                {program.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <select
                            value={userData.semester}
                            onChange={(e) => setUserData({ ...userData, semester: e.target.value })}
                            className="form-input"
                          >
                            <option value="">Select Semester *</option>
                            {semesters.map((semester) => (
                              <option key={semester.id} value={semester.id}>
                                {semester.number}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <select
                            value={userData.faculty}
                            onChange={(e) => setUserData({ ...userData, faculty: e.target.value })}
                            className="form-input"
                          >
                            <option value="">Select Faculty *</option>
                            {faculties.map((faculty) => (
                              <option key={faculty.id} value={faculty.id}>
                                {faculty.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <select
                            value={userData.batch}
                            onChange={(e) => setUserData({ ...userData, batch: e.target.value })}
                            className="form-input"
                            required
                          >
                            <option value="">Select Batch *</option>
                            {batches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Adding..." : "Add User"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {showStudentForm && (
            <div className="student-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>All Students (Count: {students.length})</h3>
                <button
                  onClick={() => setIsPromoting(true)}
                  className="submit-button"
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  Bulk Promote Students
                </button>
              </div>
              {isPromoting && (
                <div className="form-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                  <h4>Bulk Promote Students</h4>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <select
                      value={promotionData.programId}
                      onChange={(e) => setPromotionData({ ...promotionData, programId: e.target.value })}
                      className="filter-select"
                    >
                      <option value="">Select Program</option>
                      {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select
                      value={promotionData.currentSemesterId}
                      onChange={(e) => setPromotionData({ ...promotionData, currentSemesterId: e.target.value })}
                      className="filter-select"
                    >
                      <option value="">Current Semester</option>
                      {semesters.map(s => <option key={s.id} value={s.id}>{s.number}</option>)}
                    </select>
                    <select
                      value={promotionData.targetSemesterId}
                      onChange={(e) => setPromotionData({ ...promotionData, targetSemesterId: e.target.value })}
                      className="filter-select"
                    >
                      <option value="">Target Semester</option>
                      {semesters.map(s => <option key={s.id} value={s.id}>{s.number}</option>)}
                    </select>
                    <button
                      onClick={handleBulkPromotion}
                      disabled={loading || !promotionData.programId || !promotionData.currentSemesterId || !promotionData.targetSemesterId}
                      className="submit-button"
                    >
                      {loading ? 'Promoting...' : 'Promote Now'}
                    </button>
                    <button
                      onClick={() => setIsPromoting(false)}
                      className="logout-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {success && <div className="success-message">{success}</div>}
              {error && <div className="error-message">{error}</div>}
              <div className="table-container">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Edit</th>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>Status</th>
                      <th>Program</th>
                      <th>Semester</th>
                      <th>Batch</th>
                      <th>Address</th>
                      <th>Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.slice((studentsPage - 1) * itemsPerPage, studentsPage * itemsPerPage).map((student) => (
                        <tr key={student.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={editingStudents[student.id] || false}
                              onChange={(e) => handleStudentCheckbox(student.id, e.target.checked)}
                              className="edit-checkbox"
                            />
                          </td>
                          <td>
                            {editingStudents[student.id] ? (
                              <input
                                type="text"
                                value={editStudentData[student.id]?.name || ''}
                                onChange={(e) => handleEditStudentChange(student.id, 'name', e.target.value)}
                                className="edit-input"
                              />
                            ) : (
                              student.name || 'N/A'
                            )}
                          </td>
                          <td>
                            {editingStudents[student.id] ? (
                              <input
                                type="text"
                                value={editStudentData[student.id]?.rollNo || ''}
                                onChange={(e) => handleEditStudentChange(student.id, 'rollNo', e.target.value)}
                                className="edit-input"
                              />
                            ) : (
                              student.rollNo || 'N/A'
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${student.status === 1 ? 'active' : 'inactive'}`}>
                              {student.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {editingStudents[student.id] ? (
                              <select
                                value={editStudentData[student.id]?.program || ''}
                                onChange={(e) => handleEditStudentChange(student.id, 'program', e.target.value)}
                                className="edit-select"
                              >
                                <option value="">Select Program</option>
                                {programs.map((program) => (
                                  <option key={program.id} value={program.id}>
                                    {program.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              student.program?.name || 'N/A'
                            )}
                          </td>
                          <td>
                            {editingStudents[student.id] ? (
                              <select
                                value={editStudentData[student.id]?.semester || ''}
                                onChange={(e) => handleEditStudentChange(student.id, 'semester', e.target.value)}
                                className="edit-select"
                              >
                                <option value="">Select Semester</option>
                                {semesters.map((semester) => (
                                  <option key={semester.id} value={semester.id}>
                                    {semester.number}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              student.semester?.number || 'N/A'
                            )}
                          </td>
                          <td>{student.address || 'N/A'}</td>
                          <td>
                            {editingStudents[student.id] ? (
                              <select
                                value={editStudentData[student.id]?.batch || ''}
                                onChange={(e) => handleEditStudentChange(student.id, 'batch', e.target.value)}
                                className="edit-select"
                              >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                  <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              student.batch?.name || 'N/A'
                            )}
                          </td>
                          <td>{student.contact || 'N/A'}</td>
                          <td>
                            {editingStudents[student.id] && (
                              <button
                                onClick={() => handleUpdateStudent(student.id)}
                                disabled={loading}
                                className="update-btn"
                              >
                                {loading ? 'Updating...' : 'Update'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                          {loading ? 'Loading students...' : 'No students found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {students.length > 0 && <Pagination currentPage={studentsPage} setCurrentPage={setStudentsPage} totalItems={students.length} itemsPerPage={itemsPerPage} />}
            </div>
          )}

          {showAttendance && !showReport && (
            <div className="attendance-section">
              {/* Messages Display */}
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {/* Attendance Dashboard */}
              <div className="attendance-dashboard">
                <h3>Attendance Dashboard</h3>

                <div className="dashboard-controls">
                  <div className="date-picker-container">
                    <label>Select Date:</label>
                    <input
                      type="date"
                      value={attendanceDashboardMode === 'view' ? viewAttendanceDate : attendanceDashboardDate}
                      onChange={(e) => {
                        if (attendanceDashboardMode === 'view') {
                          setViewAttendanceDate(e.target.value);
                        } else {
                          setAttendanceDashboardDate(e.target.value);
                        }
                      }}
                      min={attendanceDashboardMode === 'mark' ? new Date().toISOString().split('T')[0] : undefined}
                      max={attendanceDashboardMode === 'mark' ? new Date().toISOString().split('T')[0] : undefined}
                      className="date-picker"
                    />
                  </div>

                  <div className="dashboard-buttons">
                    <button
                      onClick={() => setAttendanceDashboardMode('view')}
                      className={`dashboard-mode-btn ${attendanceDashboardMode === 'view' ? 'active' : ''}`}
                    >
                      View Attendance
                    </button>
                    {(isTeacher || isAdmin) && (
                      <button
                        onClick={() => setAttendanceDashboardMode('mark')}
                        className={`dashboard-mode-btn ${attendanceDashboardMode === 'mark' ? 'active' : ''}`}
                      >
                        Mark Attendance
                      </button>
                    )}
                  </div>
                </div>

                {attendanceDashboardMode === 'view' && (
                  <div className="view-attendance-section">
                    <h4>View Attendance for {viewAttendanceDate}</h4>
                    <div className="filter-container">
                      <select
                        value={dashboardProgram}
                        onChange={(e) => setDashboardProgram(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All Programs</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={dashboardSemester}
                        onChange={(e) => setDashboardSemester(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All Semesters</option>
                        {semesters.map((semester) => (
                          <option key={semester.id} value={semester.id}>
                            {semester.number}
                          </option>
                        ))}
                      </select>

                      <select
                        value={dashboardSubject}
                        onChange={(e) => setDashboardSubject(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All Subjects</option>
                        {visibleSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {attendance.filter(record =>
                      record.date === viewAttendanceDate &&
                      (!dashboardProgram || record.student?.program?.id?.toString() === dashboardProgram) &&
                      (!dashboardSemester || record.student?.semester?.id?.toString() === dashboardSemester) &&
                      (!dashboardSubject || record.subject?.id?.toString() === dashboardSubject)
                    ).length > 0 ? (
                      (() => {
                        const filtered = attendance.filter(record =>
                          record.date === viewAttendanceDate &&
                          (!dashboardProgram || record.student?.program?.id?.toString() === dashboardProgram) &&
                          (!dashboardSemester || record.student?.semester?.id?.toString() === dashboardSemester) &&
                          (!dashboardSubject || record.subject?.id?.toString() === dashboardSubject)
                        );
                        const summary = computeAttendanceSummary(filtered);
                        return (
                          <>
                            <div className="table-container">
                              <table className="attendance-table">
                                <thead>
                                  <tr>
                                    {isTeacher && <th>Edit</th>}
                                    <th>Student Name</th>
                                    <th>Roll No</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    {isTeacher && <th>Action</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {filtered.map((record) => (
                                    <tr key={record.id}>
                                      {isTeacher && (
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={editingAttendance[record.id] || false}
                                            onChange={(e) => handleAttendanceCheckbox(record.id, e.target.checked)}
                                            className="edit-checkbox"
                                          />
                                        </td>
                                      )}
                                      <td>{record.student?.name || 'N/A'}</td>
                                      <td>{record.student?.rollNo || 'N/A'}</td>
                                      <td>{record.subject?.name || 'N/A'}</td>
                                      <td>
                                        {editingAttendance[record.id] && isTeacher ? (
                                          <select
                                            value={editAttendanceData[record.id]?.status || ''}
                                            onChange={(e) => handleEditAttendanceChange(record.id, 'status', e.target.value)}
                                            className="edit-select"
                                          >
                                            <option value="">Select Status</option>
                                            <option value="P">Present</option>
                                            <option value="A">Absent</option>
                                            <option value="L">Leave</option>
                                          </select>
                                        ) : (
                                          <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                            {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                          </span>
                                        )}
                                      </td>
                                      {isTeacher && (
                                        <td>
                                          {editingAttendance[record.id] && (
                                            <button
                                              onClick={() => handleUpdateAttendance(record.id)}
                                              disabled={loading}
                                              className="update-btn"
                                            >
                                              {loading ? 'Updating...' : 'Update'}
                                            </button>
                                          )}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* summary table showing students by status */}
                            <div className="summary-container">
                              <h5>Attendance Summary</h5>
                              <table className="summary-table">
                                <thead>
                                  <tr>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Leave</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {summary.P.map(rec => (
                                        <div key={rec.id}>{rec.student?.name || 'N/A'}</div>
                                      ))}
                                    </td>
                                    <td>
                                      {summary.A.map(rec => (
                                        <div key={rec.id}>{rec.student?.name || 'N/A'}</div>
                                      ))}
                                    </td>
                                    <td>
                                      {summary.L.map(rec => (
                                        <div key={rec.id}>{rec.student?.name || 'N/A'}</div>
                                      ))}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <div className="table-container">
                        <table className="attendance-table">
                          <thead>
                            <tr>
                              {isTeacher && <th>Edit</th>}
                              <th>Student Name</th>
                              <th>Roll No</th>
                              <th>Subject</th>
                              <th>Status</th>
                              {isTeacher && <th>Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {attendance
                              .filter(record =>
                                record.date === viewAttendanceDate &&
                                (!dashboardProgram || record.student?.program?.id?.toString() === dashboardProgram) &&
                                (!dashboardSemester || record.student?.semester?.id?.toString() === dashboardSemester) &&
                                (!dashboardSubject || record.subject?.id?.toString() === dashboardSubject)
                              )
                              .map((record) => (
                                <tr key={record.id}>
                                  {isTeacher && (
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={editingAttendance[record.id] || false}
                                        onChange={(e) => handleAttendanceCheckbox(record.id, e.target.checked)}
                                        className="edit-checkbox"
                                      />
                                    </td>
                                  )}
                                  <td>{record.student?.name || 'N/A'}</td>
                                  <td>{record.student?.rollNo || 'N/A'}</td>
                                  <td>{record.subject?.name || 'N/A'}</td>
                                  <td>
                                    {editingAttendance[record.id] && isTeacher ? (
                                      <select
                                        value={editAttendanceData[record.id]?.status || ''}
                                        onChange={(e) => handleEditAttendanceChange(record.id, 'status', e.target.value)}
                                        className="edit-select"
                                      >
                                        <option value="">Select Status</option>
                                        <option value="P">Present</option>
                                        <option value="A">Absent</option>
                                        <option value="L">Leave</option>
                                      </select>
                                    ) : (
                                      <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                        {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                      </span>
                                    )}
                                  </td>
                                  {isTeacher && (
                                    <td>
                                      {editingAttendance[record.id] && (
                                        <button
                                          onClick={() => handleUpdateAttendance(record.id)}
                                          disabled={loading}
                                          className="update-btn"
                                        >
                                          {loading ? 'Updating...' : 'Update'}
                                        </button>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    )}
                    <p className="no-attendance">No attendance records found for {viewAttendanceDate}</p>
                  </div>
                )}

                {attendanceDashboardMode === 'mark' && (isTeacher || isAdmin) && (
                  <div className="mark-attendance-section">
                    <h4>Mark Attendance for {attendanceDashboardDate}</h4>
                    <div className="filter-container">
                      <div className="filter-group">
                        <label className="filter-label">Program</label>
                        <select
                          value={markAttendanceProgram}
                          onChange={(e) => setMarkAttendanceProgram(e.target.value)}
                          className="filter-select"
                        >
                          <option value="">Select Program</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                              {program.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="filter-group">
                        <label className="filter-label">Semester</label>
                        <select
                          value={markAttendanceSemester}
                          onChange={(e) => {
                            setMarkAttendanceSemester(e.target.value);
                            if (!e.target.value) {
                              setMarkAttendanceSubject("");
                            }
                          }}
                          className="filter-select"
                        >
                          <option value="">Select Semester</option>
                          {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                              {semester.number}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="filter-group">
                        <label className="filter-label required">Subject</label>
                        <select
                          value={markAttendanceSubject}
                          onChange={(e) => setMarkAttendanceSubject(e.target.value)}
                          className="filter-select"
                          style={{ border: markAttendanceSubject ? '2px solid #10b981' : '2px solid #dc2626' }}
                          disabled={!markAttendanceSemester}
                        >
                          <option value="">Select Subject</option>
                          {(() => {
                            // Get IDs of subjects assigned to this teacher via subject.teacher_id
                            const myAssignedSubjectIds = (isTeacher && !isAdmin)
                              ? new Set(
                                subjects
                                  .filter((s) => s.teacher?.id === currentTeacher?.id)
                                  .map((s) => String(s.id))
                              )
                              : null; // null = show all (admin)

                            return subjects
                              .filter((subject) => {
                                // 1. If teacher: only show their assigned subjects
                                if (myAssignedSubjectIds && !myAssignedSubjectIds.has(String(subject.id))) {
                                  return false;
                                }
                                // 2. Filter by selected semester
                                if (markAttendanceSemester && subject.semester?.id?.toString() !== markAttendanceSemester) {
                                  return false;
                                }
                                // 3. Filter by selected program (subject.program?.id)
                                if (markAttendanceProgram && subject.program?.id?.toString() !== markAttendanceProgram) {
                                  return false;
                                }
                                return true;
                              })
                              .map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                  {subject.name} ({subject.code})
                                </option>
                              ));
                          })()}
                        </select>
                      </div>
                    </div>

                    {!markAttendanceSemester && (
                      <div className="subject-warning-toast">
                        <span className="warning-icon">⚠️</span>
                        <span>Please select semester first before selecting subject</span>
                      </div>
                    )}

                    {markAttendanceSemester && !markAttendanceSubject && (
                      <div className="subject-warning-toast">
                        <span className="warning-icon">⚠️</span>
                        <span>Please select a subject to mark attendance</span>
                      </div>
                    )}

                    {!markAttendanceProgram || !markAttendanceSemester ? (
                      <div className="filter-requirement-message">
                        <p>Please select both <strong>Program</strong> and <strong>Semester</strong> to view students</p>
                      </div>
                    ) : (
                      <>
                        {students.filter(s =>
                          s.status !== 0 &&
                          s.program?.id?.toString() === markAttendanceProgram &&
                          s.semester?.id?.toString() === markAttendanceSemester
                        ).length > 0 ? (
                          <div className="table-container">
                            <table className="students-table">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Roll No</th>
                                  <th>Program</th>
                                  <th>Semester</th>
                                  <th>Mark Attendance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students
                                  .filter(s =>
                                    s.status !== 0 &&
                                    s.program?.id?.toString() === markAttendanceProgram &&
                                    s.semester?.id?.toString() === markAttendanceSemester
                                  )
                                  .map((student) => (
                                    <tr key={student.id}>
                                      <td>{student.name}</td>
                                      <td>{student.rollNo}</td>
                                      <td>{student.program?.name || 'N/A'}</td>
                                      <td>{student.semester?.number || 'N/A'}</td>
                                      <td>
                                        {isAttendanceAlreadyMarked(student.id, markAttendanceSubject, attendanceDashboardDate) ? (
                                          <div className="attendance-marked-status">
                                            <span className="marked-badge">✓ Already Marked</span>
                                            <p className="edit-instruction">Go to View Attendance to update</p>
                                          </div>
                                        ) : (
                                          <div className="attendance-buttons">
                                            <button
                                              type="button"
                                              onClick={() => markAttendance(student.id, 'present')}
                                              disabled={!markAttendanceSubject || attendanceLoading[student.id]}
                                              className="attendance-btn present-btn"
                                              title={!markAttendanceSubject ? "Please select a subject first" : ""}
                                            >
                                              Present
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => markAttendance(student.id, 'absent')}
                                              disabled={!markAttendanceSubject || attendanceLoading[student.id]}
                                              className="attendance-btn absent-btn"
                                              title={!markAttendanceSubject ? "Please select a subject first" : ""}
                                            >
                                              Absent
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => markAttendance(student.id, 'leave')}
                                              disabled={!markAttendanceSubject || attendanceLoading[student.id]}
                                              className="attendance-btn leave-btn"
                                              title={!markAttendanceSubject ? "Please select a subject first" : ""}
                                            >
                                              Leave
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="no-attendance">No students found for the selected program and semester</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {isAdmin && !isStudent && !isTeacher && (
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Attendance Records (Admin View)</h3>
                    <button
                      onClick={() => {
                        setIsAddingAttendance(true);
                        fetchStudents();
                        fetchSubjects();
                      }}
                      className="submit-button"
                    >
                      Add Attendance
                    </button>
                  </div>

                  <div className="filter-container">
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Programs</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Semesters</option>
                      {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search by student name, subject, or date..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  {attendance.length > 0 ? (
                    <div className="table-container">
                      <table className="attendance-table">
                        <thead>
                          <tr>
                            <th>Edit</th>
                            <th>Student Name</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance
                            .filter(record => {
                              const matchesSearch =
                                record.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                record.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                record.date?.toString().includes(searchTerm);

                              const matchesProgram = !selectedProgram ||
                                record.student?.program?.id?.toString() === selectedProgram;

                              const matchesSemester = !selectedSemester ||
                                record.student?.semester?.id?.toString() === selectedSemester;

                              return matchesSearch && matchesProgram && matchesSemester;
                            })
                            .map((record) => (
                              <tr key={record.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={editingAttendance[record.id] || false}
                                    onChange={(e) => handleAttendanceCheckbox(record.id, e.target.checked)}
                                    className="edit-checkbox"
                                  />
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <select
                                      value={editAttendanceData[record.id]?.student || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'student', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Student</option>
                                      {students.map((student) => (
                                        <option key={student.id} value={student.id}>
                                          {student.name} ({student.rollNo})
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    record.student?.name || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <select
                                      value={editAttendanceData[record.id]?.subject || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'subject', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Subject</option>
                                      {visibleSubjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                          {subject.name} ({subject.code})
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    record.subject?.name || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <input
                                      type="date"
                                      value={editAttendanceData[record.id]?.date || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'date', e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    record.date || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <select
                                      value={editAttendanceData[record.id]?.status || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'status', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Status</option>
                                      <option value="P">Present</option>
                                      <option value="A">Absent</option>
                                      <option value="L">Leave</option>
                                    </select>
                                  ) : (
                                    <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                      {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] && (
                                    <button
                                      onClick={() => handleUpdateAttendance(record.id)}
                                      disabled={loading}
                                      className="update-btn"
                                    >
                                      {loading ? 'Updating...' : 'Update'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-attendance">No attendance records found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {showProgramForm && (
            <div className="program-section">
              {!isAddingProgram ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Programs (Count: {programs.length})</h3>
                    <button
                      onClick={() => setIsAddingProgram(true)}
                      className="submit-button"
                    >
                      Add New Program
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {programs.length > 0 && (
                    <>
                      <div className="table-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <table className="students-table">
                          <thead>
                            <tr>
                              <th style={{ width: '10%' }}>Edit</th>
                              <th style={{ width: '15%' }}>ID</th>
                              <th style={{ width: '50%' }}>Name</th>
                              <th style={{ width: '25%' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {programs.slice((programsPage - 1) * itemsPerPage, programsPage * itemsPerPage).map((program) => (
                              <tr key={program.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={editingPrograms[program.id] || false}
                                    onChange={(e) => handleProgramCheckbox(program.id, e.target.checked)}
                                    className="edit-checkbox"
                                  />
                                </td>
                                <td>{program.id}</td>
                                <td>
                                  {editingPrograms[program.id] ? (
                                    <input
                                      type="text"
                                      value={editProgramData[program.id]?.name || ''}
                                      onChange={(e) => handleEditProgramChange(program.id, e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    program.name
                                  )}
                                </td>
                                <td>
                                  {editingPrograms[program.id] && (
                                    <button
                                      onClick={() => handleUpdateProgram(program.id)}
                                      disabled={loading}
                                      className="update-btn"
                                    >
                                      {loading ? 'Updating...' : 'Update'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination currentPage={programsPage} setCurrentPage={setProgramsPage} totalItems={programs.length} itemsPerPage={itemsPerPage} />
                    </>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Program Details</h3>
                    <button
                      onClick={() => setIsAddingProgram(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleProgramSubmit} className="program-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Program Name"
                        value={programData.name}
                        onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Adding..." : "Add Program"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {showSubjects && (
            <div className="subjects-section">
              {!isAddingSubject ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Subjects (Count: {visibleSubjects.length})</h3>
                    {isAdmin && (
                      <button
                        onClick={() => setIsAddingSubject(true)}
                        className="submit-button"
                      >
                        Add New Subject
                      </button>
                    )}
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {visibleSubjects.length > 0 ? (
                    <>
                      <div className="table-container">
                        <table className="subjects-table">
                          <thead>
                            <tr>
                              {isAdmin && <th>Edit</th>}
                              <th>Subject Name</th>
                              <th>Subject Code</th>
                              <th>Semester</th>
                              <th>Program</th>
                              <th>Teacher</th>
                              {isAdmin && <th>Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {visibleSubjects.slice((subjectsPage - 1) * itemsPerPage, subjectsPage * itemsPerPage).map((subject) => (
                              <tr key={subject.id}>
                                {isAdmin && (
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={editingSubjects[subject.id] || false}
                                      onChange={(e) => handleSubjectCheckbox(subject.id, e.target.checked)}
                                      className="edit-checkbox"
                                    />
                                  </td>
                                )}
                                <td>
                                  {isAdmin && editingSubjects[subject.id] ? (
                                    <input
                                      type="text"
                                      value={editSubjectData[subject.id]?.name || ''}
                                      onChange={(e) => handleEditSubjectChange(subject.id, 'name', e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    subject.name
                                  )}
                                </td>
                                <td>
                                  {isAdmin && editingSubjects[subject.id] ? (
                                    <input
                                      type="text"
                                      value={editSubjectData[subject.id]?.code || ''}
                                      onChange={(e) => handleEditSubjectChange(subject.id, 'code', e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    subject.code
                                  )}
                                </td>
                                <td>
                                  {isAdmin && editingSubjects[subject.id] ? (
                                    <select
                                      value={editSubjectData[subject.id]?.semester || ''}
                                      onChange={(e) => handleEditSubjectChange(subject.id, 'semester', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Semester</option>
                                      {semesters.map((semester) => (
                                        <option key={semester.id} value={semester.id}>
                                          {semester.number}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    subject.semester?.number || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {isAdmin && editingSubjects[subject.id] ? (
                                    <select
                                      value={editSubjectData[subject.id]?.program || ''}
                                      onChange={(e) => handleEditSubjectChange(subject.id, 'program', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Program</option>
                                      {programs.map((program) => (
                                        <option key={program.id} value={program.id}>
                                          {program.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    subject.program?.name || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {isAdmin && editingSubjects[subject.id] ? (
                                    <select
                                      value={editSubjectData[subject.id]?.teacher || ''}
                                      onChange={(e) => handleEditSubjectChange(subject.id, 'teacher', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Teacher</option>
                                      {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                          {teacher.fullName}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    subject.teacher?.fullName || 'N/A'
                                  )}
                                </td>
                                {isAdmin && (
                                  <td>
                                    {editingSubjects[subject.id] && (
                                      <button
                                        onClick={() => handleUpdateSubject(subject.id)}
                                        disabled={loading}
                                        className="update-btn"
                                      >
                                        {loading ? 'Updating...' : 'Update'}
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination currentPage={subjectsPage} setCurrentPage={setSubjectsPage} totalItems={visibleSubjects.length} itemsPerPage={itemsPerPage} />
                    </>
                  ) : (
                    <p className="no-subjects">No subjects found</p>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Subject Details</h3>
                    <button
                      onClick={() => setIsAddingSubject(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleSubjectSubmit} className="subject-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subjectData.name}
                        onChange={(e) => setSubjectData({ ...subjectData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Subject Code"
                        value={subjectData.code}
                        onChange={(e) => setSubjectData({ ...subjectData, code: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={subjectData.program}
                        onChange={(e) => setSubjectData({ ...subjectData, program: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        value={subjectData.semester}
                        onChange={(e) => setSubjectData({ ...subjectData, semester: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((semester) => (
                          <option key={semester.id} value={semester.id}>
                            {semester.number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        value={subjectData.teacher}
                        onChange={(e) => setSubjectData({ ...subjectData, teacher: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.fullName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Adding..." : "Add Subject"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {showCourseAllocation && (
            <div className="allocation-section">
              {!isAddingAllocation ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Course Allocations (Count: {allocations.length})</h3>
                    <button
                      onClick={() => setIsAddingAllocation(true)}
                      className="submit-button"
                    >
                      Add New Allocation
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}

                  <div className="filter-container">
                    <select
                      value={selectedAllocationFaculty}
                      onChange={(e) => setSelectedAllocationFaculty(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Faculties</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedAllocationTeacher}
                      onChange={(e) => setSelectedAllocationTeacher(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Teachers</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {allocations.length > 0 ? (
                    <>
                      <div className="table-container">
                        <table className="allocations-table" style={{ backgroundColor: 'white' }}>
                          <thead style={{ backgroundColor: '#007bff' }}>
                            <tr>
                              <th style={{ color: 'white' }}>Edit</th>
                              <th style={{ color: 'white' }}>Faculty</th>
                              <th style={{ color: 'white' }}>Subject</th>
                              <th style={{ color: 'white' }}>Semester</th>
                              <th style={{ color: 'white' }}>Teacher</th>
                              <th style={{ color: 'white' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody style={{ backgroundColor: 'white' }}>
                            {allocations
                              .filter(allocation => {
                                const matchesFaculty = !selectedAllocationFaculty ||
                                  allocation.faculty?.id?.toString() === selectedAllocationFaculty;

                                const matchesTeacher = !selectedAllocationTeacher ||
                                  allocation.teacher?.id?.toString() === selectedAllocationTeacher;

                                return matchesFaculty && matchesTeacher;
                              })
                              .slice((allocationsPage - 1) * itemsPerPage, allocationsPage * itemsPerPage)
                              .map((allocation) => (
                                <tr key={allocation.id}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={editingAllocations[allocation.id] || false}
                                      onChange={(e) => handleAllocationCheckbox(allocation.id, e.target.checked)}
                                      className="edit-checkbox"
                                    />
                                  </td>
                                  <td>
                                    {editingAllocations[allocation.id] ? (
                                      <select
                                        value={editAllocationData[allocation.id]?.faculty || ''}
                                        onChange={(e) => handleEditAllocationChange(allocation.id, 'faculty', e.target.value)}
                                        className="edit-select"
                                      >
                                        <option value="">Select Faculty</option>
                                        {faculties.map((faculty) => (
                                          <option key={faculty.id} value={faculty.id}>
                                            {faculty.name}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      allocation.faculty?.name || 'N/A'
                                    )}
                                  </td>
                                  <td>
                                    {editingAllocations[allocation.id] ? (
                                      <select
                                        value={editAllocationData[allocation.id]?.subject || ''}
                                        onChange={(e) => handleEditAllocationChange(allocation.id, 'subject', e.target.value)}
                                        className="edit-select"
                                      >
                                        <option value="">Select Subject</option>
                                        {visibleSubjects.map((subject) => (
                                          <option key={subject.id} value={subject.id}>
                                            {subject.name} ({subject.code})
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      allocation.subject?.name || 'N/A'
                                    )}
                                  </td>
                                  <td>
                                    {editingAllocations[allocation.id] ? (
                                      <select
                                        value={editAllocationData[allocation.id]?.semester || ''}
                                        onChange={(e) => handleEditAllocationChange(allocation.id, 'semester', e.target.value)}
                                        className="edit-select"
                                      >
                                        <option value="">Select Semester</option>
                                        {semesters.map((semester) => (
                                          <option key={semester.id} value={semester.id}>
                                            {semester.number}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      allocation.semester?.number || 'N/A'
                                    )}
                                  </td>
                                  <td>
                                    {editingAllocations[allocation.id] ? (
                                      <select
                                        value={editAllocationData[allocation.id]?.teacher || ''}
                                        onChange={(e) => handleEditAllocationChange(allocation.id, 'teacher', e.target.value)}
                                        className="edit-select"
                                      >
                                        <option value="">Select Teacher</option>
                                        {teachers.map((teacher) => (
                                          <option key={teacher.id} value={teacher.id}>
                                            {teacher.fullName}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      allocation.teacher?.fullName || 'N/A'
                                    )}
                                  </td>
                                  <td>
                                    {editingAllocations[allocation.id] && (
                                      <button
                                        onClick={() => handleUpdateAllocation(allocation.id)}
                                        disabled={loading}
                                        className="update-btn"
                                      >
                                        {loading ? 'Updating...' : 'Update'}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                      <Pagination currentPage={allocationsPage} setCurrentPage={setAllocationsPage} totalItems={allocations.filter(allocation => {
                        const matchesFaculty = !selectedAllocationFaculty || allocation.faculty?.id?.toString() === selectedAllocationFaculty;
                        const matchesTeacher = !selectedAllocationTeacher || allocation.teacher?.id?.toString() === selectedAllocationTeacher;
                        return matchesFaculty && matchesTeacher;
                      }).length} itemsPerPage={itemsPerPage} />
                    </>
                  ) : (
                    <p className="no-allocations">No course allocations found</p>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Allocate Course</h3>
                    <button
                      onClick={() => setIsAddingAllocation(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleCourseAllocationSubmit} className="allocation-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <select
                        value={allocationData.faculty}
                        onChange={(e) => setAllocationData({ ...allocationData, faculty: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map((faculty) => (
                          <option key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        value={allocationData.semester}
                        onChange={(e) => setAllocationData({ ...allocationData, semester: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((semester) => (
                          <option key={semester.id} value={semester.id}>
                            {semester.number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        value={allocationData.subject}
                        onChange={(e) => setAllocationData({ ...allocationData, subject: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Subject</option>
                        {visibleSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        value={allocationData.teacher}
                        onChange={(e) => setAllocationData({ ...allocationData, teacher: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.fullName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Allocating..." : "Allocate Course"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {showReport && (
            <div className="mark-attendance-section" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#ffffff' }}>Attendance Report</h3>

              {(() => {
                // 1. Calculate base filtered attendance (excluding blocked students)
                const allFilteredAttendance = attendance.filter(record => {
                  const matchesStatus = record.student?.status !== 0;
                  const matchesProgram = reportProgram ? record.student?.program?.id?.toString() === reportProgram : true;
                  const matchesSemester = reportSemester ? record.student?.semester?.id?.toString() === reportSemester : true;
                  const matchesSubject = reportSubject ? record.subject?.id?.toString() === reportSubject : true;
                  const matchesStudent = isStudent && currentStudent ? record.student?.id === currentStudent.id : true;
                  const matchesStartDate = reportStartDate ? record.date >= reportStartDate : true;
                  const matchesEndDate = reportEndDate ? record.date <= reportEndDate : true;
                  return matchesStatus && matchesProgram && matchesSemester && matchesSubject && matchesStudent && matchesStartDate && matchesEndDate;
                });

                // 2. Identify students in view (excluding blocked students)
                const studentsInView = students.filter(s =>
                  s.status !== 0 &&
                  (!reportProgram || s.program?.id?.toString() === reportProgram) &&
                  (!reportSemester || s.semester?.id?.toString() === reportSemester) &&
                  (!isStudent || (currentStudent && s.id === currentStudent.id))
                );

                // 3. Calculate metrics per student
                const markingsByStudent = {};
                allFilteredAttendance.forEach(record => {
                  const sId = record.student?.id;
                  if (!markingsByStudent[sId]) markingsByStudent[sId] = [];
                  markingsByStudent[sId].push(record);
                });

                const maxMarkings = Math.max(0, ...Object.values(markingsByStudent).map(m => m.length));

                const studentSummaries = studentsInView.map(student => {
                  const studentMarkings = markingsByStudent[student.id] || [];
                  const present = studentMarkings.filter(r => r.status === 'P').length;
                  const leave = studentMarkings.filter(r => r.status === 'L').length;
                  const absent = maxMarkings - present - leave;

                  return {
                    id: student.id,
                    name: student.name,
                    rollNo: student.rollNo,
                    present,
                    absent,
                    leave,
                    total: maxMarkings,
                    percentage: maxMarkings > 0 ? ((present / maxMarkings) * 100).toFixed(1) : 0
                  };
                });

                // 4. Overall totals for summary cards
                const presentCount = studentSummaries.reduce((sum, s) => sum + s.present, 0);
                const absentCount = studentSummaries.reduce((sum, s) => sum + s.absent, 0);
                const leaveCount = studentSummaries.reduce((sum, s) => sum + s.leave, 0);
                const totalCount = studentSummaries.reduce((sum, s) => sum + s.total, 0);

                const presentPct = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
                const absentPct = totalCount > 0 ? ((absentCount / totalCount) * 100).toFixed(1) : 0;
                const leavePct = totalCount > 0 ? (100 - parseFloat(presentPct) - parseFloat(absentPct)).toFixed(1) : 0;

                // 5. Detailed record lists (for the tables below)
                const displayRecords = allFilteredAttendance; // already filtered by date range above
                const presentRecords = displayRecords.filter(r => r.status === 'P');
                const absentRecords = displayRecords.filter(r => r.status === 'A');

                return (
                  <div className="report-header-section">
                    <div className="report-stats-grid">
                      <div className="report-stat-card" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' }}>
                        <span className="stat-icon">📚</span>
                        <span className="stat-value">{maxMarkings}</span>
                        <span className="stat-label">Classes Held</span>
                      </div>
                      <div className="report-stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <span className="stat-icon">✅</span>
                        <span className="stat-value">{presentCount}</span>
                        <span className="stat-label">Total Present</span>
                      </div>
                      <div className="report-stat-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
                        <span className="stat-icon">❌</span>
                        <span className="stat-value">{absentCount}</span>
                        <span className="stat-label">Total Absent</span>
                      </div>
                    </div>

                    <div className="report-main-grid">
                      <div className="report-filters-card">
                        <div className="report-filter-item">
                          <label>Program</label>
                          <select value={reportProgram} onChange={(e) => setReportProgram(e.target.value)} className="filter-select">
                            <option value="">Select Program</option>
                            {programs.map((program) => (<option key={program.id} value={program.id}>{program.name}</option>))}
                          </select>
                        </div>
                        <div className="report-filter-item">
                          <label>Semester</label>
                          <select value={reportSemester} onChange={(e) => setReportSemester(e.target.value)} className="filter-select">
                            <option value="">Select Semester</option>
                            {semesters.map((semester) => (<option key={semester.id} value={semester.id}>{semester.number}</option>))}
                          </select>
                        </div>
                        <div className="report-filter-item">
                          <label>Subject</label>
                          <select value={reportSubject} onChange={(e) => setReportSubject(e.target.value)} className="filter-select">
                            <option value="">Select Subject</option>
                            {visibleSubjects
                              .filter(s =>
                                (!reportProgram || s.program?.id?.toString() === reportProgram) &&
                                (!reportSemester || s.semester?.id?.toString() === reportSemester)
                              )
                              .map((subject) => (
                                <option key={subject.id} value={subject.id}>{subject.name} ({subject.code})</option>
                              ))}
                          </select>
                        </div>
                        <div className="report-filter-item">
                          <label>From Date</label>
                          <input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="filter-select" />
                        </div>
                        <div className="report-filter-item">
                          <label>To Date</label>
                          <input type="date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} className="filter-select" />
                        </div>
                        {!isStudent && (
                          <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button
                              onClick={generatePDF}
                              disabled={!reportProgram || !reportSemester || !reportSubject}
                              className="submit-button"
                              style={{
                                background: (!reportProgram || !reportSemester || !reportSubject) ? '#374151' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                minWidth: '180px'
                              }}
                            >
                              📄 Generate PDF Report
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="report-chart-card">
                        <h4 className="chart-title">Overall Attendance</h4>
                        {maxMarkings > 0 ? (
                          <>
                            <svg viewBox="0 0 200 200" style={{ width: '160px', height: '160px', marginBottom: '1.25rem' }}>
                              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
                              <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray={`${(presentPct / 100) * 502.654} 502.654`} transform="rotate(-90 100 100)" strokeLinecap="round" />
                              <circle cx="100" cy="100" r="80" fill="none" stroke="#dc2626" strokeWidth="20" strokeDasharray={`${(absentPct / 100) * 502.654} 502.654`} strokeDashoffset={`${-((presentPct / 100) * 502.654)}`} transform="rotate(-90 100 100)" strokeLinecap="round" />
                              <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray={`${(leavePct / 100) * 502.654} 502.654`} strokeDashoffset={`${-(((presentPct + absentPct) / 100) * 502.654)}`} transform="rotate(-90 100 100)" strokeLinecap="round" />
                              <text x="100" y="105" textAnchor="middle" fill="#ffffff" style={{ fontSize: '24px', fontWeight: 'bold' }}>{presentPct}%</text>
                            </svg>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', fontSize: '12px', color: '#cbd5e1' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></div>
                                  <span>Present</span>
                                </div>
                                <span style={{ fontWeight: '600', color: '#fff' }}>{presentPct}%</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#dc2626' }}></div>
                                  <span>Absent</span>
                                </div>
                                <span style={{ fontWeight: '600', color: '#fff' }}>{absentPct}%</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '2rem 0' }}>No data available for this range</div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      {!reportProgram || !reportSemester || !reportSubject ? (
                        <div className="filter-requirement-message">
                          <p>Please select <strong>Program</strong>, <strong>Semester</strong>, and <strong>Subject</strong> to generate report</p>
                        </div>
                      ) : (
                        <>
                          <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ color: '#ffffff', marginBottom: '1.5rem' }}>Student Attendance Summary</h4>
                            <div className="table-container" style={{ marginBottom: '2rem' }}>
                              <table className="students-table">
                                <thead>
                                  <tr>
                                    <th>Roll No</th>
                                    <th>Student Name</th>
                                    <th>Total Classes</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Leave</th>
                                    <th>Percentage</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {studentSummaries.map((summary) => (
                                    <tr key={summary.id}>
                                      <td>{summary.rollNo || 'N/A'}</td>
                                      <td>{summary.name || 'N/A'}</td>
                                      <td>{summary.total}</td>
                                      <td style={{ color: '#10b981', fontWeight: '600' }}>{summary.present}</td>
                                      <td style={{ color: '#dc2626', fontWeight: '600' }}>{summary.absent}</td>
                                      <td style={{ color: '#f59e0b', fontWeight: '600' }}>{summary.leave}</td>
                                      <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${summary.percentage}%`, height: '100%', background: parseFloat(summary.percentage) >= 75 ? '#10b981' : '#dc2626' }}></div>
                                          </div>
                                          <span style={{ fontSize: '12px', minWidth: '35px' }}>{summary.percentage}%</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <h4 style={{ color: '#ffffff', marginBottom: '1.5rem' }}>Detailed Attendance Records {reportStartDate && `for ${reportStartDate}`}</h4>
                            <div style={{ marginBottom: '2rem' }}>
                              <h5 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '16px' }}>Present Records ({presentRecords.length})</h5>
                              {presentRecords.length > 0 ? (
                                <div className="table-container">
                                  <table className="students-table">
                                    <thead>
                                      <tr>
                                        <th>Student Name</th>
                                        <th>Roll No</th>
                                        <th>Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {presentRecords.map((record) => (
                                        <tr key={record.id}>
                                          <td>{record.student?.name || 'N/A'}</td>
                                          <td>{record.student?.rollNo || 'N/A'}</td>
                                          <td>{record.date || 'N/A'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p style={{ color: '#cbd5e1', padding: '1rem' }}>No present records found</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {showFacultyForm && (
            <div className="faculty-section">
              {!isAddingFaculty ? (
                <>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Manage Faculties</h3>
                    <button onClick={() => setIsAddingFaculty(true)} className="submit-button">
                      Add New Faculty
                    </button>
                  </div>

                  {success && <div className="success-message">{success}</div>}
                  {error && <div className="error-message">{error}</div>}

                  {/* Faculty Dropdown */}
                  <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ color: '#cbd5e1', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      Select Faculty:
                    </label>
                    <select
                      value={selectedFacultyId}
                      onChange={(e) => {
                        setSelectedFacultyId(e.target.value);
                        setIsAddingProgram(false);
                        setProgramData({ name: '', facultyId: e.target.value });
                      }}
                      className="filter-select"
                      style={{ minWidth: '240px' }}
                    >
                      <option value="">-- Choose a Faculty --</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Programs section — visible only when a faculty is selected */}
                  {selectedFacultyId && (
                    <div style={{ marginBottom: '2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#ffffff', margin: 0 }}>
                          Programs — {faculties.find(f => String(f.id) === String(selectedFacultyId))?.name}
                        </h4>
                        {!isAddingProgram ? (
                          <button
                            className="submit-button"
                            style={{ backgroundColor: '#10b981' }}
                            onClick={() => {
                              setProgramData({ name: '', facultyId: selectedFacultyId });
                              setIsAddingProgram(true);
                            }}
                          >
                            + Create Program
                          </button>
                        ) : (
                          <button
                            className="logout-button"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => setIsAddingProgram(false)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Inline Create Program form */}
                      {isAddingProgram && (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              setLoading(true);
                              await api.post('/api/program', {
                                name: programData.name,
                                faculty: { id: parseInt(selectedFacultyId) }
                              });
                              setSuccess('Program created successfully!');
                              setProgramData({ name: '', facultyId: selectedFacultyId });
                              setIsAddingProgram(false);
                              fetchPrograms();
                              setTimeout(() => setSuccess(''), 3000);
                            } catch (err) {
                              setError(err.response?.data?.message || 'Failed to create program');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}
                        >
                          <input
                            type="text"
                            placeholder="Program Name"
                            value={programData.name}
                            onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
                            className="form-input"
                            required
                            style={{ flex: 1, minWidth: '200px' }}
                          />
                          <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Program'}
                          </button>
                        </form>
                      )}

                      {/* Programs list for selected faculty */}
                      {(() => {
                        const facultyPrograms = programs.filter(
                          (p) => String(p.faculty?.id) === String(selectedFacultyId)
                        );
                        return facultyPrograms.length > 0 ? (
                          <div className="table-container">
                            <table className="students-table">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Program Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {facultyPrograms.map((p, idx) => (
                                  <tr key={p.id}>
                                    <td>{idx + 1}</td>
                                    <td>{p.name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p style={{ color: '#94a3b8' }}>No programs found for this faculty.</p>
                        );
                      })()}
                    </div>
                  )}

                  {/* All Faculties editable table */}
                  {faculties.length > 0 && (
                    <>
                      <h4 style={{ color: '#ffffff', marginBottom: '0.75rem' }}>All Faculties</h4>
                      <div className="table-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <table className="students-table">
                          <thead>
                            <tr>
                              <th style={{ width: '10%' }}>Edit</th>
                              <th style={{ width: '15%' }}>ID</th>
                              <th style={{ width: '55%' }}>Name</th>
                              <th style={{ width: '20%' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {faculties.slice((facultiesPage - 1) * itemsPerPage, facultiesPage * itemsPerPage).map((faculty) => (
                              <tr key={faculty.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={editingFaculties[faculty.id] || false}
                                    onChange={(e) => handleFacultyCheckbox(faculty.id, e.target.checked)}
                                    className="edit-checkbox"
                                  />
                                </td>
                                <td>{faculty.id}</td>
                                <td>
                                  {editingFaculties[faculty.id] ? (
                                    <input
                                      type="text"
                                      value={editFacultyData[faculty.id]?.name || ''}
                                      onChange={(e) => handleEditFacultyChange(faculty.id, e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    faculty.name
                                  )}
                                </td>
                                <td>
                                  {editingFaculties[faculty.id] && (
                                    <button
                                      onClick={() => handleUpdateFaculty(faculty.id)}
                                      disabled={loading}
                                      className="update-btn"
                                    >
                                      {loading ? 'Updating...' : 'Update'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination currentPage={facultiesPage} setCurrentPage={setFacultiesPage} totalItems={faculties.length} itemsPerPage={itemsPerPage} />
                    </>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Faculty Details</h3>
                    <button
                      onClick={() => setIsAddingFaculty(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleFacultySubmit} className="faculty-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Faculty Name"
                        value={facultyData.name}
                        onChange={(e) => setFacultyData({ ...facultyData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Adding..." : "Add Faculty"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
          {showBatchForm && (
            <div className="batch-section">
              {!isAddingBatch ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Batches (Count: {batches.length})</h3>
                    <button
                      onClick={() => setIsAddingBatch(true)}
                      className="submit-button"
                    >
                      Add New Batch
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {batches.length > 0 && (
                    <>
                      <div className="table-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <table className="students-table">
                          <thead>
                            <tr>
                              <th style={{ width: '10%' }}>Edit</th>
                              <th style={{ width: '15%' }}>ID</th>
                              <th style={{ width: '50%' }}>Name</th>
                              <th style={{ width: '25%' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {batches.slice((batchesPage - 1) * itemsPerPage, batchesPage * itemsPerPage).map((batch) => (
                              <tr key={batch.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={editingBatches[batch.id] || false}
                                    onChange={(e) => handleBatchCheckbox(batch.id, e.target.checked)}
                                    className="edit-checkbox"
                                  />
                                </td>
                                <td>{batch.id}</td>
                                <td>
                                  {editingBatches[batch.id] ? (
                                    <input
                                      type="text"
                                      value={editBatchData[batch.id]?.name || ''}
                                      onChange={(e) => handleEditBatchChange(batch.id, e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    batch.name
                                  )}
                                </td>
                                <td>
                                  {editingBatches[batch.id] && (
                                    <button
                                      onClick={() => handleUpdateBatch(batch.id)}
                                      disabled={loading}
                                      className="update-btn"
                                    >
                                      {loading ? 'Updating...' : 'Update'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination currentPage={batchesPage} setCurrentPage={setBatchesPage} totalItems={batches.length} itemsPerPage={itemsPerPage} />
                    </>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Batch Details</h3>
                    <button
                      onClick={() => setIsAddingBatch(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleBatchSubmit} className="batch-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Batch Name"
                        value={batchData.name}
                        onChange={(e) => setBatchData({ ...batchData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Adding..." : "Add Batch"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
