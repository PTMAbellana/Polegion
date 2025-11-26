let services = {}; // This will hold all services

// Function to register services (called from container)
function registerServices(serviceInstances) {
    services = serviceInstances;
}

// Function to get services
function getServices() {
    return services;
}

module.exports = {
    registerServices,
    getServices,
    // Export individual services for easy access
    get userService() { return services.userService; },
    get roomService() { return services.roomService; },
    get problemService() { return services.problemService; },
    get participantService() { return services.participantService; },
    get competitionService() { return services.competitionService; },
    get leaderboardService() { return services.leaderboardService; },
    get attemptsService() { return services.attemptsService; },
    get xpService() { return services.xpService; },
    get gradingService() { return services.gradingService; },
    get authService() { return services.authService; }
};