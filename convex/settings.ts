import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { resend } from "./emails";

export const getEmailPreferences = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const player = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!player) return null;

    return await ctx.db
      .query("emailPreferences")
      .withIndex("by_player", (q) => q.eq("playerId", player._id))
      .unique();
  },
});


export const updateEmailPreferences = mutation({
  args: {
    dailyQuestions: v.boolean(),
    weeklyReports: v.boolean(),
    gameResults: v.boolean(),
    existingPrefsId: v.id("emailPreferences")
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(args.existingPrefsId, {dailyQuestions: args.dailyQuestions, weeklyReports: args.weeklyReports, gameResults: args.gameResults});
  },
});

export const submitFeedback = action({
  args: {
    message: v.string(),
    category: v.string(),
    playerUsername: v.string(),
    playerEmail: v.string()
  },
  handler: async (ctx, args) => {

    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await resend.sendEmail(ctx, {
            from: "MathRush Feedback <mail@mathrush.online>",
            to: "abhi4567lash@gmail.com",
            subject: `Feedback from ${args.playerUsername}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 5px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px;">
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center;">
                    <h1 style="color: #667eea; font-size: 2.5em; margin-bottom: 10px;">🧮 MathRush</h1>
                    <p style="color: #666; font-size: 1.2em; margin-bottom: 20px;">User Feedback</p>
                    
                    <div style="font-family: 'Segoe UI'; background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="color: #666; font-size: 15px;"> ${args.message} </p>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;"><strong>Feedback Category:</strong> ${args.category} </p>
                    </div>
                    
                    <div>
                    <p style="color: #666; font-size: 1.2em; margin-bottom: 20px;">Submitted by:</p>
                    </div>
                    
                    <div style="font-family: 'Segoe UI'; background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;"><strong>Username:</strong> ${args.playerUsername} </p>
                        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong> ${args.playerEmail} </p>
                        <p style="margin: 0; color: #666; font-size: 14px;"><strong>Date:</strong> ${new Date(Date.now()).toLocaleString()} </p>
                    </div>
                    
                </div>
                </div>
            `,
        });

    return true;
  },
});