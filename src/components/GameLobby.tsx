/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface GameLobbyProps {
  setCurrentView: (view: 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings') => void;
  setCurrentGameId: (id: Id<"games"> | null) => void;
}

export function GameLobby({ setCurrentView, setCurrentGameId }: GameLobbyProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [gameSettings, setGameSettings] = useState({
    maxQuestions: 10,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    topic: 'addition',
  });

  const createGame = useMutation(api.games.createGame);
  const joinGameByCode = useMutation(api.games.joinGameByCode);

  const handleCreateGame = async () => {
    try {
      const result = await createGame(gameSettings);
      setCurrentGameId(result.gameId);
      setCurrentView('game');
      toast.success(`Game created! Invite code: ${result.inviteCode}`);
    } catch {
      toast.error("Failed to create game");
    }
  };

  const handleJoinGame = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    try {
      const gameId = await joinGameByCode({ inviteCode: inviteCode.trim().toUpperCase() });
      setCurrentGameId(gameId);
      setCurrentView('game');
      toast.success("Joined game!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join game");
    }
  };

  const availableTopics = [
    'addition', 'subtraction', 'multiplication', 'division'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🎮 Game Lobby
        </h1>
        <p className="text-gray-600 text-lg">Create a game or join with an invite code!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-center">
        {/* Create Game Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ✨ New Game
          </h2>
          
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={gameSettings.maxQuestions}
                  onChange={(e) => setGameSettings({
                    ...gameSettings,
                    maxQuestions: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setGameSettings({
                        ...gameSettings,
                        difficulty: level
                      })}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                        gameSettings.difficulty === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Math Topics
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTopics.map((topic) => (
                    <label key={topic} className="flex items-center">
                      <input
                        type="radio"
                        checked={gameSettings.topic === topic}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGameSettings({
                              ...gameSettings,
                              topic: topic
                            });
                          } else {
                            setGameSettings({
                              ...gameSettings,
                              topic: ''
                            });
                          }
                        }}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCreateGame}
                  disabled={gameSettings.topic.length === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create 🚀
                </button>
              </div>
            </div>
        </div>

        {/* Join Game Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🎯 Join Game
          </h2>
          
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Ask your friend for their game's invite code
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleJoinGame}
                  disabled={inviteCode.length !== 6}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enter Game 🎯
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
