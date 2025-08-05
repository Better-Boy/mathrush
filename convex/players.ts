import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const PROFILE_ICONS = ["🐱", "🐶", "🐸", "🦊", "🐼", "🐨", "🦁", "🐯", "🐰", "🐹", "🐷", "🐮", "🐙", "🦄", "🌟", "⭐", "🎈", "🎨", "🎯", "🚀"];
const PROFILE_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];

export const getCurrentPlayer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const player = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return player;
  },
});

export const createPlayer = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if(!user?.email) return null;
    // Check if username is taken
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existingPlayer) {
      throw new Error("Username already taken");
    }

    // Check if player already exists for this user
    const existingUserPlayer = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingUserPlayer) {
      throw new Error("Player already exists for this user");
    }

    // Create new player with random icon and color
    const randomIcon = PROFILE_ICONS[Math.floor(Math.random() * PROFILE_ICONS.length)];
    const randomColor = PROFILE_COLORS[Math.floor(Math.random() * PROFILE_COLORS.length)];

    const playerId = await ctx.db.insert("players", {
      userId,
      username: args.username,
      profileIcon: randomIcon,
      profileColor: randomColor,
      lastActive: Date.now(),
      email: user.email,
      gamesPlayed: 0,
      overallScore: 0,
      questionsAttempted: 0
    });

    await ctx.db.insert("emailPreferences", {
        playerId,
        dailyQuestions: true,
        weeklyReports: true,
        gameResults: true,
        email: user.email,
    });

    return playerId;
  },
});

export const updateLastActive = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const player = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (player) {
      await ctx.db.patch(player._id, {
        lastActive: Date.now(),
      });
    }
  },
});

export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const players = await ctx.db
      .query("players")
      // .withIndex("by_score", (q) => q.gt("overallScore", 0))
      .order("asc")
      .take(limit);

    return players;
  },
});

export const searchPlayers = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.searchTerm.length < 2) return [];

    const players = await ctx.db.query("players").collect();
    
    return players
      .filter(player => 
        player.username.toLowerCase().includes(args.searchTerm.toLowerCase())
      )
      .slice(0, 10);
  },
});
