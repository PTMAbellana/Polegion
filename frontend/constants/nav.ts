import { STUDENT_ROUTES, TEACHER_ROUTES } from "./routes";
import { FaHome, FaUser, FaChalkboardTeacher, FaDungeon, FaMedal, FaUserAstronaut, FaFortAwesome, FaShapes, FaRegFileAlt, FaBrain, FaBook, FaChartLine } from 'react-icons/fa';

// temporary paths
// Navigation items for teachers
export const teacherNavItems = [
    { path: TEACHER_ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
    { path: TEACHER_ROUTES.VIRTUAL_ROOMS, icon: FaChalkboardTeacher, label: 'Virtual Rooms', title: 'Virtual Rooms' },
    { path: TEACHER_ROUTES.CASTLE_CONTENT, icon: FaBook, label: 'Castle Handbook', title: 'Castle Content Handbook' },
    { path: TEACHER_ROUTES.RECORDS, icon: FaRegFileAlt, label: 'Records', title: 'Records' },
    { path: TEACHER_ROUTES.PROFILE, icon: FaUser, label: 'Profile', title: 'Profile' },
];

// Navigation items for students
export const studentNavItems = [
    { path: STUDENT_ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
    { path: STUDENT_ROUTES.JOINED_ROOMS, icon: FaDungeon, label: 'Joined Rooms', title: 'Joined Rooms' },
    { path: STUDENT_ROUTES.WORLD_MAP, icon: FaFortAwesome, label: 'World Map', title: 'World Map' },
    { path: STUDENT_ROUTES.PRACTICE, icon: FaBrain, label: 'Practice', title: 'Practice' },
    { path: STUDENT_ROUTES.PLAYGROUND, icon: FaShapes, label: 'Playground', title: 'Playground' },
    { path: STUDENT_ROUTES.LEADERBOARD, icon: FaMedal, label: 'Wall of Fame', title: 'Leaderboard' },
    { path: STUDENT_ROUTES.PROFILE, icon: FaUserAstronaut, label: 'Profile', title: 'Profile' },
];