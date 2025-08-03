import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PlayerProfile() {
  const currentPlayer = useQuery(api.players.getCurrentPlayer);

  if(!currentPlayer) return null;
const correctAnswers =  currentPlayer.overallScore / 5;
  const winRate = (currentPlayer.questionsAttempted) > 0 
    ? Math.round((correctAnswers / currentPlayer.questionsAttempted) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          👤 Player Profile
        </h1>
        <p className="text-gray-600 text-lg">Your math journey stats and achievements</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center justify-center mb-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mr-6"
            style={{ backgroundColor: currentPlayer.profileColor }}
          >
            {currentPlayer.profileIcon}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentPlayer.username}</h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-3xl font-bold text-orange-600">
              {currentPlayer.questionsAttempted}
            </div>
            <div className="text-sm text-gray-600 mt-1">Questions Attempted</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">{currentPlayer.overallScore}</div>
            <div className="text-sm text-gray-600 mt-1">Total Score</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600">{currentPlayer.gamesPlayed}</div>
            <div className="text-sm text-gray-600 mt-1">Games Played</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">{winRate}%</div>
            <div className="text-sm text-gray-600 mt-1">Accuracy</div>
          </div>
        </div>
      </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🏆 Achievements
          </h3>
          <div className="space-y-3">
            {currentPlayer.gamesPlayed >= 1 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-2xl mr-3">🎮</span>
                <div>
                  <div className="font-semibold text-yellow-800">First Game</div>
                  <div className="text-sm text-yellow-600">Played your first math quiz</div>
                </div>
              </div>
            )}
            {currentPlayer.gamesPlayed >= 10 && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl mr-3">🔥</span>
                <div>
                  <div className="font-semibold text-blue-800">Getting Warmed Up</div>
                  <div className="text-sm text-blue-600">Played 10 games</div>
                </div>
              </div>
            )}
            {currentPlayer.overallScore >= 50 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <div className="font-semibold text-green-800">Sharp Shooter</div>
                  <div className="text-sm text-green-600">50 correct answers</div>
                </div>
              </div>
            )}
            {winRate >= 80 && currentPlayer.gamesPlayed >= 5 && (
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl mr-3">🏆</span>
                <div>
                  <div className="font-semibold text-purple-800">Math Master</div>
                  <div className="text-sm text-purple-600">80%+ accuracy</div>
                </div>
              </div>
            )}
            {currentPlayer.gamesPlayed === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🌟</div>
                <p>Play your first game to unlock achievements!</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
