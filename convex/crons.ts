import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Daily Math question",
  { hourUTC: 17, minuteUTC: 30 },
  internal.emails.sendDailyQuestion,
);

crons.weekly(
  "Weekly Digest",
  {
    dayOfWeek: "tuesday",
    hourUTC: 17,
    minuteUTC: 30,
  },
  internal.emails.sendWeeklyDigest,
);

export default crons;