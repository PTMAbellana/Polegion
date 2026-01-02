import { STUDENT_ROUTES, TEACHER_ROUTES } from "./routes";
import { FaHome, FaUser, FaChalkboardTeacher, FaDungeon, FaMedal, FaUserAstronaut, FaFortAwesome, FaShapes, FaRegFileAlt, FaBrain, FaBook, FaChartLine, FaRobot } from 'react-icons/fa';

// Navigation items for teachers (RESTRICTED IN RESEARCH BUILD)
export const teacherNavItems = [
    { path: '/teacher/restricted', icon: FaChalkboardTeacher, label: 'Teacher Access', title: 'Teacher Features Restricted' },
];

// Navigation items for students (Research Focus: Adaptive Learning)
export const studentNavItems = [
    { path: STUDENT_ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
    { path: STUDENT_ROUTES.WORLD_MAP, icon: FaFortAwesome, label: 'World Map', title: 'World Map' },
    { path: STUDENT_ROUTES.ADAPTIVE_LEARNING, icon: FaRobot, label: 'AI Adaptive', title: 'Adaptive Learning AI' },
    { path: STUDENT_ROUTES.PRACTICE, icon: FaBrain, label: 'Practice', title: 'Practice' },
    { path: STUDENT_ROUTES.PLAYGROUND, icon: FaShapes, label: 'Playground', title: 'Playground' },
    { path: STUDENT_ROUTES.PROFILE, icon: FaUserAstronaut, label: 'Profile', title: 'Profile' },
];