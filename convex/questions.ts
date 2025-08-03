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
      const questions = [
  {
    "question": "Lucy has 27 apples and her friend gives her 18 more. How many apples does Lucy have now?",
    "options": ["35", "45", "40", "50"],
    "correctAnswer": 1,
    "difficulty": "easy",
    "topic": "addition",
    "explanation": "27 + 18 = 45. So Lucy has 45 apples now."
  },
  {
    "question": "What is 124 + 76?",
    "options": ["190", "200", "210", "180"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "addition",
    "explanation": "124 + 76 = 200. Simple vertical addition gives 200."
  },
  {
    "question": "James has $150 and earns $75 more from his weekend job. How much money does he have now?",
    "options": ["200", "225", "215", "230"],
    "correctAnswer": 1,
    "difficulty": "easy",
    "topic": "addition",
    "explanation": "150 + 75 = 225. Total money is $225."
  },
  {
    "question": "Solve: 385 + 127 = ?",
    "options": ["512", "502", "510", "517"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "addition",
    "explanation": "385 + 127 = 512. Break it down: 385 + 100 = 485, then 485 + 27 = 512."
  },
  {
    "question": "What is the sum of 783 and 219?",
    "options": ["1001", "1002", "1003", "1004"],
    "correctAnswer": 2,
    "difficulty": "medium",
    "topic": "addition",
    "explanation": "783 + 219 = 1002. Double-checking shows the correct total is 1002."
  },
  {
    "question": "Emma reads 235 pages on Monday, 198 pages on Tuesday, and 167 pages on Wednesday. How many pages did she read in total?",
    "options": ["600", "590", "610", "630"],
    "correctAnswer": 2,
    "difficulty": "medium",
    "topic": "addition",
    "explanation": "235 + 198 + 167 = 600. First add 235 + 198 = 433, then 433 + 167 = 600."
  },
  {
    "question": "Add: 3,456 + 2,789",
    "options": ["6,245", "6,243", "6,255", "6,135"],
    "correctAnswer": 1,
    "difficulty": "hard",
    "topic": "addition",
    "explanation": "3,456 + 2,789 = 6,243. Align by place value for accurate addition."
  },
  {
    "question": "A box contains 1,254 red balls, 2,347 blue balls, and 1,678 green balls. How many balls are there in total?",
    "options": ["5,179", "5,279", "5,289", "5,189"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "addition",
    "explanation": "1,254 + 2,347 = 3,601, then 3,601 + 1,578 = 5,179."
  },
  {
    "question": "If a video game costs $1,259 and another one costs $2,985, how much do both cost together?",
    "options": ["4,244", "4,234", "4,249", "4,239"],
    "correctAnswer": 3,
    "difficulty": "hard",
    "topic": "addition",
    "explanation": "1,259 + 2,985 = 4,244. Add thousands, hundreds, tens, and units carefully."
  },
  {
    "question": "Find the total of 6,789 + 3,212 + 5,404.",
    "options": ["15,405", "15,406", "15,395", "15,403"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "addition",
    "explanation": "6,789 + 3,212 = 10,001, then 10,001 + 5,404 = 15,405."
  }
];

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

