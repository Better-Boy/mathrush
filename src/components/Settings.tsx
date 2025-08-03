import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";



export function Settings() {
    const currentPlayer = useQuery(api.players.getCurrentPlayer);
    if (!currentPlayer) return null;
    
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const emailPreferences = useQuery(api.settings.getEmailPreferences);
  const updateEmailPreferences = useMutation(api.settings.updateEmailPreferences);
  const submitFeedback = useAction(api.settings.submitFeedback);

  const [emailPrefs, setEmailPrefs] = useState({
    dailyQuestions: true,
    weeklyReports: true,
    gameResults: true
  });

  // Update local state when query result changes
  useEffect(() => {
    if (emailPreferences) {
      setEmailPrefs({
        dailyQuestions: emailPreferences.dailyQuestions ?? true,
        weeklyReports: emailPreferences.weeklyReports ?? true,
        gameResults: emailPreferences.gameResults ?? true
      });
    }
  }, [emailPreferences]);

  const handleEmailPrefsChange = async (key: string, value: boolean) => {
    if (!emailPreferences) {
        console.error("No existing preferences ID found");
        return;
    }

    // Optimistically update UI
    const newPrefs = { ...emailPrefs, [key]: value };
    setEmailPrefs(newPrefs);

    try {
      await updateEmailPreferences({ 
        dailyQuestions: newPrefs.dailyQuestions, 
        weeklyReports: newPrefs.weeklyReports,
        gameResults: newPrefs.gameResults,
        existingPrefsId: emailPreferences._id
      });
      toast.success("Email preferences updated! 📧");
    } catch (error) {
      toast.error("Failed to update preferences");
      // Revert on error
      setEmailPrefs(emailPrefs);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    
    setIsSubmittingFeedback(true);
    try {
        await submitFeedback({
            message: feedbackMessage.trim(),
            category: feedbackCategory,
            playerUsername: currentPlayer?.username,
            playerEmail: currentPlayer?.email
        });
      toast.success("Feedback submitted! Thank you! 🙏");
      setFeedbackMessage("");
      setFeedbackCategory("general");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Show loading state while preferences are loading
  if (!emailPreferences) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600 text-lg">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-600 text-lg">Customize your MathRush experience</p>
      </div>

      {/* Email Preferences */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📧 Email Subscriptions</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-800">Daily Math Questions</div>
              <div className="text-sm text-gray-600">Get a fun math problem delivered to your inbox every day</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.dailyQuestions}
                onChange={(e) => handleEmailPrefsChange("dailyQuestions", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-800">Weekly Digest</div>
              <div className="text-sm text-gray-600">Get a leaderboard summary, the latest math news, and a brief explanation of a random math concept</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.weeklyReports}
                onChange={(e) => handleEmailPrefsChange("weeklyReports", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-800">Game Result</div>
              <div className="text-sm text-gray-600">Get your game results along with personalized tips for improvement</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.gameResults}
                onChange={(e) => handleEmailPrefsChange("gameResults", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">💬 Send Feedback</h2>
        
        <form onSubmit={handleFeedbackSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={feedbackCategory}
              onChange={(e) => setFeedbackCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Tell us what you think! We'd love to hear your ideas, bug reports, or general feedback..."
              className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!feedbackMessage.trim() || isSubmittingFeedback}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingFeedback ? "Sending..." : "Send Feedback"}
          </button>
        </form>
      </div>

      {/* App Info */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ℹ️ About MathRush</h2>
        
        <div className="text-center space-y-4">
          <div className="text-6xl">🧮</div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MathRush
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A fun and engaging multiplayer math quiz game designed to help you improve your math skills 
            while competing with friends. Challenge yourself with various difficulty levels and topics!
          </p>
          <div className="text-sm text-gray-500">
            Version 1.0.0 • Built with ❤️ using Convex and React
          </div>
        </div>
      </div>
    </div>
  );
}