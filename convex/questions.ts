import { internalQuery, internalMutation, query, mutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

export const getGameForQuestion = internalQuery({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const getNextQuestion = mutation({
  args: {
    gameId: v.id("games")
  },
  handler: async (ctx, args) => {

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("game not found");

    const player = await ctx.runQuery(api.players.getCurrentPlayer);
    if(!player) throw new Error("player not found");

    const randomQuestion: any = await ctx.runQuery(internal.questions.getRandomQuestion, {topic: game.topic, difficulty: game.difficulty});
    
    if(!randomQuestion) return null;

    await ctx.db.insert("gameParticipantQuestion", {
      gameId: game._id,
      playerId: player?._id,
      questionId: randomQuestion._id,
      answerGivenByPlayer: -1,
      score: 0
    });

    const playerGameInfo = await ctx.runQuery(internal.games.getGameParticipateRecord, {gameId: args.gameId, playerId: player._id});
    await ctx.db.patch(playerGameInfo._id, {
      currentQuestionCount: playerGameInfo.currentQuestionCount + 1
    });

    await ctx.db.patch(player._id, {
      questionsAttempted: player.questionsAttempted + 1
    })
    
    return randomQuestion;
  },
});


export const addSampleQuestions = internalMutation({
  handler: async (ctx) => {
      const questions = [{
        
      }];

  questions.map(async (question: any) => {
    await ctx.db.insert("questions", {
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      topic: question.topic,
      explanation: question.explanation
    });
  });
  }
});

export const getRandomQuestion = internalQuery({
  args: {
    topic: v.string(),
    difficulty: v.any()
  },
  handler: async (ctx, args) => {

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_topic_difficulty", (q) => q.eq("topic", args.topic).eq("difficulty", args.difficulty))
      .collect();

    if (questions.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  },
});

