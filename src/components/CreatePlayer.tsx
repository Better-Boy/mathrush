/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function CreatePlayer() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createPlayer = useMutation(api.players.createPlayer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await createPlayer({ username: username.trim() });
      toast.success("Welcome to MathRush! 🎉");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create player");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Player</h2>
          <p className="text-gray-600">Choose a fun username to get started!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              maxLength={20}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Player 🚀"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You'll get a random colorful avatar and can start playing immediately!
          </p>
        </div>
      </div>
    </div>
  );
}
