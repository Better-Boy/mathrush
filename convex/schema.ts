import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  players: defineTable({
    userId: v.id("users"),
    username: v.string(),
    email: v.string(), 
    profileIcon: v.string(), // emoji or icon identifier
    profileColor: v.string(), // hex color
    lastActive: v.number(),
    gamesPlayed: v.number(),
    questionsAttempted: v.number(),
    overallScore: v.number(),
  }).index("by_user", ["userId"])
    .index("by_username", ["username"])
    .index("by_score", ["overallScore"]),

  games: defineTable({
    hostId: v.id("players"),
    maxQuestions: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    status: v.union(v.literal("waiting"), v.literal("active"), v.literal("finished")),
    topic: v.string(),
    inviteCode: v.optional(v.string()), // 6-character invite code
    date: v.string(), // YYYY-MM-DD format
  }).index("by_invite_code", ["inviteCode"]),

  gameParticipants: defineTable({
    gameId: v.id("games"),
    playerId: v.id("players"),
    currentQuestionCount: v.number(),
    playerStatus: v.union(v.literal("active"), v.literal("inactive")),
    score: v.number(),
  }).index("by_game_player", ["gameId", "playerId"]),

  gameParticipantQuestion: defineTable({
    gameId: v.id("games"),
    playerId: v.id("players"),
    questionId: v.id("questions"),
    answerGivenByPlayer: v.number(),
    score: v.number(),
  }).index("by_game_question_player", ["gameId", "questionId", "playerId"])
  .index("by_game_player", ["gameId", "playerId"]),

  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(), // index of correct option
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    topic: v.string(),
    explanation: v.string()
  })
  .index("by_topic_difficulty", ["topic", "difficulty"]),

  emailPreferences: defineTable({
    playerId: v.id("players"),
    dailyQuestions: v.boolean(),
    weeklyReports: v.boolean(),
    gameResults: v.boolean(),
    email: v.string(),
  }).index("by_player", ["playerId"]),

  gameInvitations: defineTable({
    gameId: v.id("games"),
    email: v.string(),
    emailStatus: v.string(),
    gameJoinStatus: v.boolean(),
    sentAt: v.number(),
    sentBy: v.id("players"),
    resendId: v.string(),
  }).index("by_game", ["gameId"])
    .index("by_email", ["email"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
