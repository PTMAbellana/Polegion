class ProblemService {
  constructor(problemRepo, roomService) {
    this.problemRepo = problemRepo
    this.roomService = roomService
  }

  async createProblem(data, creator) {
    try {
      const room = await this.roomService.getRoomByCodeUsers(data.room_code)
      const {timer, ...rest} = data.problemData
      const compile = {
        ...rest,
        creator_id: creator.id,
        room_id: room.id
      }
      // console.log('problems service ', compile)
      const res = await this.problemRepo.createRoomProb(compile);
   
      if (!res) throw new Error('Problem creation failed')
      await this.problemRepo.createCompeProb(res.id, timer)

      return res
    } catch (error) {
      throw error
    }
  }
  
  async fetchRoomProblems(room_id, creator_id) {
    try {
      const problems = await this.problemRepo.fetchRoomProblems(room_id, creator_id);
      
      // console.log(problems)
      if (!problems || problems.length === 0) return [];
      
      const problemsWithTimers = await Promise.all(
        problems.map(async problem => {
          const timerData = await this.problemRepo.fetchCompeProblemByProbId(problem.id);
          // console.log('timerData', timerData)
          return {
            ...problem,
            timer: timerData?.timer
          };
        })
      );
      return problemsWithTimers;
    } catch (error) {
      throw error;
    }
  }
  
  async fetchRoomProblemsByCode(room_code, creator_id) {
    try {
      const room = await this.roomService.getRoomByCodeUsers(room_code)
      if (!room) throw new Error('Room not found')
      const problems = await this.problemRepo.fetchRoomProblems(room.id, creator_id)
    if (!problems || problems.length === 0) return [];
      
      const problemsWithTimers = await Promise.all(
        problems.map(async problem => {
          const timerData = await this.problemRepo.fetchCompeProblemByProbId(problem.id);
          // console.log('timerData', timerData)
          return {
            ...problem,
            timer: timerData?.timer
          };
        })
      );
      return problemsWithTimers;
    } catch (error) {
      throw error
    }
  }

  async fetchProblem(problem_id, creator_id) {
    try {
      const res = await this.problemRepo.fetchProblemById(problem_id, creator_id)
      const data = await this.problemRepo.fetchCompeProblemByProbId(problem_id)
      return {
        ...res,
        timer: data.timer 
      }
    } catch (error) {
      throw error
    }
  }

  async fetchCurrCompeProblem(compe_prob_id) {
    try {
      return await this.problemRepo.fetchCompeById(compe_prob_id)
    } catch (error) {
      throw error
    }
  }

  async updateTimer(problem_id, timer) {
    try {
      const ok = await this.problemRepo.fetchCompeProblemByProbId(problem_id)
      if (!ok) throw new Error('Problem not found')
      if (ok.competition_id !== null) return await this.problemRepo.createCompeProb(problem_id, timer)
      else {
        const res = await this.problemRepo.updateTimer(problem_id, timer) 
        if (!res) throw new Error('Timer update failed')
        return res
      }
    } catch (error) {
      throw error
    }
  }

  async deleteProblem(problem_id, creator_id) {
    try {
      return await this.problemRepo.deleteProblem(problem_id, creator_id)
    } catch (error) {
      throw error
    }
  }

  async updateProblem(problem_id, creator_id, problemData) {
    try {
      // console.log('updating problem', problem_id, creator_id, problemData)
      const {timer, ...rest} = problemData
      const updatedProblem = await this.problemRepo.updateProblem(problem_id, creator_id, rest)
      if (timer) {
        await this.problemRepo.updateTimer(problem_id, timer)
      }
      return updatedProblem
    } catch (error) {
      console.log('Error in updateProblem:', error);
      throw error
    }
  }

  async fetchCompeProblems(competition_id){  
    try {
      return await this.problemRepo.fetchCompeProblems(competition_id)
    } catch (error) {
      throw error
    }
  }

  async updateCompeProblem(problem_id, competition_id) {
    try {
      return await this.problemRepo.updateProbToCompe(problem_id,competition_id)
    } catch (error) {
      throw error
    }
  }

  async addCompeProblem(problem_id, competition_id) {
    try {
      const data = await this.problemRepo.fetchCompeProblemByProbId(problem_id)
      return await this.problemRepo.addProbToCompe(problem_id,competition_id, data.timer)
    } catch (error) {
      throw error
    }
  }

  async removeCompeProblem(problem_id, competition_id) {
    try {
      return await this.problemRepo.removeCompeProblem(problem_id, competition_id)
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProblemService;