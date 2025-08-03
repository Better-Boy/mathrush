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
    "question": "What is 7 × 6?",
    "options": ["42", "36", "48", "52"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "7 times 6 is 42."
  },
  {
    "question": "If you have 8 packs of stickers, each with 9 stickers, how many stickers in total?",
    "options": ["72", "81", "64", "69"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "8 × 9 = 72 stickers in total."
  },
  {
    "question": "What is 12 × 5?",
    "options": ["60", "50", "65", "55"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "12 times 5 equals 60."
  },
  {
    "question": "You buy 4 boxes, each containing 15 candies. How many candies do you have?",
    "options": ["60", "45", "50", "75"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "4 × 15 = 60 candies total."
  },
  {
    "question": "What is 9 × 8?",
    "options": ["72", "81", "63", "69"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "9 times 8 equals 72."
  },
  {
    "question": "6 × 7 equals?",
    "options": ["42", "36", "48", "52"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "6 × 7 = 42."
  },
  {
    "question": "5 × 11 = ?",
    "options": ["55", "50", "60", "65"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "5 times 11 is 55."
  },
  {
    "question": "What is 4 × 14?",
    "options": ["56", "58", "52", "60"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "4 × 14 = 56."
  },
  {
    "question": "3 × 13 = ?",
    "options": ["39", "36", "33", "42"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "3 times 13 equals 39."
  },
  {
    "question": "What is 10 × 8?",
    "options": ["80", "72", "90", "70"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "topic": "multiplication",
    "explanation": "10 × 8 = 80."
  },
  {
    "question": "What is 14 × 6?",
    "options": ["84", "78", "80", "90"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "14 times 6 is 84."
  },
  {
    "question": "If one notebook costs ₹23 and you buy 7, what’s the total cost?",
    "options": ["₹161", "₹143", "₹130", "₹175"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "23 × 7 = 161."
  },
  {
    "question": "Calculate 18 × 4.",
    "options": ["72", "64", "76", "68"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "18 times 4 equals 72."
  },
  {
    "question": "12 × 12 = ?",
    "options": ["144", "132", "148", "156"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "12 × 12 is 144."
  },
  {
    "question": "Multiply 15 × 9.",
    "options": ["135", "125", "145", "115"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "15 times 9 equals 135."
  },
  {
    "question": "What is 17 × 5?",
    "options": ["85", "75", "90", "95"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "17 × 5 = 85."
  },
  {
    "question": "Calculate 13 × 8.",
    "options": ["104", "98", "108", "112"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "13 times 8 equals 104."
  },
  {
    "question": "If a car travels 45 km per hour, how far does it go in 6 hours?",
    "options": ["270 km", "240 km", "300 km", "260 km"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "45 × 6 = 270 km."
  },
  {
    "question": "Multiply 22 × 3.",
    "options": ["66", "63", "72", "58"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "22 times 3 equals 66."
  },
  {
    "question": "What is 16 × 7?",
    "options": ["112", "108", "120", "104"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "16 × 7 = 112."
  },
  {
    "question": "Calculate 25 × 4.",
    "options": ["100", "90", "110", "95"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "25 times 4 equals 100."
  },
  {
    "question": "Multiply 19 × 6.",
    "options": ["114", "108", "120", "110"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "19 × 6 = 114."
  },
  {
    "question": "What is 23 × 5?",
    "options": ["115", "105", "125", "110"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "23 times 5 equals 115."
  },
  {
    "question": "Compute 24 × 6.",
    "options": ["144", "150", "138", "156"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "24 × 6 = 144."
  },
  {
    "question": "What is 27 × 4?",
    "options": ["108", "112", "102", "116"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "27 times 4 equals 108."
  },
  {
    "question": "Multiply 11 × 13.",
    "options": ["143", "133", "153", "123"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "11 × 13 = 143."
  },
  {
    "question": "What is 14 × 14?",
    "options": ["196", "186", "204", "190"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "14 times 14 equals 196."
  },
  {
    "question": "Compute 18 × 11.",
    "options": ["198", "188", "208", "178"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "18 × 11 = 198."
  },
  {
    "question": "Multiply 26 × 7.",
    "options": ["182", "172", "192", "162"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "26 times 7 equals 182."
  },
  {
    "question": "What is 29 × 8?",
    "options": ["232", "224", "238", "218"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "29 × 8 = 232."
  },
  {
    "question": "Calculate 31 × 6.",
    "options": ["186", "176", "196", "166"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "31 times 6 equals 186."
  },
  {
    "question": "What is 33 × 5?",
    "options": ["165", "155", "175", "160"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "33 × 5 = 165."
  },
  {
    "question": "Multiply 21 × 9.",
    "options": ["189", "179", "199", "169"],
    "correctAnswer": 0,
    "difficulty": "medium",
    "topic": "multiplication",
    "explanation": "21 times 9 equals 189."
  },
  {
    "question": "Multiply 17 × 12.",
    "options": ["204", "194", "214", "184"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "17 × 12 = 204."
  },
  {
    "question": "What is 24 × 13?",
    "options": ["312", "300", "324", "292"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "24 times 13 equals 312."
  },
  {
    "question": "Calculate 18 × 17.",
    "options": ["306", "296", "316", "286"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "18 × 17 = 306."
  },
  {
    "question": "What is 23 × 14?",
    "options": ["322", "312", "332", "342"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "23 times 14 equals 322."
  },
  {
    "question": "Multiply 15 × 18.",
    "options": ["270", "260", "280", "250"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "15 × 18 = 270."
  },
  {
    "question": "Calculate 27 × 16.",
    "options": ["432", "422", "442", "412"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "27 times 16 equals 432."
  },
  {
    "question": "What is 19 × 17?",
    "options": ["323", "313", "333", "303"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "19 × 17 = 323."
  },
  {
    "question": "Multiply 22 × 15.",
    "options": ["330", "320", "340", "310"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "22 times 15 equals 330."
  },
  {
    "question": "Calculate 31 × 14.",
    "options": ["434", "424", "444", "414"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "31 × 14 = 434."
  },
  {
    "question": "What is 29 × 13?",
    "options": ["377", "367", "387", "357"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "29 times 13 equals 377."
  },
  {
    "question": "Multiply 28 × 19.",
    "options": ["532", "522", "542", "512"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "28 × 19 = 532."
  },
  {
    "question": "Calculate 26 × 18.",
    "options": ["468", "458", "478", "448"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "26 times 18 equals 468."
  },
  {
    "question": "What is 34 × 12?",
    "options": ["408", "398", "418", "388"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "34 × 12 = 408."
  },
  {
    "question": "Multiply 33 × 17.",
    "options": ["561", "551", "571", "541"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "33 times 17 equals 561."
  },
  {
    "question": "Calculate 35 × 16.",
    "options": ["560", "550", "570", "540"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "35 × 16 = 560."
  },
  {
    "question": "What is 32 × 18?",
    "options": ["576", "566", "586", "556"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "32 times 18 equals 576."
  },
  {
    "question": "Multiply 36 × 15.",
    "options": ["540", "530", "550", "520"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "36 × 15 = 540."
  },
  {
    "question": "Calculate 38 × 17.",
    "options": ["646", "636", "656", "626"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "38 times 17 equals 646."
  },
  {
    "question": "What is 39 × 14?",
    "options": ["546", "536", "556", "526"],
    "correctAnswer": 0,
    "difficulty": "hard",
    "topic": "multiplication",
    "explanation": "39 × 14 = 546."
  },
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

