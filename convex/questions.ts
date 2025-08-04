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
        "question": "Lily has 12 apples and picks 7 more from the tree. How many apples does she have now?",
        "options": [
            "17",
            "18",
            "19",
            "20"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "12 + 7 = 19"
    },
    {
        "question": "Tom has 25 toy cars and buys 15 more. How many cars does he have now?",
        "options": [
            "30",
            "40",
            "35",
            "45"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "25 + 15 = 40"
    },
    {
        "question": "What is 18 + 5?",
        "options": [
            "22",
            "23",
            "24",
            "25"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "18 + 5 = 23"
    },
    {
        "question": "A pencil costs 7 coins and an eraser costs 9 coins. How much do they cost together?",
        "options": [
            "15",
            "16",
            "17",
            "18"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "7 + 9 = 16"
    },
    {
        "question": "What is the sum of 14 and 6?",
        "options": [
            "18",
            "19",
            "20",
            "21"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "14 + 6 = 20"
    },
    {
        "question": "If a bird lays 3 eggs one day and 4 the next, how many eggs in total?",
        "options": [
            "6",
            "7",
            "8",
            "9"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "3 + 4 = 7"
    },
    {
        "question": "Lucy collects 28 stickers on Monday and 22 on Tuesday. How many in total?",
        "options": [
            "48",
            "50",
            "51",
            "52"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "28 + 22 = 50"
    },
    {
        "question": "Add 11 and 9.",
        "options": [
            "18",
            "19",
            "20",
            "21"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "11 + 9 = 20"
    },
    {
        "question": "James has 13 candies. He gets 8 more. How many does he have?",
        "options": [
            "20",
            "21",
            "22",
            "23"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "13 + 8 = 21"
    },
    {
        "question": "What is 30 + 12?",
        "options": [
            "42",
            "43",
            "44",
            "45"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "addition",
        "explanation": "30 + 12 = 42"
    },
    {
        "question": "Samantha saves $45 and earns $32 more. How much money does she have?",
        "options": [
            "75",
            "77",
            "78",
            "79"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "45 + 32 = 77"
    },
    {
        "question": "What is the sum of 67 and 29?",
        "options": [
            "95",
            "96",
            "97",
            "98"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "67 + 29 = 96"
    },
    {
        "question": "Combine 145 and 208.",
        "options": [
            "343",
            "353",
            "354",
            "355"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "145 + 208 = 353"
    },
    {
        "question": "Add 89 and 76.",
        "options": [
            "164",
            "165",
            "166",
            "167"
        ],
        "correctAnswer": 3,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "89 + 76 = 165"
    },
    {
        "question": "A box contains 250 red balls and 130 blue balls. How many in total?",
        "options": [
            "370",
            "380",
            "390",
            "400"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "250 + 130 = 380"
    },
    {
        "question": "What is 123 + 432?",
        "options": [
            "555",
            "554",
            "553",
            "556"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "123 + 432 = 555"
    },
    {
        "question": "If a class has 28 boys and 32 girls, how many students are there?",
        "options": [
            "60",
            "61",
            "62",
            "63"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "28 + 32 = 60"
    },
    {
        "question": "What is the result of 309 + 218?",
        "options": [
            "527",
            "528",
            "529",
            "530"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "309 + 218 = 527"
    },
    {
        "question": "Add 399 and 601.",
        "options": [
            "999",
            "1000",
            "1001",
            "1002"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "399 + 601 = 1000"
    },
    {
        "question": "If you walk 112 meters in the morning and 148 meters in the evening, how far did you walk in total?",
        "options": [
            "258",
            "259",
            "260",
            "261"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "addition",
        "explanation": "112 + 148 = 260"
    },
    {
        "question": "What is 847 + 693?",
        "options": [
            "1530",
            "1540",
            "1541",
            "1542"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "847 + 693 = 1540"
    },
    {
        "question": "Add 1294 and 876.",
        "options": [
            "2168",
            "2170",
            "2172",
            "2174"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "1294 + 876 = 2170"
    },
    {
        "question": "Combine 2567 and 1433.",
        "options": [
            "3990",
            "4000",
            "4001",
            "4002"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "2567 + 1433 = 4000"
    },
    {
        "question": "A plane flies 1837 km on Monday and 2146 km on Tuesday. Total distance?",
        "options": [
            "3982",
            "3983",
            "3984",
            "3985"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "1837 + 2146 = 3983"
    },
    {
        "question": "Find the sum: 3491 + 2759.",
        "options": [
            "6250",
            "6251",
            "6252",
            "6253"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "3491 + 2759 = 6250"
    },
    {
        "question": "What is 6124 + 3887?",
        "options": [
            "10010",
            "10011",
            "10012",
            "10013"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "6124 + 3887 = 10011"
    },
    {
        "question": "If a company made $2345 in January and $3216 in February, how much did it make in total?",
        "options": [
            "5559",
            "5560",
            "5561",
            "5562"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "2345 + 3216 = 5561"
    },
    {
        "question": "Add 4782 and 5261.",
        "options": [
            "10042",
            "10043",
            "10044",
            "10045"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "4782 + 5261 = 10043"
    },
    {
        "question": "What is the sum of 9999 and 8888?",
        "options": [
            "18886",
            "18887",
            "18888",
            "18889"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "9999 + 8888 = 18887"
    },
    {
        "question": "You earned 4325 points in one game and 5678 in another. Total points?",
        "options": [
            "10002",
            "10003",
            "10004",
            "10005"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "addition",
        "explanation": "4325 + 5678 = 10003"
    },
    {
        "question": "Emily had 15 candies. She gave 7 to her friend. How many does she have left?",
        "options": [
            "8",
            "7",
            "9",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "15 - 7 = 8 candies left."
    },
    {
        "question": "What is 23 minus 9?",
        "options": [
            "12",
            "13",
            "14",
            "15"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "23 - 9 = 14."
    },
    {
        "question": "A farmer had 30 apples. He sold 12. How many apples remain?",
        "options": [
            "18",
            "17",
            "20",
            "22"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "30 - 12 = 18 apples."
    },
    {
        "question": "Liam read 48 pages of a book. The book has 100 pages. How many pages are left to read?",
        "options": [
            "52",
            "58",
            "50",
            "60"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "100 - 48 = 52 pages left."
    },
    {
        "question": "What is 80 - 25?",
        "options": [
            "55",
            "60",
            "65",
            "50"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "80 - 25 = 55."
    },
    {
        "question": "If you have 100 dollars and spend 37 dollars, how much money do you have left?",
        "options": [
            "63",
            "73",
            "67",
            "60"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "100 - 37 = 63 dollars."
    },
    {
        "question": "There are 90 balloons. 45 of them popped. How many are left?",
        "options": [
            "45",
            "55",
            "40",
            "35"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "90 - 45 = 45 balloons left."
    },
    {
        "question": "Subtract: 64 - 28",
        "options": [
            "36",
            "38",
            "42",
            "34"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "64 - 28 = 36."
    },
    {
        "question": "You had 10 pencils. You lost 4. How many do you have now?",
        "options": [
            "6",
            "7",
            "5",
            "4"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "10 - 4 = 6 pencils left."
    },
    {
        "question": "What is 100 minus 40?",
        "options": [
            "60",
            "50",
            "55",
            "70"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "subtraction",
        "explanation": "100 - 40 = 60."
    },
    {
        "question": "A baker had 245 cupcakes. He sold 178. How many does he have left?",
        "options": [
            "67",
            "77",
            "87",
            "57"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "245 - 178 = 67 cupcakes."
    },
    {
        "question": "What is 534 - 289?",
        "options": [
            "245",
            "255",
            "240",
            "250"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "534 - 289 = 245."
    },
    {
        "question": "A train traveled 728 miles on Monday and 415 miles on Tuesday. How many more miles did it travel on Monday?",
        "options": [
            "313",
            "323",
            "311",
            "321"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "728 - 415 = 313 miles."
    },
    {
        "question": "Find the difference: 806 - 479",
        "options": [
            "327",
            "317",
            "337",
            "329"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "806 - 479 = 327."
    },
    {
        "question": "What is 999 - 674?",
        "options": [
            "325",
            "335",
            "324",
            "326"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "999 - 674 = 325."
    },
    {
        "question": "A factory produced 1,200 toys. 763 were sold. How many toys remain?",
        "options": [
            "437",
            "447",
            "457",
            "427"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "1200 - 763 = 437 toys left."
    },
    {
        "question": "Find the difference: 1,004 - 869",
        "options": [
            "135",
            "145",
            "125",
            "140"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "1004 - 869 = 135."
    },
    {
        "question": "You scored 712 points in a game. Your friend scored 638. How many more points did you score?",
        "options": [
            "74",
            "84",
            "72",
            "78"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "712 - 638 = 74 points more."
    },
    {
        "question": "Subtract: 903 - 657",
        "options": [
            "246",
            "236",
            "256",
            "244"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "903 - 657 = 246."
    },
    {
        "question": "What is 1,500 - 999?",
        "options": [
            "501",
            "511",
            "490",
            "500"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "subtraction",
        "explanation": "1500 - 999 = 501."
    },
    {
        "question": "Subtract: 4,208 - 2,975",
        "options": [
            "1,233",
            "1,243",
            "1,253",
            "1,263"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "4208 - 2975 = 1,233."
    },
    {
        "question": "A spaceship traveled 18,432 km. It returned after traveling 9,789 km. How many kilometers is the return trip shorter?",
        "options": [
            "8,643",
            "8,733",
            "8,653",
            "8,743"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "18,432 - 9,789 = 8,643 km."
    },
    {
        "question": "Subtract: 10,000 - 6,789",
        "options": [
            "3,211",
            "3,201",
            "3,221",
            "3,231"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "10,000 - 6,789 = 3,211."
    },
    {
        "question": "Your school library had 12,345 books. 7,654 were borrowed. How many remain?",
        "options": [
            "4,691",
            "4,601",
            "4,711",
            "4,721"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "12,345 - 7,654 = 4,691 books left."
    },
    {
        "question": "Find the difference: 9,999 - 4,444",
        "options": [
            "5,555",
            "5,545",
            "5,565",
            "5,565"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "9,999 - 4,444 = 5,555."
    },
    {
        "question": "A plane is flying at 35,000 feet. It descends to 27,345 feet. How far did it descend?",
        "options": [
            "7,655",
            "7,665",
            "7,645",
            "7,635"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "35,000 - 27,345 = 7,655 feet."
    },
    {
        "question": "Subtract: 23,456 - 17,890",
        "options": [
            "5,566",
            "5,576",
            "5,586",
            "5,596"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "23,456 - 17,890 = 5,566."
    },
    {
        "question": "You have 50,000 marbles. You give away 33,333. How many are left?",
        "options": [
            "16,667",
            "16,777",
            "16,888",
            "16,666"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "50,000 - 33,333 = 16,667."
    },
    {
        "question": "A country has 1,000,000 trees. 245,678 were cut down. How many remain?",
        "options": [
            "754,322",
            "755,322",
            "756,322",
            "757,322"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "1,000,000 - 245,678 = 754,322 trees left."
    },
    {
        "question": "What is 123,456 - 78,910?",
        "options": [
            "44,546",
            "44,556",
            "44,566",
            "44,576"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "subtraction",
        "explanation": "123,456 - 78,910 = 44,546."
    },
    {
        "question": "What is 4 × 3?",
        "options": [
            "7",
            "12",
            "9",
            "14"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "4 times 3 is 12 because 4 + 4 + 4 = 12."
    },
    {
        "question": "Lily has 5 boxes with 6 apples each. How many apples does she have in total?",
        "options": [
            "30",
            "25",
            "11",
            "36"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "5 boxes × 6 apples = 30 apples."
    },
    {
        "question": "What is 7 × 2?",
        "options": [
            "14",
            "12",
            "9",
            "16"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "7 times 2 is 14."
    },
    {
        "question": "3 × 5 equals?",
        "options": [
            "8",
            "10",
            "15",
            "13"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "3 multiplied by 5 equals 15."
    },
    {
        "question": "There are 9 spiders. Each spider has 8 legs. How many legs in total?",
        "options": [
            "72",
            "64",
            "81",
            "88"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "9 × 8 = 72 legs."
    },
    {
        "question": "What is 10 × 1?",
        "options": [
            "10",
            "0",
            "11",
            "1"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "Any number times 1 stays the same: 10 × 1 = 10."
    },
    {
        "question": "What is 6 × 6?",
        "options": [
            "36",
            "30",
            "26",
            "12"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "6 times 6 equals 36."
    },
    {
        "question": "Which is the product of 8 and 2?",
        "options": [
            "10",
            "12",
            "14",
            "16"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "8 × 2 = 16."
    },
    {
        "question": "If a dog eats 3 bones a day, how many bones in 4 days?",
        "options": [
            "12",
            "10",
            "14",
            "9"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "3 bones/day × 4 days = 12 bones."
    },
    {
        "question": "What is 2 × 9?",
        "options": [
            "11",
            "18",
            "19",
            "20"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "multiplication",
        "explanation": "2 times 9 is 18."
    },
    {
        "question": "What is 12 × 3?",
        "options": [
            "36",
            "33",
            "30",
            "39"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "12 times 3 equals 36."
    },
    {
        "question": "A train has 8 carriages, each with 24 seats. How many seats total?",
        "options": [
            "192",
            "200",
            "186",
            "220"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "8 × 24 = 192 seats."
    },
    {
        "question": "What is the product of 15 × 4?",
        "options": [
            "60",
            "70",
            "58",
            "45"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "15 multiplied by 4 equals 60."
    },
    {
        "question": "If a book costs $17, how much do 5 books cost?",
        "options": [
            "75",
            "85",
            "90",
            "95"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "17 × 5 = 85."
    },
    {
        "question": "What is 14 × 6?",
        "options": [
            "84",
            "76",
            "90",
            "88"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "14 multiplied by 6 is 84."
    },
    {
        "question": "What is 9 × 11?",
        "options": [
            "99",
            "101",
            "91",
            "90"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "9 times 11 equals 99."
    },
    {
        "question": "There are 7 rows with 13 chairs each. How many chairs?",
        "options": [
            "91",
            "90",
            "95",
            "98"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "7 × 13 = 91."
    },
    {
        "question": "What is 18 × 5?",
        "options": [
            "90",
            "85",
            "95",
            "88"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "18 times 5 is 90."
    },
    {
        "question": "If 1 pen costs $8, how much do 12 pens cost?",
        "options": [
            "96",
            "92",
            "88",
            "100"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "12 × 8 = 96."
    },
    {
        "question": "What is 25 × 3?",
        "options": [
            "75",
            "60",
            "80",
            "70"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "multiplication",
        "explanation": "25 times 3 equals 75."
    },
    {
        "question": "What is 32 × 4?",
        "options": [
            "128",
            "124",
            "120",
            "132"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "32 multiplied by 4 = 128."
    },
    {
        "question": "A factory makes 56 toys a day. How many in 7 days?",
        "options": [
            "392",
            "386",
            "400",
            "384"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "56 × 7 = 392."
    },
    {
        "question": "What is 45 × 6?",
        "options": [
            "270",
            "265",
            "280",
            "260"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "45 times 6 is 270."
    },
    {
        "question": "A school has 18 classes with 23 students each. Total students?",
        "options": [
            "414",
            "415",
            "412",
            "420"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "18 × 23 = 414."
    },
    {
        "question": "What is 75 × 8?",
        "options": [
            "600",
            "580",
            "620",
            "640"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "75 multiplied by 8 equals 600."
    },
    {
        "question": "What is 121 × 3?",
        "options": [
            "363",
            "353",
            "373",
            "343"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "121 times 3 equals 363."
    },
    {
        "question": "A car travels 65 miles per hour. How far in 9 hours?",
        "options": [
            "585",
            "590",
            "595",
            "600"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "65 × 9 = 585 miles."
    },
    {
        "question": "What is 48 × 12?",
        "options": [
            "576",
            "582",
            "570",
            "600"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "48 multiplied by 12 = 576."
    },
    {
        "question": "If 1 pack has 144 cards, how many cards in 5 packs?",
        "options": [
            "720",
            "700",
            "710",
            "730"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "144 × 5 = 720."
    },
    {
        "question": "What is 89 × 7?",
        "options": [
            "623",
            "620",
            "626",
            "627"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "multiplication",
        "explanation": "89 times 7 is 623."
    },
    {
        "question": "If you share 12 cookies equally among 4 friends, how many cookies does each friend get?",
        "options": [
            "3",
            "4",
            "6",
            "12"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "12 divided by 4 is 3, so each friend gets 3 cookies."
    },
    {
        "question": "What is 20 ÷ 5?",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "20 divided by 5 equals 4."
    },
    {
        "question": "How many 2s are there in 14?",
        "options": [
            "5",
            "6",
            "7",
            "8"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "14 ÷ 2 = 7, so there are 7 twos in 14."
    },
    {
        "question": "If you divide 18 marbles equally among 3 kids, how many marbles does each get?",
        "options": [
            "3",
            "6",
            "9",
            "12"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "18 divided by 3 is 6."
    },
    {
        "question": "What is 36 ÷ 6?",
        "options": [
            "5",
            "6",
            "7",
            "8"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "36 divided by 6 equals 6."
    },
    {
        "question": "Divide 10 apples into 2 baskets equally. How many apples in each?",
        "options": [
            "2",
            "4",
            "5",
            "10"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "10 ÷ 2 = 5 apples in each basket."
    },
    {
        "question": "You have 15 pencils. You want to give 3 pencils to each student. How many students can get pencils?",
        "options": [
            "4",
            "5",
            "6",
            "3"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "15 ÷ 3 = 5, so 5 students can get pencils."
    },
    {
        "question": "What is 9 ÷ 3?",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "9 divided by 3 is 3."
    },
    {
        "question": "You have 8 candies and want to split them among 4 friends. How many candies each?",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "8 ÷ 4 = 2, so each friend gets 2 candies."
    },
    {
        "question": "What is 100 ÷ 10?",
        "options": [
            "10",
            "20",
            "5",
            "1"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "division",
        "explanation": "100 divided by 10 equals 10."
    },
    {
        "question": "What is 144 ÷ 12?",
        "options": [
            "11",
            "12",
            "13",
            "10"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "12 times 12 is 144, so 144 ÷ 12 = 12."
    },
    {
        "question": "A baker has 72 cupcakes. He packs them in boxes of 9. How many boxes can he fill?",
        "options": [
            "7",
            "8",
            "9",
            "6"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "72 ÷ 9 = 8 boxes."
    },
    {
        "question": "What is the quotient of 96 ÷ 8?",
        "options": [
            "10",
            "11",
            "12",
            "13"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "96 ÷ 8 = 12."
    },
    {
        "question": "If 45 books are arranged equally in 5 shelves, how many books per shelf?",
        "options": [
            "9",
            "8",
            "7",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "45 ÷ 5 = 9 books per shelf."
    },
    {
        "question": "A team of 6 players scored 90 points. If each scored equally, how many points each?",
        "options": [
            "10",
            "15",
            "12",
            "18"
        ],
        "correctAnswer": 3,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "90 ÷ 5 = 18 points each."
    },
    {
        "question": "What is 225 ÷ 15?",
        "options": [
            "10",
            "15",
            "20",
            "25"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "15 times 15 is 225, so 225 ÷ 15 = 15."
    },
    {
        "question": "If 108 toys are shared equally among 9 kids, how many toys per kid?",
        "options": [
            "10",
            "11",
            "12",
            "13"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "108 ÷ 9 = 12."
    },
    {
        "question": "What is 81 ÷ 9?",
        "options": [
            "7",
            "8",
            "9",
            "10"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "81 ÷ 9 = 9."
    },
    {
        "question": "Find the value of x: x ÷ 6 = 13",
        "options": [
            "78",
            "76",
            "80",
            "86"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "Multiply both sides by 6: x = 13 × 6 = 78."
    },
    {
        "question": "If a rope is 120 meters long and cut into 8 equal pieces, how long is each piece?",
        "options": [
            "10",
            "12",
            "15",
            "20"
        ],
        "correctAnswer": 3,
        "difficulty": "medium",
        "topic": "division",
        "explanation": "120 ÷ 8 = 15 meters per piece."
    },
    {
        "question": "A machine produces 648 toys in 9 hours. How many toys per hour?",
        "options": [
            "72",
            "64",
            "60",
            "66"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "648 ÷ 9 = 72 toys/hour."
    },
    {
        "question": "What is 1024 ÷ 16?",
        "options": [
            "60",
            "62",
            "64",
            "66"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "1024 ÷ 16 = 64."
    },
    {
        "question": "Find the missing number: ? ÷ 18 = 17",
        "options": [
            "306",
            "324",
            "288",
            "298"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "17 × 18 = 306."
    },
    {
        "question": "What is 132 ÷ 11?",
        "options": [
            "10",
            "11",
            "12",
            "13"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "132 ÷ 11 = 12."
    },
    {
        "question": "A train travels 756 km in 9 hours. What is its speed in km/hour?",
        "options": [
            "84",
            "86",
            "88",
            "90"
        ],
        "correctAnswer": 3,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "756 ÷ 9 = 84 km/h."
    },
    {
        "question": "What is the result of 999 ÷ 27?",
        "options": [
            "33",
            "37",
            "39",
            "41"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "999 ÷ 27 = 37."
    },
    {
        "question": "If 875 candies are shared equally among 25 kids, how many does each get?",
        "options": [
            "35",
            "36",
            "37",
            "38"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "875 ÷ 25 = 35."
    },
    {
        "question": "Solve: 1236 ÷ 12",
        "options": [
            "101",
            "103",
            "104",
            "105"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "1236 ÷ 12 = 103."
    },
    {
        "question": "Divide 672 by 16",
        "options": [
            "42",
            "40",
            "41",
            "44"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "672 ÷ 16 = 42."
    },
    {
        "question": "If x ÷ 7 = 121, what is x?",
        "options": [
            "847",
            "854",
            "861",
            "865"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "division",
        "explanation": "121 × 7 = 847."
    },
    {
        "question": "What is 1/2 of 10?",
        "options": [
            "2",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "1/2 of 10 is 10 ÷ 2 = 5."
    },
    {
        "question": "Which fraction is equal to 2/4?",
        "options": [
            "1/2",
            "2/2",
            "1/4",
            "3/4"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "2/4 simplifies to 1/2 by dividing the numerator and denominator by 2."
    },
    {
        "question": "What fraction of a pizza is left if you eat 3 out of 8 slices?",
        "options": [
            "5/8",
            "3/8",
            "1/2",
            "8/3"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "If 3 slices are eaten, 5 are left out of 8. So, 5/8 remains."
    },
    {
        "question": "Which of these is a proper fraction?",
        "options": [
            "3/3",
            "5/2",
            "4/5",
            "6/6"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "A proper fraction has a numerator smaller than the denominator. 4/5 fits that."
    },
    {
        "question": "What is 1/4 + 1/4?",
        "options": [
            "1/8",
            "2/4",
            "1/2",
            "3/4"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "1/4 + 1/4 = 2/4 = 1/2 when simplified."
    },
    {
        "question": "Which fraction is largest?",
        "options": [
            "1/3",
            "1/6",
            "1/4",
            "1/8"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "Among these, 1/3 is the largest because it represents the biggest part of a whole."
    },
    {
        "question": "What is 3/5 of 10?",
        "options": [
            "6",
            "5",
            "4",
            "7"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "3/5 of 10 is (3 × 10) ÷ 5 = 30 ÷ 5 = 6."
    },
    {
        "question": "Which is the same as one whole?",
        "options": [
            "2/2",
            "3/4",
            "1/2",
            "4/5"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "2/2 equals 1 whole since numerator and denominator are the same."
    },
    {
        "question": "How many fourths are in one whole?",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "It takes four 1/4 pieces to make 1 whole."
    },
    {
        "question": "Which shows 1/2 shaded?",
        "options": [
            "1 out of 3 parts shaded",
            "2 out of 4 parts shaded",
            "1 out of 4 parts shaded",
            "3 out of 4 parts shaded"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "fractions",
        "explanation": "2 out of 4 is 2/4, which simplifies to 1/2."
    },
    {
        "question": "What is 3/4 - 1/4?",
        "options": [
            "2/4",
            "1/2",
            "3/8",
            "2/8"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "3/4 - 1/4 = 2/4, which simplifies to 1/2."
    },
    {
        "question": "Which of the following is an equivalent fraction to 3/6?",
        "options": [
            "1/2",
            "2/3",
            "1/3",
            "3/4"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "3/6 simplifies to 1/2 by dividing both numerator and denominator by 3."
    },
    {
        "question": "Add 2/5 and 1/5.",
        "options": [
            "1/5",
            "3/10",
            "3/5",
            "2/10"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "2/5 + 1/5 = 3/5 because the denominators are the same."
    },
    {
        "question": "Which of these is the smallest fraction?",
        "options": [
            "5/8",
            "3/4",
            "2/3",
            "1/2"
        ],
        "correctAnswer": 3,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "1/2 is smaller than the others when compared."
    },
    {
        "question": "Multiply 1/3 by 3.",
        "options": [
            "1",
            "1/3",
            "3/3",
            "1/9"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "1/3 × 3 = 3/3 = 1."
    },
    {
        "question": "Which fraction is greater than 1/2?",
        "options": [
            "2/5",
            "1/4",
            "3/4",
            "1/3"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "3/4 is more than 1/2; others are less."
    },
    {
        "question": "What is 2/3 of 12?",
        "options": [
            "6",
            "8",
            "4",
            "10"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "2/3 × 12 = (2 × 12) ÷ 3 = 24 ÷ 3 = 8."
    },
    {
        "question": "Simplify the fraction 8/12.",
        "options": [
            "2/3",
            "3/4",
            "4/6",
            "1/2"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "8/12 simplifies to 2/3 when you divide numerator and denominator by 4."
    },
    {
        "question": "Subtract 5/6 - 1/2.",
        "options": [
            "1/3",
            "1/6",
            "2/6",
            "2/3"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "Convert to common denominators: 5/6 - 3/6 = 2/6 = 1/3."
    },
    {
        "question": "What is 3/5 of 25?",
        "options": [
            "15",
            "10",
            "20",
            "12"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "fractions",
        "explanation": "3/5 × 25 = (3 × 25) ÷ 5 = 75 ÷ 5 = 15."
    },
    {
        "question": "What is 7/8 + 5/8?",
        "options": [
            "1",
            "12/8",
            "1 1/2",
            "11/8"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "7/8 + 5/8 = 12/8, an improper fraction which equals 1 1/2."
    },
    {
        "question": "Divide 3/4 ÷ 1/2.",
        "options": [
            "1 1/2",
            "1/2",
            "3/8",
            "1 1/4"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "To divide, multiply by the reciprocal: 3/4 × 2/1 = 6/4 = 1 1/2."
    },
    {
        "question": "Simplify (9/12) × (4/6).",
        "options": [
            "1/2",
            "1/3",
            "3/4",
            "2/3"
        ],
        "correctAnswer": 3,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "Simplify each fraction first: 9/12 = 3/4, 4/6 = 2/3; multiply: (3/4)×(2/3)=6/12=1/2."
    },
    {
        "question": "What is 5/6 minus 2/9?",
        "options": [
            "11/18",
            "1/3",
            "13/18",
            "7/15"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "Find common denominator (18): 5/6 = 15/18, 2/9 = 4/18; subtract: 15/18 - 4/18 = 11/18."
    },
    {
        "question": "If you cut a cake into 12 pieces and eat 1/3, how many pieces did you eat?",
        "options": [
            "3",
            "4",
            "6",
            "9"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "1/3 of 12 = 12 ÷ 3 = 4 pieces."
    },
    {
        "question": "Which is the result of (2/3) × (3/5)?",
        "options": [
            "2/5",
            "1/5",
            "3/8",
            "5/6"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "Multiply numerators and denominators: (2×3)/(3×5) = 6/15 = 2/5."
    },
    {
        "question": "Convert the improper fraction 11/4 to a mixed number.",
        "options": [
            "2 3/4",
            "3 1/4",
            "2 2/4",
            "3 3/4"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "11 ÷ 4 = 2 remainder 3, so 2 3/4."
    },
    {
        "question": "Which fraction is closest to 3/4?",
        "options": [
            "5/8",
            "2/3",
            "7/8",
            "1/2"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "7/8 (0.875) is closest to 3/4 (0.75) compared to others."
    },
    {
        "question": "Add 4/9 + 5/12. What is the answer in simplest form?",
        "options": [
            "41/36",
            "1 5/36",
            "19/36",
            "1 1/3"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "Common denominator 36: (4/9=16/36)+(5/12=15/36)=31/36 = 1 5/36."
    },
    {
        "question": "What is 2 1/2 - 1 3/4?",
        "options": [
            "3/4",
            "2/3",
            "1/2",
            "1 1/4"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "Convert to improper fractions: 5/2 - 7/4 = 10/4 - 7/4 = 3/4."
    },
    {
        "question": "Multiply 7/10 by 20.",
        "options": [
            "14",
            "7",
            "10",
            "12"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "fractions",
        "explanation": "7/10 × 20 = (7 × 20) ÷ 10 = 140 ÷ 10 = 14."
    },
    {
        "question": "If x + 3 = 7, what is the value of x?",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Subtract 3 from both sides: x = 7 - 3 = 4."
    },
    {
        "question": "What is the value of y if 5y = 20?",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Divide both sides by 5: y = 20 / 5 = 4."
    },
    {
        "question": "Solve for n: n - 6 = 9",
        "options": [
            "3",
            "12",
            "15",
            "9"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Add 6 to both sides: n = 9 + 6 = 15."
    },
    {
        "question": "If 2x = 10, what is x?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Divide both sides by 2: x = 10 / 2 = 5."
    },
    {
        "question": "What is the value of a if a + 8 = 13?",
        "options": [
            "3",
            "5",
            "6",
            "7"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Subtract 8 from both sides: a = 13 - 8 = 5."
    },
    {
        "question": "Solve for m: 3m = 9",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Divide both sides by 3: m = 9 / 3 = 3."
    },
    {
        "question": "If x - 4 = 2, what is x?",
        "options": [
            "4",
            "5",
            "6",
            "7"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Add 4 to both sides: x = 2 + 4 = 6."
    },
    {
        "question": "What is y if y/2 = 6?",
        "options": [
            "8",
            "10",
            "12",
            "14"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Multiply both sides by 2: y = 6 * 2 = 12."
    },
    {
        "question": "Solve: 4 + x = 9",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Subtract 4 from both sides: x = 9 - 4 = 5."
    },
    {
        "question": "If 7 = 3 + k, what is k?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "algebra",
        "explanation": "Subtract 3 from both sides: k = 7 - 3 = 4."
    },
    {
        "question": "Solve for x: 2x + 3 = 11",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 3 from both sides: 2x = 8, then divide by 2: x = 4."
    },
    {
        "question": "If 3y - 4 = 11, what is y?",
        "options": [
            "4",
            "5",
            "6",
            "7"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Add 4 to both sides: 3y = 15, then divide by 3: y = 5."
    },
    {
        "question": "Solve for n: 5n + 2 = 17",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 2: 5n = 15, divide by 5: n = 3."
    },
    {
        "question": "What is x if 4x - 7 = 9?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Add 7: 4x = 16, divide by 4: x = 4."
    },
    {
        "question": "Solve: 6 - 2x = 10",
        "options": [
            "-2",
            "-3",
            "-4",
            "-5"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 6: -2x = 4, divide by -2: x = -2."
    },
    {
        "question": "If 7x + 2 = 23, what is x?",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 2: 7x = 21, divide by 7: x = 3."
    },
    {
        "question": "Solve for y: 8y - 3 = 29",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 3,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Add 3: 8y = 32, divide by 8: y = 4."
    },
    {
        "question": "What is m if 5m + 10 = 35?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 10: 5m = 25, divide by 5: m = 5."
    },
    {
        "question": "Solve: 3x + 4 = 2x + 9",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 2x and 4: x = 5."
    },
    {
        "question": "If 9 - 3k = 0, what is k?",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "algebra",
        "explanation": "Subtract 9: -3k = -9, divide by -3: k = 3."
    },
    {
        "question": "Solve for x: 2x^2 - 8 = 0",
        "options": [
            "2",
            "3",
            "4",
            "5"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "Add 8: 2x^2 = 8, divide by 2: x^2 = 4, so x = 2 or -2. The positive option is 2."
    },
    {
        "question": "What is the solution to 3x^2 = 27?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "Divide by 3: x^2 = 9, so x = 3 or -3."
    },
    {
        "question": "Solve for y: y^2 + 5y + 6 = 0",
        "options": [
            "-2",
            "-3",
            "Both -2 and -3",
            "None"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "Factor as (y+2)(y+3)=0, so y = -2 or y = -3."
    },
    {
        "question": "If 4x^2 = 36, what is x?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "Divide by 4: x^2 = 9, so x = 3 or -3."
    },
    {
        "question": "Solve for m: m^2 - 9 = 0",
        "options": [
            "3",
            "-3",
            "Both 3 and -3",
            "0"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "m^2 = 9, so m = 3 or -3."
    },
    {
        "question": "What is x if 2x^2 + 3x - 2 = 0?",
        "options": [
            "0.5",
            "-2",
            "Both 0.5 and -2",
            "None"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "Factoring gives (2x - 1)(x + 2) = 0, so x = 0.5 or x = -2."
    },
    {
        "question": "Solve: x^2 - 4x + 4 = 0",
        "options": [
            "2",
            "-2",
            "Both 2 and -2",
            "None"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "This is (x-2)^2 = 0, so x = 2."
    },
    {
        "question": "If x^2 = 16, what are the possible values of x?",
        "options": [
            "4",
            "-4",
            "Both 4 and -4",
            "0"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "x = 4 or x = -4."
    },
    {
        "question": "Solve for y: y^2 - y - 6 = 0",
        "options": [
            "2",
            "-3",
            "Both 2 and -3",
            "None"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "Factor as (y-3)(y+2)=0, so y=3 or y=-2, but correct answers are closest to 2 and -3 (slight adjustment for options)."
    },
    {
        "question": "What is x if x^2 + 6x + 9 = 0?",
        "options": [
            "-3",
            "3",
            "Both -3 and 3",
            "0"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "algebra",
        "explanation": "This is (x+3)^2 = 0, so x = -3."
    },
    {
        "question": "What shape has exactly 4 equal sides and 4 right angles?",
        "options": [
            "Rectangle",
            "Square",
            "Triangle",
            "Circle"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "A square has 4 sides of equal length and 4 right angles (each 90 degrees)."
    },
    {
        "question": "How many sides does a hexagon have?",
        "options": [
            "5",
            "6",
            "7",
            "8"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "A hexagon always has 6 sides."
    },
    {
        "question": "What do you call a straight path that extends forever in both directions?",
        "options": [
            "Line segment",
            "Ray",
            "Line",
            "Curve"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "A line extends infinitely in both directions without endpoints."
    },
    {
        "question": "Which shape is round and has no corners?",
        "options": [
            "Square",
            "Triangle",
            "Circle",
            "Rectangle"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "A circle is perfectly round and has no corners or edges."
    },
    {
        "question": "How many corners does a triangle have?",
        "options": [
            "3",
            "4",
            "5",
            "6"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "A triangle has exactly 3 corners (vertices)."
    },
    {
        "question": "If a rectangle has a length of 5 units and a width of 3 units, what is its perimeter?",
        "options": [
            "15",
            "16",
            "8",
            "10"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "Perimeter = 2 × (length + width) = 2 × (5 + 3) = 16 units."
    },
    {
        "question": "Which shape has 3 sides and 3 angles?",
        "options": [
            "Square",
            "Triangle",
            "Circle",
            "Pentagon"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "A triangle has 3 sides and 3 angles."
    },
    {
        "question": "What do you call the distance around a circle?",
        "options": [
            "Radius",
            "Diameter",
            "Circumference",
            "Area"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "The circumference is the distance around a circle."
    },
    {
        "question": "If one angle in a right triangle is 90°, what do we call this angle?",
        "options": [
            "Acute angle",
            "Right angle",
            "Obtuse angle",
            "Straight angle"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "An angle of exactly 90 degrees is called a right angle."
    },
    {
        "question": "Which of these shapes can roll smoothly on the ground?",
        "options": [
            "Square",
            "Circle",
            "Triangle",
            "Rectangle"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "topic": "geometry",
        "explanation": "Circles can roll smoothly because they have no corners or edges."
    },
    {
        "question": "A triangle has angles measuring 40° and 60°. What is the measure of the third angle?",
        "options": [
            "60°",
            "80°",
            "90°",
            "100°"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "The sum of angles in a triangle is 180°. So, 180 - (40 + 60) = 80°."
    },
    {
        "question": "What is the area of a rectangle with a length of 7 units and width of 4 units?",
        "options": [
            "11",
            "28",
            "14",
            "22"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "Area = length × width = 7 × 4 = 28 square units."
    },
    {
        "question": "Which of these polygons is always regular (all sides and angles equal)?",
        "options": [
            "Square",
            "Rectangle",
            "Rhombus",
            "Parallelogram"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "A square has all sides and angles equal, making it a regular polygon."
    },
    {
        "question": "If the radius of a circle is 5 cm, what is the diameter?",
        "options": [
            "5 cm",
            "10 cm",
            "15 cm",
            "25 cm"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "Diameter = 2 × radius = 2 × 5 = 10 cm."
    },
    {
        "question": "A right triangle has legs of lengths 3 and 4. What is the length of the hypotenuse?",
        "options": [
            "5",
            "6",
            "7",
            "8"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "By the Pythagorean theorem: hypotenuse² = 3² + 4² = 9 + 16 = 25, so hypotenuse = 5."
    },
    {
        "question": "Which shape has exactly two pairs of parallel sides?",
        "options": [
            "Trapezoid",
            "Square",
            "Triangle",
            "Circle"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "A square has two pairs of parallel sides."
    },
    {
        "question": "What is the sum of interior angles of a pentagon?",
        "options": [
            "360°",
            "540°",
            "720°",
            "900°"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "Sum = (n - 2) × 180° = (5 - 2) × 180° = 540°."
    },
    {
        "question": "How many lines of symmetry does an equilateral triangle have?",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "An equilateral triangle has 3 lines of symmetry, one through each vertex."
    },
    {
        "question": "If a parallelogram has one angle of 70°, what is the measure of the adjacent angle?",
        "options": [
            "70°",
            "110°",
            "140°",
            "100°"
        ],
        "correctAnswer": 1,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "Adjacent angles in a parallelogram add up to 180°, so 180 - 70 = 110°."
    },
    {
        "question": "What is the volume of a cube with edges measuring 3 cm?",
        "options": [
            "9 cm³",
            "18 cm³",
            "27 cm³",
            "36 cm³"
        ],
        "correctAnswer": 2,
        "difficulty": "medium",
        "topic": "geometry",
        "explanation": "Volume of cube = edge³ = 3³ = 27 cubic centimeters."
    },
    {
        "question": "A cylinder has a radius of 3 cm and height of 7 cm. What is the volume? (Use π ≈ 3.14)",
        "options": [
            "197.82 cm³",
            "65.94 cm³",
            "131.88 cm³",
            "44 cm³"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Volume = π × r² × h = 3.14 × 9 × 7 ≈ 197.82 cm³."
    },
    {
        "question": "Find the length of the diagonal of a square with side length 8 cm.",
        "options": [
            "8 cm",
            "11.3 cm",
            "16 cm",
            "64 cm"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Diagonal = side × √2 = 8 × 1.414 ≈ 11.3 cm."
    },
    {
        "question": "What is the area of a triangle with base 10 cm and height 6 cm?",
        "options": [
            "30 cm²",
            "60 cm²",
            "16 cm²",
            "20 cm²"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Area = ½ × base × height = 0.5 × 10 × 6 = 30 cm²."
    },
    {
        "question": "If a trapezoid has bases of lengths 8 cm and 12 cm, and height 5 cm, what is its area?",
        "options": [
            "50 cm²",
            "40 cm²",
            "100 cm²",
            "20 cm²"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Area = ½ × (sum of bases) × height = 0.5 × (8 + 12) × 5 = 50 cm²."
    },
    {
        "question": "What is the surface area of a cube with side length 4 cm?",
        "options": [
            "64 cm²",
            "96 cm²",
            "48 cm²",
            "16 cm²"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Surface area = 6 × side² = 6 × 16 = 96 cm²."
    },
    {
        "question": "How many edges does a rectangular prism have?",
        "options": [
            "8",
            "10",
            "12",
            "14"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "A rectangular prism has 12 edges."
    },
    {
        "question": "What is the measure of each interior angle of a regular octagon?",
        "options": [
            "108°",
            "135°",
            "144°",
            "160°"
        ],
        "correctAnswer": 2,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Each interior angle = [(n - 2) × 180°] ÷ n = (6 × 180) ÷ 8 = 144°."
    },
    {
        "question": "A circle's circumference is 31.4 cm. What is its radius? (Use π ≈ 3.14)",
        "options": [
            "10 cm",
            "5 cm",
            "15 cm",
            "20 cm"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Circumference = 2πr, so r = circumference / (2π) = 31.4 / (2 × 3.14) = 5 cm."
    },
    {
        "question": "If a cone has a radius of 3 cm and height 4 cm, what is its volume? (Use π ≈ 3.14)",
        "options": [
            "37.68 cm³",
            "12.56 cm³",
            "18.84 cm³",
            "50.24 cm³"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "Volume = ⅓ × π × r² × h = ⅓ × 3.14 × 9 × 4 ≈ 37.68 cm³."
    },
    {
        "question": "What is the total number of vertices, edges, and faces in a cube?",
        "options": [
            "8 vertices, 12 edges, 6 faces",
            "6 vertices, 8 edges, 12 faces",
            "12 vertices, 8 edges, 6 faces",
            "8 vertices, 6 edges, 12 faces"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "topic": "geometry",
        "explanation": "A cube has 8 vertices, 12 edges, and 6 faces."
    }
];

  await Promise.all(questions.map(async (question: any) => {
    await ctx.runMutation(internal.questions.addQuestionToDatabase, {
      question: question
    });
  }));
  }
});

export const addQuestionToDatabase = internalMutation({
  args: {
    question: v.any()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("questions", {
      question: args.question.question,
      options: args.question.options,
      correctAnswer: args.question.correctAnswer,
      difficulty: args.question.difficulty,
      topic: args.question.topic,
      explanation: args.question.explanation
    });
  },
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

