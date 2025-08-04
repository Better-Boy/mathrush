import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface DashboardProps {
  setCurrentView: (view: 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings') => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  const currentPlayer = useQuery(api.players.getCurrentPlayer);

  if(!currentPlayer) throw new Error("player not there");

  const leaderboard = useQuery(api.players.getLeaderboard, { limit: 5 });
  const correctAnswers =  currentPlayer.overallScore / 5;
  const winRate = (currentPlayer.questionsAttempted) > 0 
    ? Math.round((correctAnswers / currentPlayer.questionsAttempted) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4"
            style={{ backgroundColor: currentPlayer.profileColor }}
          >
            {currentPlayer.profileIcon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {currentPlayer.username}! 👋
            </h1>
            <p className="text-gray-600">Ready for some math fun?</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions Attempted</p>
              <p className="text-2xl font-bold text-orange-600">{currentPlayer.questionsAttempted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Score</p>
              <p className="text-2xl font-bold text-blue-600">{currentPlayer.overallScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">🎮</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Games Played</p>
              <p className="text-2xl font-bold text-green-600">{currentPlayer.gamesPlayed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-purple-600">{winRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🚀 Start Playing</h3>
          <p className="mb-6 opacity-90">
            Join a game or create your own room to challenge other players!
          </p>
          <button
            onClick={() => setCurrentView('lobby')}
            className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Go to Game Lobby
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🏆 Leaderboard</h3>
          <p className="mb-6 opacity-90">
            See how you rank against other math champions!
          </p>
          <button
            onClick={() => setCurrentView('leaderboard')}
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          >
            View Rankings
          </button>
        </div>
      </div>

      {/* Mini Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🏆 Top Players
          </h3>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((player, index) => (
              <div key={player._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <div className="text-lg font-bold text-gray-500 w-8">
                    #{index + 1}
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3"
                    style={{ backgroundColor: player.profileColor }}
                  >
                    {player.profileIcon}
                  </div>
                  <span className="font-medium text-gray-800">{player.username}</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {player.overallScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
