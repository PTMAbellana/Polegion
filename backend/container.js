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

// Newly Added Repositories
const CastleRepository = require('./infrastructure/repository/CastleRepo');
const ChapterQuizRepository = require('./infrastructure/repository/ChapterQuizRepo');
const ChapterRepository = require('./infrastructure/repository/ChapterRepo');
const MinigameRepository = require('./infrastructure/repository/MinigameRepo');
const UserCastleProgressRepository = require('./infrastructure/repository/UserCastleProgressRepo');
const UserChapterProgressRepository = require('./infrastructure/repository/UserChapterProgressRepo');
const UserMinigameAttemptRepository = require('./infrastructure/repository/UserMinigameAttemptRepo');
const UserQuizAttemptRepository = require('./infrastructure/repository/UserQuizAttemptRepo');
const AssessmentRepository = require('./infrastructure/repository/AssessmentRepo');


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


// Newly Added Services
const CastleService = require('./application/services/CastleService');
const ChapterQuizService = require('./application/services/ChapterQuizService');
const ChapterService = require('./application/services/ChapterService');
const MinigameService = require('./application/services/MinigameService');
const UserCastleProgressService = require('./application/services/UserCastleProgressService');
const UserChapterProgressService = require('./application/services/UserChapterProgressService');
const UserMinigameAttemptService = require('./application/services/UserMinigameAttemptService');
const UserQuizAttemptService = require('./application/services/UserQuizAttemptService');
const ChapterSeeder = require('./application/services/ChapterSeeder');
const QuizAndMinigameSeeder = require('./application/services/QuizAndMinigameSeeder');
const AssessmentService = require('./application/services/AssessmentService');

// Import controllers
const AuthController = require('./presentation/controllers/AuthController');
const UserController = require('./presentation/controllers/UserController');
const RoomController = require('./presentation/controllers/RoomController');
const ParticipantController = require('./presentation/controllers/ParticipantController');
const ProblemController = require('./presentation/controllers/ProblemController');
const LeaderboardController = require('./presentation/controllers/LeaderboardController');
const AttemptsController = require('./presentation/controllers/AttemptsController');
const CompetitionController = require('./presentation/controllers/CompetitionController');

// Newly Added Controllers
const CastleController = require('./presentation/controllers/CastleController');
const ChapterQuizController = require('./presentation/controllers/ChapterQuizController');
const ChapterController = require('./presentation/controllers/ChapterController');
const MinigameController = require('./presentation/controllers/MinigameController');
const UserCastleProgressController = require('./presentation/controllers/UserCastleProgressController');
const UserChapterProgressController = require('./presentation/controllers/UserChapterProgressController');
const UserMinigameAttemptController = require('./presentation/controllers/UserMinigameAttemptController');
const UserQuizAttemptController = require('./presentation/controllers/UserQuizAttemptController');
const AssessmentController = require('./presentation/controllers/AssessmentController');

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

// Newly Added Routes
const CastleRoutes = require('./presentation/routes/CastleRoutes');
const ChapterQuizRoutes = require('./presentation/routes/ChapterQuizRoutes');
const ChapterRoutes = require('./presentation/routes/ChapterRoutes');
const MinigameRoutes = require('./presentation/routes/MinigameRoutes');
const UserCastleProgressRoutes = require('./presentation/routes/UserCastleProgressRoutes');
const UserChapterProgressRoutes = require('./presentation/routes/UserChapterProgressRoutes');
const UserMinigameAttemptRoutes = require('./presentation/routes/UserMinigameAttemptRoutes');
const UserQuizAttemptRoutes = require('./presentation/routes/UserQuizAttemptRoutes');
const AssessmentRoutes = require('./presentation/routes/AssessmentRoutes');

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

// Newly Added Repositories
const castleRepository = new CastleRepository(supabase);
const chapterQuizRepository = new ChapterQuizRepository(supabase);
const chapterRepository = new ChapterRepository(supabase);
const minigameRepository = new MinigameRepository(supabase);
const userCastleProgressRepository = new UserCastleProgressRepository(supabase);
const userChapterProgressRepository = new UserChapterProgressRepository(supabase);
const userMinigameAttemptRepository = new UserMinigameAttemptRepository(supabase);
const userQuizAttemptRepository = new UserQuizAttemptRepository(supabase);
const assessmentRepository = new AssessmentRepository(supabase);

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

// Added Newly Added Services
const chapterSeeder = new ChapterSeeder(chapterRepository);
const quizAndMinigameSeeder = new QuizAndMinigameSeeder(chapterQuizRepository, minigameRepository);
const castleService = new CastleService(castleRepository, userCastleProgressRepository, chapterRepository, userChapterProgressRepository, chapterSeeder, quizAndMinigameSeeder);
const chapterQuizService = new ChapterQuizService(chapterQuizRepository);
const chapterService = new ChapterService(chapterRepository, chapterQuizService);
const minigameService = new MinigameService(minigameRepository);
const userCastleProgressService = new UserCastleProgressService(userCastleProgressRepository, castleService);
const userChapterProgressService = new UserChapterProgressService(userChapterProgressRepository, chapterRepository, userCastleProgressRepository, userMinigameAttemptRepository, userQuizAttemptRepository);
const userMinigameAttemptService = new UserMinigameAttemptService(userMinigameAttemptRepository, minigameService, xpService, leaderboardService);
const userQuizAttemptService = new UserQuizAttemptService(userQuizAttemptRepository, chapterQuizService, xpService, leaderboardService);
const assessmentService = new AssessmentService(assessmentRepository, userCastleProgressRepository, chapterRepository, userChapterProgressRepository);

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
    attemptsService,
    competitionService,
    castleService,
    chapterQuizService,
    chapterService,
    minigameService,
    userCastleProgressService,
    userChapterProgressService,
    userMinigameAttemptService,
    userQuizAttemptService,
    assessmentService
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

// Added New Controllers
const castleController = new CastleController(castleService);
const chapterQuizController = new ChapterQuizController(chapterQuizService);
const chapterController = new ChapterController(chapterService);
const minigameController = new MinigameController(minigameService);
const userCastleProgressController = new UserCastleProgressController(userCastleProgressService);
const userChapterProgressController = new UserChapterProgressController(userChapterProgressService);
const userMinigameAttemptController = new UserMinigameAttemptController(userMinigameAttemptService);
const userQuizAttemptController = new UserQuizAttemptController(userQuizAttemptService);
const assessmentController = new AssessmentController(assessmentService);

// Initialize routes
const authRoutes = new AuthRoutes(authController);
const userRoutes = new UserRoutes(userController, authMiddleware);
const roomRoutes = new RoomRoutes(roomController, authMiddleware);
const participantRoutes = new ParticipantRoutes(participantController, authMiddleware);
const problemRoutes = new ProblemRoutes(problemController, authMiddleware);
const leaderboardRoutes = new LeaderboardRoutes(leaderboardController, authMiddleware);
const attemptsRoutes = new AttemptsRoutes(attemptsController, authMiddleware);
const competitionRoutes = new CompetitionRoutes(competitionController, authMiddleware);

// Added New Routes
const castleRoutes = new CastleRoutes(castleController, authMiddleware);
const chapterQuizRoutes = new ChapterQuizRoutes(chapterQuizController, authMiddleware);
const chapterRoutes = new ChapterRoutes(chapterController, authMiddleware);
const minigameRoutes = new MinigameRoutes(minigameController, authMiddleware);
const userCastleProgressRoutes = new UserCastleProgressRoutes(userCastleProgressController, authMiddleware);
const userChapterProgressRoutes = new UserChapterProgressRoutes(userChapterProgressController, authMiddleware);
const userMinigameAttemptRoutes = new UserMinigameAttemptRoutes(userMinigameAttemptController, authMiddleware);
const userQuizAttemptRoutes = new UserQuizAttemptRoutes(userQuizAttemptController, authMiddleware);
const assessmentRoutes = new AssessmentRoutes(assessmentController, authMiddleware);

module.exports = {
  authRoutes: authRoutes.getRouter(),
  userRoutes: userRoutes.getRouter(),
  roomRoutes: roomRoutes.getRouter(),
  participantRoutes: participantRoutes.getRouter(),
  problemRoutes: problemRoutes.getRouter(),
  leaderboardRoutes: leaderboardRoutes.getRouter(),
  attemptsRoutes: attemptsRoutes.getRouter(),
  competitionRoutes: competitionRoutes.getRouter(),
  // Newly Added Routes
  castleRoutes: castleRoutes.getRouter(),
  chapterQuizRoutes: chapterQuizRoutes.getRouter(),
  chapterRoutes: chapterRoutes.getRouter(),
  minigameRoutes: minigameRoutes.getRouter(),
  userCastleProgressRoutes: userCastleProgressRoutes.getRouter(),
  userChapterProgressRoutes: userChapterProgressRoutes.getRouter(),
  userMinigameAttemptRoutes: userMinigameAttemptRoutes.getRouter(),
  userQuizAttemptRoutes: userQuizAttemptRoutes.getRouter(),
  assessmentRoutes: assessmentRoutes.getRouter(),

  // services (for testing or other uses)
  services: servicesRegistry.getServices()
}