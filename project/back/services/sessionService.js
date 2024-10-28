const Session = require('../models/session');
const Team = require('../models/team');
const Problem = require('../models/problems');
const { getTeamById } = require('./teamService');
const { getProblemById } = require('./problemsService');

const createSession = async (team_id, problem_id) => {
    try {
        const team = await getTeamById(team_id);
        if (!team) {
            throw new Error("Team not found");
        }

        const problem = await getProblemById(problem_id);
        if (!problem) {
            throw new Error("Problem not found");
        }

        const session = await Session.create({
            team_id,
            problem_id,
        });
        return session;
    }catch(error){
        throw new Error(`Error creating session: ${error.message}`);
    }
};

const getSessions = async () => {
    try {
        const sessions = await Session.findAll({
            include: [
                {
                    model: Team,
                    attributes: ["team_name"],
                },
                {
                    model: Problem,
                    attributes: ["title", "difficulty"],
                },
            ],
        });
        return sessions;
    } catch (error) {
        throw new Error(`Error retrieving sessions: ${error.message}`);
    }
};

const getSessionById = async (session_id) => {
    try {
        const session = await Session.findByPk(session_id, {
            include: [
                {
                    model: Team,
                    attributes: ["team_name"],
                },{
                    model: Problem,
                    attributes: ["title"],
                },
            ],
        });

        if (!session) {
            throw new Error("Session not found");
        }
        return session;
    } catch (error) {
        throw new Error(`Error getting session by id: ${error.message}`);
    }
};

const getSessionByTeam = async (team_id) => {
  try {
    const sessions = await Session.findAll({
      where: { team_id },
      include: [
        { model: Team, attributes: ["team_name"] },
        { model: Problem, attributes: ["title", "difficulty"] },
      ],
    });
    return sessions;
  } catch (err) {
    throw new Error(`Error retrieving sessions by team: ${err.message}`);
  }
};


const endSession = async (session_id) => {
    try {
        const currSession = await Session.findByPk(session_id);
        if (!currSession) {
          throw new Error("Session not found");
        }

        currSession.ended_at = new Date();
        await currSession.save();
        return currSession;
    } catch (error) {
        throw new Error(`Error ending session: ${error.message}`);
    }
};

const deleteSession = async (session_id) => {
    try {
        const session = await Session.findByPk(session_id);
        if (!session) {
            throw new Error("Session not found");
        }

        await session.destroy();
        return session;
    } catch (error) {
        throw new Error(`Error deleting session: ${error.message}`);
    }
};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    getSessionByTeam,
    endSession,
    deleteSession,
};
