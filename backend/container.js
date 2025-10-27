const supabase = require('./config/supabase')

// Import repositories
const UserRepository = require('./infrastructure/repository/UserRepo');
const RoomRepository = require('./infrastructure/repository/RoomRepo');
const ParticipantRepository = require('./infrastructure/repository/ParticipantRepo');
const ProblemRepository = require('./infrastructure/repository/ProblemRepo');
const LeaderboardRepository = require('./infrastructure/repository/LeaderboardRepo');
const AttemptsRepository = require('./infrastructure/repository/AttemptsRepo');
const CompetitionRepository = require('./infrastructure/repository/CompetitionRepo');
const XPRepository = require('./infrastructure/repository/XPRepo');
const CastleRepository = require('./infrastructure/repository/CastleRepo');
const ChapterRepository = require('./infrastructure/repository/ChapterRepo');
const ProgressRepository = require('./infrastructure/repository/ProgressRepo');

// Import services
const AuthService = require('./application/services/AuthService');
const UserService = require('./application/services/UserService');
const RoomService = require('./application/services/RoomService');
const ParticipantService = require('./application/services/ParticipantService');
const ProblemService = require('./application/services/ProblemService');
const LeaderboardService = require('./application/services/LeaderboardService');
const AttemptsService = require('./application/services/AttemptsService');
const CompetitionService = require('./application/services/CompetitionService');
const XPService = require('./application/services/XPService');
const GradingService = require('./application/services/GradingService');
const CastleService = require('./application/services/CastleService');
const ChapterService = require('./application/services/ChapterService');
const ProgressService = require('./application/services/ProgressService');

// Import controllers
const AuthController = require('./presentation/controllers/AuthController');
const UserController = require('./presentation/controllers/UserController');
const RoomController = require('./presentation/controllers/RoomController');
const ParticipantController = require('./presentation/controllers/ParticipantController');
const ProblemController = require('./presentation/controllers/ProblemController');
const LeaderboardController = require('./presentation/controllers/LeaderboardController');
const AttemptsController = require('./presentation/controllers/AttemptsController');
const CompetitionController = require('./presentation/controllers/CompetitionController');
const CastleController = require('./presentation/controllers/CastleController');
const ChapterController = require('./presentation/controllers/ChapterController');
const ProgressController = require('./presentation/controllers/ProgressController');

// Import middleware
const AuthMiddleware = require('./presentation/middleware/AuthMiddleware');

// Import routes
const AuthRoutes = require('./presentation/routes/AuthRoutes');
const UserRoutes = require('./presentation/routes/UserRoutes');
const RoomRoutes = require('./presentation/routes/RoomRoutes');
const ParticipantRoutes = require('./presentation/routes/ParticipantRoutes');
const ProblemRoutes = require('./presentation/routes/ProblemRoutes');
const LeaderboardRoutes = require('./presentation/routes/LeaderboardRoutes');
const AttemptsRoutes = require('./presentation/routes/AttemptsRoutes');
const CompetitionRoutes = require('./presentation/routes/CompetitionRoutes');
const CastleRoutes = require('./presentation/routes/CastleRoutes');
const ChapterRoutes = require('./presentation/routes/ChapterRoutes');
const ProgressRoutes = require('./presentation/routes/ProgressRoutes');

// Import services registry
const servicesRegistry = require('./application/services');

// Initialize repositories
const userRepository = new UserRepository(supabase);
const roomRepository = new RoomRepository(supabase);
const participantRepository = new ParticipantRepository(supabase);
const problemRepository = new ProblemRepository(supabase);
const leaderboardRepository = new LeaderboardRepository(supabase);
const attemptsRepository = new AttemptsRepository(supabase);
const competitionRepository = new CompetitionRepository(supabase);
const xpRepository = new XPRepository(supabase);
const castleRepository = new CastleRepository(supabase);
const chapterRepository = new ChapterRepository(supabase);
const progressRepository = new ProgressRepository(supabase);

console.log('[Container] Repositories initialized')
console.log('[Container] ProgressRepo initialized:', !!ProgressRepository)

// Initialize services
const authService = new AuthService(userRepository, supabase);
const userService = new UserService(userRepository);
const roomService = new RoomService(roomRepository);
const problemService = new ProblemService(problemRepository, roomRepository);
const gradingService = new GradingService();
const xpService = new XPService(xpRepository);
const leaderboardService = new LeaderboardService(leaderboardRepository, userService, xpService);
const participantService = new ParticipantService(participantRepository, roomService, userService, leaderboardService);
const attemptsService = new AttemptsService(attemptsRepository, xpService, leaderboardService, gradingService, participantService);
const competitionService = new CompetitionService(competitionRepository, participantService, leaderboardService, roomService, problemService);
const castleService = new CastleService(castleRepository, progressRepository, chapterRepository)
console.log('[Container] CastleService initialized with repos:', {
  castleRepository: !!castleRepository,
  progressRepository: !!progressRepository,
  chapterRepository: !!chapterRepository
})

const chapterService = new ChapterService(chapterRepository, progressRepository)
const progressService = new ProgressService(progressRepository, castleRepository, chapterRepository)

// Register all services in the registry 🚀
servicesRegistry.registerServices({
    authService,
    userService,
    roomService,
    problemService,
    gradingService,
    xpService,
    leaderboardService,
    participantService,
    castleService,
    chapterService,
    progressService,
    attemptsService,
    competitionService
});

// Initialize middleware
const authMiddleware = new AuthMiddleware(authService);

// Initialize controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
const roomController = new RoomController(roomService);
const participantController = new ParticipantController(participantService);
const problemController = new ProblemController(problemService);
const leaderboardController = new LeaderboardController(leaderboardService);
const attemptsController = new AttemptsController(attemptsService);
const competitionController = new CompetitionController(competitionService);
const castleController = new CastleController(castleService);
const chapterController = new ChapterController(chapterService);
const progressController = new ProgressController(progressService);

// Initialize routes
const authRoutes = new AuthRoutes(authController);
const userRoutes = new UserRoutes(userController, authMiddleware);
const roomRoutes = new RoomRoutes(roomController, authMiddleware);
const participantRoutes = new ParticipantRoutes(participantController, authMiddleware);
const problemRoutes = new ProblemRoutes(problemController, authMiddleware);
const leaderboardRoutes = new LeaderboardRoutes(leaderboardController, authMiddleware);
const attemptsRoutes = new AttemptsRoutes(attemptsController, authMiddleware);
const competitionRoutes = new CompetitionRoutes(competitionController, authMiddleware);
const castleRoutes = new CastleRoutes(castleController, authMiddleware);
const chapterRoutes = new ChapterRoutes(chapterController, authMiddleware);
const progressRoutes = new ProgressRoutes(progressController, authMiddleware);

module.exports = {
  authRoutes: authRoutes.getRouter(),
  userRoutes: userRoutes.getRouter(),
  roomRoutes: roomRoutes.getRouter(),
  participantRoutes: participantRoutes.getRouter(),
  problemRoutes: problemRoutes.getRouter(),
  leaderboardRoutes: leaderboardRoutes.getRouter(),
  attemptsRoutes: attemptsRoutes.getRouter(),
  competitionRoutes: competitionRoutes.getRouter(),
  castleRoutes: castleRoutes.getRouter(),
  chapterRoutes: chapterRoutes.getRouter(),
  progressRoutes: progressRoutes.getRouter(),

  // services (for testing or other uses)
  services: servicesRegistry.getServices()
}