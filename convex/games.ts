import { query, mutation, action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import { resend } from "./emails";
import { generateInvitationEmail } from "./utils";

// Generate a random 6-character invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const createGame = mutation({
  args: {
    maxQuestions: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    topic: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const player = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!player) throw new Error("Player not found");

    // Generate unique invite code
    let inviteCode: string;
    let existingGame;
    do {
      inviteCode = generateInviteCode();
      existingGame = await ctx.db
        .query("games")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
        .unique();
    } while (existingGame);

    const gameId = await ctx.db.insert("games", {
      hostId: player._id,
      maxQuestions: args.maxQuestions,
      difficulty: args.difficulty,
      topic: args.topic,
      inviteCode: inviteCode,
      status: "waiting",
      date: new Date().toISOString()
    });

    // Host automatically joins the game
    await ctx.db.insert("gameParticipants", {
      gameId: gameId,
      playerId: player._id,
      playerStatus: "active",
      score: 0,
      currentQuestionCount: 0
    });

    return { gameId, inviteCode };
  },
});

export const joinGameByCode = mutation({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const player = await ctx.runQuery(api.players.getCurrentPlayer);

    if (!player) throw new Error("Player not found");

    const game = await ctx.db
      .query("games")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode.toUpperCase()))
      .unique();

    if (!game || !game.inviteCode) throw new Error("Game not found with this invite code");
    
    if (game?.status !== "waiting") throw new Error("Game already started or finished");

    // Check if already joined
    const existingParticipant = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_player", (q) => q.eq("gameId", game._id))
      .filter((q) => q.eq(q.field("playerId"), player._id))
      .unique();

    if (existingParticipant) return game._id;
    
    const inviteThere = await ctx.db
      .query("gameInvitations")
      .withIndex("by_email", (q) => q.eq("email", player.email))
      .filter((q) => q.eq(q.field("gameId"), game._id))
      .first();
    
    if(inviteThere){
      await ctx.db.patch(inviteThere._id, {
        gameJoinStatus: true
    });
    }

    await ctx.db.insert("gameParticipants", {
      gameId: game._id,
      playerId: player._id,
      currentQuestionCount: 0,
      playerStatus: "active",
      score: 0
    });

    return game._id;
  },
});


export const getGameParticipateRecord = internalQuery({
  args: {
    gameId: v.id("games"),
    playerId: v.id("players")
  },
  handler: async (ctx, args) => {
    const existingGameRecord = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_player", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("playerId"), args.playerId))
      .unique();
    
      if(!existingGameRecord) throw new Error("Game participant relationship not found");
      return existingGameRecord;
  },
})

export const markParticipantInactive = mutation({
  args: {
    gameId: v.id("games")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const player = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!player) throw new Error("Player not found");

    const existingGameRecord = await ctx.runQuery(internal.games.getGameParticipateRecord, {gameId: args.gameId, playerId: player._id});

    await ctx.db.patch(existingGameRecord?._id, {
      playerStatus: "inactive"
    });
  },
});

export const sendGameInvitation = action({
  args: {
    gameId: v.id("games"),
    emails: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const gameData = await ctx.runQuery(api.games.getGameForInvitation, {
      gameId: args.gameId,
    });

    if (!gameData || !gameData.inviteCode) throw new Error("Game not found or missing invite code");

    for (const email of args.emails) {

      const emailContent = generateInvitationEmail(gameData);

      try {
        const resendId = await resend.sendEmail(ctx, {
          from: "MathRush Game Invite <mail@mathrush.online>",
          to: email,
          subject: `🎮 You're invited to play MathRush!`,
          html: emailContent,
        });
        
      if(resendId){
        await ctx.runMutation(api.games.saveGameInvitation, {
        gameId: args.gameId,
        email,
        sentBy: gameData.hostId,
        resendId: resendId
      });
      }else{
        throw new Error("Failed to send mail");
      }
      } catch (error) {
        console.error(`Failed to send invitation to ${email}:`, error);
        return false;
      }
    }

    return true;
  },
});

export const getGameForInvitation = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;

    const host = await ctx.db.get(game.hostId);
    
    return {
      ...game,
      host,
    };
  },
});

export const saveGameInvitation = mutation({
  args: {
    gameId: v.id("games"),
    email: v.string(),
    sentBy: v.id("players"),
    resendId: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("gameInvitations", {
      gameId: args.gameId,
      email: args.email,
      sentAt: Date.now(),
      sentBy: args.sentBy,
      emailStatus: "sent",
      resendId: args.resendId,
      gameJoinStatus: false
    });
  },
});

export const startGame = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const player = await ctx.runQuery(api.players.getCurrentPlayer);

    if (!player) throw new Error("Player not found");

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");


    if (game.hostId !== player._id) throw new Error("Only host can start game");
    if (game.status !== "waiting") throw new Error("Game already started");

    await ctx.db.patch(game._id, {
      status: "active"
    });

    await ctx.db.patch(player._id, {
      gamesPlayed: player.gamesPlayed + 1
    });

    return true;
  },
});

export const getGame = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("game not found");

    const participants = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_player", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("playerStatus"), "active"))
      .collect();

    const participantDetails = await Promise.all(
      participants.map(async (participant) => await ctx.db.get(participant.playerId))
    );

    const gameWithAllParticipants: any = await Promise.all(
      participants.map(async (participant) => await ctx.runQuery(api.games.getGameParticipants, {gameId: args.gameId, playerId: participant.playerId}))
    );

    const emailInviteDetails = await ctx.db
      .query("gameInvitations")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("gameJoinStatus"), false))
      .collect();

    return {
      ...game,
      participants: participantDetails,
      gameWithAllParticipants: gameWithAllParticipants,
      invites: emailInviteDetails
    };
  },
});

export const getGameParticipants = query({
  args: {
    gameId: v.id("games"),
    playerId: v.id("players")
  },
  handler : async(ctx, args) => {
    return await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_player", (q) => q.eq("gameId", args.gameId).eq("playerId", args.playerId))
      .unique();
  }
})

export const updateAnswer = mutation({
  args: {
    gameId: v.id("games"),
    questionId: v.id("questions"),
    playerAnswerIndex: v.number(),
    isCorrect: v.boolean()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");    

    let points = 5;

    if(!args.isCorrect) points = -5;

    const player = await ctx.runQuery(api.players.getCurrentPlayer);
    if(!player) throw new Error("Player not found");

    const gameWithPlayersRow = await ctx.db
    .query("gameParticipantQuestion")
    .withIndex("by_game_question_player", (q) => q.eq("gameId", args.gameId).eq("questionId", args.questionId).eq("playerId", player._id))
    .filter((q) => q.eq(q.field("answerGivenByPlayer"), -1))
    .unique();

    if(!gameWithPlayersRow) throw new Error("Game player question not found");

    await ctx.db.patch(gameWithPlayersRow?._id, {
      score: gameWithPlayersRow.score + points,
      answerGivenByPlayer: args.playerAnswerIndex
    });

    await ctx.db.patch(player._id, {
      overallScore: player.overallScore + points
    });
    
    const gameParticipant = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_player", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("playerId"), player._id))
      .unique();

    if(!gameParticipant) throw new Error("Game player not found");
    
    await ctx.db.patch(gameParticipant?._id, {
      score: gameParticipant.score + points
    });

  },
});

export const getAllQuestionWithPlayerGame = query({
  args:{
    gameId: v.id("games"),
    playerId: v.id("players")
  },
  handler: async (ctx, args) => {
    return await ctx.db
    .query("gameParticipantQuestion")
    .withIndex("by_game_player", (q) => q.eq("gameId", args.gameId).eq("playerId", args.playerId))
    .collect();
  },
})
