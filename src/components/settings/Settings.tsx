import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Player, EmailPreferences, EmailPreferencesForm } from "../../types/interfaces";
import { FeedbackFormData } from "./types";
import EmailPreferenceCard from "./EmailPreferenceCard";
import LoadingState from "./LoadingState";
import "./style.css";

export function Settings() {
  // Type-safe queries and mutations
  const currentPlayer = useQuery(api.players.getCurrentPlayer) as Player | undefined;
  const emailPreferences = useQuery(api.settings.getEmailPreferences) as EmailPreferences | undefined;
  const updateEmailPreferences = useMutation(api.settings.updateEmailPreferences);
  const submitFeedback = useAction(api.settings.submitFeedback);
  
  // Form state
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormData>({
    message: "",
    category: "general"
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState<EmailPreferencesForm>({
    dailyQuestions: true,
    weeklyReports: true,
    gameResults: true,
  });

  // Update local state when query result changes
  useEffect(() => {
    if (emailPreferences) {
      setEmailPrefs({
        dailyQuestions: emailPreferences.dailyQuestions ?? true,
        weeklyReports: emailPreferences.weeklyReports ?? true,
        gameResults: emailPreferences.gameResults ?? true,
      });
    }
  }, [emailPreferences]);
  
  // Handle loading states
  if (!currentPlayer || !emailPreferences) {
    return <LoadingState />;
  }
  
  // Email preferences configuration
  const emailPreferenceCards = [
    {
      title: "Daily Math Questions",
      description: "Get a fun math problem delivered to your inbox every day",
      key: "dailyQuestions" as keyof EmailPreferencesForm,
      color: "purple" as const
    },
    {
      title: "Weekly Digest", 
      description: "Get a leaderboard summary, the latest math news, and a brief explanation of a random math concept",
      key: "weeklyReports" as keyof EmailPreferencesForm,
      color: "pink" as const
    },
    {
      title: "Game Result",
      description: "Get your game results along with personalized tips for improvement", 
      key: "gameResults" as keyof EmailPreferencesForm,
      color: "pink" as const
    }
  ];
  
  // Handle email preference changes
  const handleEmailPrefsChange = async (key: keyof EmailPreferencesForm, value: boolean) => {
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
        existingPrefsId: emailPreferences._id,
      });
      toast.success("Email preferences updated! 📧");
    } catch (error) {
      toast.error("Failed to update preferences");
      // Revert on error
      setEmailPrefs(emailPrefs);
      console.error("Failed to update email preferences:", error);
    }
  };
  
  // Handle feedback form changes
  const handleFeedbackChange = (field: keyof FeedbackFormData, value: string) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle feedback submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;
    
    setIsSubmittingFeedback(true);
    try {
      await submitFeedback({
        message: feedbackForm.message.trim(),
        category: feedbackForm.category,
        playerUsername: currentPlayer.username,
        playerEmail: currentPlayer.email,
      });
      toast.success("Feedback submitted! Thank you! 🙏");
      setFeedbackForm({ message: "", category: "general" });
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  
  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-icon">⚙️</div>
        <h1 className="settings-title">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="settings-subtitle">
          Customize your MathRush experience
        </p>
      </div>
      
      {/* Email Preferences */}
      <div className="settings-card">
        <h2 className="settings-card-title">
          📧 Email Subscriptions
        </h2>
        <div className="email-preferences-list">
          {emailPreferenceCards.map((card) => (
            <EmailPreferenceCard
              key={card.key}
              title={card.title}
              description={card.description}
              checked={emailPrefs[card.key]}
              onChange={(value) => handleEmailPrefsChange(card.key, value)}
              color={card.color}
            />
          ))}
        </div>
      </div>
      
      {/* Feedback Form */}
      <div className="settings-card">
        <h2 className="settings-card-title">
          💬 Send Feedback
        </h2>
        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedback-category" className="form-label">
              Category
            </label>
            <select
              id="feedback-category"
              value={feedbackForm.category}
              onChange={(e) => handleFeedbackChange("category", e.target.value as FeedbackFormData['category'])}
              className="form-select"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="feedback-message" className="form-label">
              Message
            </label>
            <textarea
              id="feedback-message"
              value={feedbackForm.message}
              onChange={(e) => handleFeedbackChange("message", e.target.value)}
              placeholder="Tell us what you think! We'd love to hear your ideas, bug reports, or general feedback..."
              className="form-textarea"
              rows={5}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={!feedbackForm.message.trim() || isSubmittingFeedback}
            className="form-button"
          >
            {isSubmittingFeedback ? "Sending..." : "Send Feedback"}
          </button>
        </form>
      </div>
      
      {/* App Info */}
      <div className="settings-card about-section">
        <h2 className="settings-card-title">
          ℹ️ About MathRush
        </h2>
        <div className="about-icon">🧮</div>
        <h3 className="about-title gradient-text">
          MathRush
        </h3>
        <p className="about-description">
          A fun and engaging multiplayer math quiz game designed to help you
          improve your math skills while competing with friends. Challenge
          yourself with various difficulty levels and topics!
        </p>
        <div className="about-version">
          Version 1.0.0 • Built with ❤️ using Convex and React
        </div>
      </div>
    </div>
  );
}