const supabase = require('./config/supabase')

// Import repositories
const UserRepository = require('./infrastructure/repository/UserRepo');
const RoomRepository = require('./infrastructure/repository/RoomRepo');
const ParticipantRepository = require('./infrastructure/repository/ParticipantRepo');

// Import services
const AuthService = require('./application/services/AuthService');
const UserService = require('./application/services/UserService');
const RoomService = require('./application/services/RoomService');
const ParticipantService = require('./application/services/ParticipantService');

// Import controllers
const AuthController = require('./presentation/controllers/AuthController');
const UserController = require('./presentation/controllers/UserController');
const RoomController = require('./presentation/controllers/RoomController');
const ParticipantController = require('./presentation/controllers/ParticipantController');

// Import middleware
const AuthMiddleware = require('./presentation/middleware/AuthMiddleware');

// Import routes
const AuthRoutes = require('./presentation/routes/AuthRoutes');
const UserRoutes = require('./presentation/routes/UserRoutes');
const RoomRoutes = require('./presentation/routes/RoomRoutes');
const ParticipantRoutes = require('./presentation/routes/ParticipantRoutes');

// Initialize repositories
const userRepository = new UserRepository(supabase);
const roomRepository = new RoomRepository(supabase);
const participantRepository = new ParticipantRepository(supabase);

// Initialize services
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);
const roomService = new RoomService(roomRepository);
const participantService = new ParticipantService(participantRepository, roomService, userService);

// Initialize middleware
const authMiddleware = new AuthMiddleware(authService);

// Initialize controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
const roomController = new RoomController(roomService);
const participantController = new ParticipantController(participantService);

// Initialize routes
const authRoutes = new AuthRoutes(authController);
const userRoutes = new UserRoutes(userController, authMiddleware);
const roomRoutes = new RoomRoutes(roomController, authMiddleware);
const participantRoutes = new ParticipantRoutes(participantController, authMiddleware);

module.exports = {
  authRoutes: authRoutes.getRouter(),
  userRoutes: userRoutes.getRouter(),
  roomRoutes: roomRoutes.getRouter(),
  participantRoutes: participantRoutes.getRouter()
}