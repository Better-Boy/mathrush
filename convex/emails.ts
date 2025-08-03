import { internalQuery, internalMutation, internalAction, action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal, components, api } from "./_generated/api";
import { Resend, vEmailId, vEmailEvent } from '@convex-dev/resend';
import { generateMathQuestion, getTopNews, getMathConcept } from "./openai";
import { generateWeeklyDigestEmail, generateGameResultEmail, generateDailyQuestionEmail } from "./utils";

export const resend: Resend = new Resend(components.resend, {
  testMode: false, // Set to false for production
  onEmailEvent: internal.emails.handleEmailEvent,
});

export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (ctx, args) => {
    const recepientEmailId = args.event.data.to.at(0);
    if(!recepientEmailId) return;
    if(args.event.data.from.includes("MathRush Game Invite")){
      const invite = await ctx.db
      .query("gameInvitations")
      .withIndex("by_email", (q) => q.eq("email", recepientEmailId))
      .filter((q) => q.eq(q.field("resendId"), args.id))
      .first();

    if (!invite) return;

    if(invite.emailStatus === args.event.type) return;

    let existingStatus = invite.emailStatus;
    let newStatus = args.event.type.replace("email.", "");
    
    if(existingStatus === newStatus) return;

    await ctx.db.patch(invite._id, {
        emailStatus: newStatus
      });
    }

  },
});

export const getGameResultData = internalQuery({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;

    const participants = await ctx.db
      .query("gameParticipants")
      .withIndex("by_game_player", (q) => q.eq("gameId", args.gameId))
      .collect();

    const sortedParticipants = participants.sort((a, b) => b.score - a.score);

    const participantDetails = await Promise.all(
      sortedParticipants.map(async (participant) => {
        const player = await ctx.db.get(participant.playerId);
        const emailPrefs = await ctx.db
          .query("emailPreferences")
          .withIndex("by_player", (q) => q.eq("playerId", participant.playerId))
          .unique();

        return {
          username: player?.username,
          score: participant.score,
          mailPref: emailPrefs?.gameResults,
          email: emailPrefs?.email
        };
      })
    );

    return participantDetails;
  },
});

export const sendPostGameMail = mutation({
  args: {
    gameId: v.id("games"),
    timeLeft: v.number()
  },
  handler: async (ctx, args) => {
    let delay = args.timeLeft;
    if(delay < 0) delay = 0;
    await ctx.scheduler.runAfter(delay * 1000, internal.emails.sendGameResultEmails, {
      gameId: args.gameId
    });
  },
});

export const sendGameResultEmails = internalMutation({
  args: {
    gameId: v.id("games")
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.emails.updateGameStatus, {
      gameId: args.gameId
    });

    const gameData = await ctx.runQuery(internal.emails.getGameResultData, {
      gameId: args.gameId,
    });

    if(!gameData) return;

    const emailContent = generateGameResultEmail(gameData);

    for (const participant of gameData) {
      if (!participant.mailPref || !participant.email) continue;

      try {
        await resend.sendEmail(ctx, {
          from: "MathRush Game Invite <mail@mathrush.online>",
          to: participant.email,
          subject: `🎯 Your MathRush quiz Results - Score: ${participant.score}`,
          html: emailContent,
        });
      } catch (error) {
        console.error(`Failed to send email to ${participant.email}:`, error);
      }
    }
  },
});

export const updateGameStatus = internalMutation({
  args: {
    gameId: v.id("games")
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;

    await ctx.db.patch(game._id, {
      status: "finished"
    })
  },
});

export const sendDailyQuestion = internalAction({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Generate daily question
    const questionData = await generateMathQuestion("medium", ["algebra", "arithmetic", "geometry"]);

    const emailContent = generateDailyQuestionEmail(questionData);

    // Send to subscribed users
    const subscribers = await ctx.runQuery(internal.emails.getDailyQuestionSubscribers, {});

    for (const subscriber of subscribers) {

      try {
        await resend.sendEmail(ctx, {
          from: "MathRush <mail@mathrush.online>",
          to: subscriber.email,
          subject: `🧮 Daily Math Challenge - ${today}`,
          html: emailContent,
        });
      } catch (error) {
        console.error(`Failed to send daily question to ${subscriber.email}:`, error);
      }
    }
  },
});


export const sendWeeklyDigest = internalAction({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];

    const subscribers = await ctx.runQuery(internal.emails.getWeeklyDigestSubscribers, {});

    // const topNewsData = await getTopNews();
    const mathConceptData = await getMathConcept();
    const emailContent = generateWeeklyDigestEmail(mathConceptData);

    for (const subscriber of subscribers) {

      try {
        await resend.sendEmail(ctx, {
          from: "MathRush <mail@mathrush.online>",
          to: subscriber.email,
          subject: `🧮 Weekly Digest - ${today}`,
          html: emailContent,
        });
      } catch (error) {
        console.error(`Failed to send daily question to ${subscriber.email}:`, error);
      }
    }
  },
});

export const getDailyQuestionSubscribers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db
      .query("emailPreferences")
      .filter((q) => q.eq(q.field("dailyQuestions"), true))
      .collect();

    return subscribers;
  },
});

export const getWeeklyDigestSubscribers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db
      .query("emailPreferences")
      .filter((q) => q.eq(q.field("weeklyReports"), true))
      .collect();

    return subscribers;
  },
});
