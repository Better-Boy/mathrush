import { useState, useCallback, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  LeaderboardProps, 
  SEARCH_CONFIG, 
  MESSAGES, 
  ICONS 
} from "./types";
import PlayerCard from "./PlayerCard";
import StatCard from "./StatCard";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import "./style.css";

export function Leaderboard({ className = "", onPlayerClick }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Queries
  const leaderboard = useQuery(api.players.getLeaderboard, { 
    limit: SEARCH_CONFIG.LEADERBOARD_LIMIT 
  });
  
  const searchResults = useQuery(
    api.players.searchPlayers,
    searchTerm.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH ? { searchTerm } : "skip"
  );
  
  // Computed values
  const isSearching = searchTerm.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH;
  const displayPlayers = isSearching ? searchResults : leaderboard;
  
  const stats = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) return null;
    
    return {
      champion: leaderboard[0],
      totalPlayers: leaderboard.length,
      highestScore: leaderboard[0]?.overallScore || 0,
    };
  }, [leaderboard]);
  
  // Event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);
  
  return (
    <div className={`leaderboard-container ${className}`}>
      {/* Header */}
      <header className="leaderboard-header">
        <h1 className="leaderboard-title">
          <span className="gradient-text">{MESSAGES.TITLE}</span>
        </h1>
        <p className="leaderboard-subtitle">
          {MESSAGES.SUBTITLE}
        </p>
      </header>
      
      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder={MESSAGES.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search players"
        />
        <div className="search-icon">
          {ICONS.SEARCH}
        </div>
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="clear-search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Leaderboard */}
      <section 
        className="leaderboard-section"
        aria-label="Player leaderboard"
      >
        {!displayPlayers ? (
          <LoadingSpinner />
        ) : displayPlayers.length === 0 ? (
          <EmptyState isSearching={isSearching} />
        ) : (
          <div className="leaderboard-list">
            {displayPlayers.map((player, index) => {
              const rank = isSearching ? '?' : index + 1;
              const isTopThree = typeof rank === 'number' && rank <= 3;
              
              return (
                <PlayerCard
                  key={player._id}
                  player={player}
                  rank={rank}
                  isTopThree={isTopThree}
                  onClick={onPlayerClick}
                />
              );
            })}
          </div>
        )}
      </section>
      
      {/* Stats */}
      {stats && (
        <section 
          className="stats-section"
          aria-label="Leaderboard statistics"
        >
          <StatCard
            icon={ICONS.CROWN}
            value={stats.champion.username}
            label={MESSAGES.CURRENT_CHAMPION}
            gradient="bg-gradient-to-r to-yellow-100 from-orange-400"
          />
          
          <StatCard
            icon={ICONS.GAME}
            value={stats.totalPlayers}
            label={MESSAGES.ACTIVE_PLAYERS}
            gradient="bg-gradient-to-br to-blue-100 from-purple-400"
          />
          
          <StatCard
            icon={ICONS.TROPHY}
            value={stats.highestScore}
            label={MESSAGES.HIGHEST_SCORE}
            gradient="bg-gradient-to-br to-green-100 from-teal-400"
          />
        </section>
      )}
    </div>
  );
}