import { STUDENT_ROUTES } from "./routes";
import { FaHome, FaChalkboardTeacher, FaUserAstronaut, FaFortAwesome, FaShapes, FaBrain, FaRobot, FaDumbbell } from 'react-icons/fa';

// Navigation items for teachers (REMOVED - Student-only build)
export const teacherNavItems = [
    { path: '/restricted', icon: FaChalkboardTeacher, label: 'Access Restricted', title: 'Teacher Features Not Available' },
];

// Navigation items for students (Research Focus: Adaptive Learning)
export const studentNavItems = [
    { path: STUDENT_ROUTES.DASHBOARD, icon: FaHome, label: 'Dashboard', title: 'Home' },
    { path: STUDENT_ROUTES.WORLD_MAP, icon: FaFortAwesome, label: 'World Map', title: 'World Map' },
    { path: STUDENT_ROUTES.ADAPTIVE_LEARNING, icon: FaBrain, label: 'Smart Learning', title: 'Personalized Learning' },
    { path: STUDENT_ROUTES.PRACTICE, icon: FaDumbbell, label: 'Practice', title: 'Practice' },
    { path: STUDENT_ROUTES.PLAYGROUND, icon: FaShapes, label: 'Playground', title: 'Playground' },
    { path: STUDENT_ROUTES.PROFILE, icon: FaUserAstronaut, label: 'Profile', title: 'Profile' },
];