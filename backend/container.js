const supabase = require('./config/supabase')

// Import repositories
const UserRepository = require('./infrastructure/repository/UserRepo');
const ParticipantRepository = require('./infrastructure/repository/ParticipantRepo');
const ProblemRepository = require('./infrastructure/repository/ProblemRepo');
const AttemptsRepository = require('./infrastructure/repository/AttemptsRepo');
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
const AdaptiveLearningRepository = require('./infrastructure/repository/AdaptiveLearningRepo');


// Import services
const AuthService = require('./application/services/AuthService');
const UserService = require('./application/services/UserService');
const ParticipantService = require('./application/services/ParticipantService');
const ProblemService = require('./application/services/ProblemService');
const AttemptsService = require('./application/services/AttemptsService');
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
const AdaptiveLearningService = require('./application/services/AdaptiveLearningService');

// Import controllers
const AuthController = require('./presentation/controllers/AuthController');
const UserController = require('./presentation/controllers/UserController');
const ParticipantController = require('./presentation/controllers/ParticipantController');
const ProblemController = require('./presentation/controllers/ProblemController');
const AttemptsController = require('./presentation/controllers/AttemptsController');

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
const AdaptiveLearningController = require('./presentation/controllers/AdaptiveLearningController');

// Import middleware
const AuthMiddleware = require('./presentation/middleware/AuthMiddleware');

// Import routes
const AuthRoutes = require('./presentation/routes/AuthRoutes');
const UserRoutes = require('./presentation/routes/UserRoutes');
const ParticipantRoutes = require('./presentation/routes/ParticipantRoutes');
const ProblemRoutes = require('./presentation/routes/ProblemRoutes');
const AttemptsRoutes = require('./presentation/routes/AttemptsRoutes');

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
const AdaptiveLearningRoutes = require('./presentation/routes/AdaptiveLearningRoutes');

// Import services registry
const servicesRegistry = require('./application/services');

// Initialize repositories
const userRepository = new UserRepository(supabase);
const participantRepository = new ParticipantRepository(supabase);
const problemRepository = new ProblemRepository(supabase);
const attemptsRepository = new AttemptsRepository(supabase);
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
const adaptiveLearningRepository = new AdaptiveLearningRepository(supabase);

// Initialize services
const authService = new AuthService(userRepository, supabase);
const userService = new UserService(userRepository);

// Create stubs for removed services (for dependencies)
const roomService = { getRoomByCodeUsers: () => { throw new Error('Room feature removed for research'); } };
const leaderboardService = { updateLeaderboard: () => {}, getLeaderboard: () => [] };

const problemService = new ProblemService(problemRepository, roomService);
const gradingService = new GradingService();
const xpService = new XPService(xpRepository);
const participantService = new ParticipantService(participantRepository, roomService, userService, leaderboardService);
const attemptsService = new AttemptsService(
  attemptsRepository,
  xpService,
  leaderboardService,
  gradingService,
  participantService,
  userService
);
// Competition service removed for adaptive learning research
// const competitionService = new CompetitionService(...);

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
const adaptiveLearningService = new AdaptiveLearningService(adaptiveLearningRepository);

// Register all services in the registry 🚀
servicesRegistry.registerServices({
    authService,
    userService,
    problemService,
    gradingService,
    xpService,
    participantService,
    attemptsService,
    // Removed: roomService, competitionService, leaderboardService
    castleService,
    chapterQuizService,
    chapterService,
    minigameService,
    userCastleProgressService,
    userChapterProgressService,
    userMinigameAttemptService,
    userQuizAttemptService,
    assessmentService,
    adaptiveLearningService
});

// Initialize middleware
const authMiddleware = new AuthMiddleware(authService);

// Initialize controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
// Removed: roomController, leaderboardController, competitionController
const participantController = new ParticipantController(participantService);
const problemController = new ProblemController(problemService);
const attemptsController = new AttemptsController(attemptsService);

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
const adaptiveLearningController = new AdaptiveLearningController(adaptiveLearningService);

// Initialize routes
const authRoutes = new AuthRoutes(authController);
const userRoutes = new UserRoutes(userController, authMiddleware);
// Removed: roomRoutes, leaderboardRoutes, competitionRoutes
const participantRoutes = new ParticipantRoutes(participantController, authMiddleware);
const problemRoutes = new ProblemRoutes(problemController, authMiddleware);
const attemptsRoutes = new AttemptsRoutes(attemptsController, authMiddleware);

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
const adaptiveLearningRoutes = new AdaptiveLearningRoutes(adaptiveLearningController, authMiddleware);

module.exports = {
  authRoutes: authRoutes.getRouter(),
  userRoutes: userRoutes.getRouter(),
  participantRoutes: participantRoutes.getRouter(),
  problemRoutes: problemRoutes.getRouter(),
  attemptsRoutes: attemptsRoutes.getRouter(),
  // Removed: roomRoutes, leaderboardRoutes, competitionRoutes
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
  adaptiveLearningRoutes: adaptiveLearningRoutes.getRouter(),

  // services (for testing or other uses)
  services: servicesRegistry.getServices()
}