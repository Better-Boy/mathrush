import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const leaderboard = useQuery(api.players.getLeaderboard, { limit: 50 });
  const searchResults = useQuery(
    api.players.searchPlayers,
    searchTerm.length >= 2 ? { searchTerm } : "skip"
  );

  const displayPlayers = searchTerm.length >= 2 ? searchResults : leaderboard;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600 text-lg">See who's leading the math challenge!</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        {!displayPlayers ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
          </div>
        ) : displayPlayers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😔</div>
            <p className="text-gray-600">
              {searchTerm.length >= 2 ? "No players found" : "No players yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayPlayers.map((player, index) => {
              const rank = searchTerm.length >= 2 ? '?' : index + 1;
              const isTopThree = typeof rank === 'number' && rank <= 3;
              
              return (
                <div 
                  key={player._id} 
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl font-bold w-12 text-center ${
                      rank === 1 ? 'text-yellow-600' :
                      rank === 2 ? 'text-gray-500' :
                      rank === 3 ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {rank === 1 ? '🥇' : 
                       rank === 2 ? '🥈' : 
                       rank === 3 ? '🥉' : 
                       `#${rank}`}
                    </div>
                    
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: player.profileColor }}
                    >
                      {player.profileIcon}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">
                        {player.username}
                      </div>
                      <div className="text-sm text-gray-600">
                        {player.gamesPlayed} games played
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {player.overallScore}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl mb-2">👑</div>
            <div className="text-2xl font-bold">{leaderboard[0]?.username}</div>
            <div className="opacity-90">Current Champion</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl mb-2">🎮</div>
            <div className="text-2xl font-bold">{leaderboard.length}</div>
            <div className="opacity-90">Active Players</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold">
              {leaderboard[0]?.overallScore || 0}
            </div>
            <div className="opacity-90">Highest Score</div>
          </div>
        </div>
      )}
    </div>
  );
}
