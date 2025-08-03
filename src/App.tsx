import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { GameLobby } from "./components/GameLobby";
import { GameRoom } from "./components/GameRoom";
import { Leaderboard } from "./components/Leaderboard";
import { CreatePlayer } from "./components/CreatePlayer";
import { PlayerProfile } from "./components/PlayerProfile";
import { Settings } from "./components/Settings";

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings'>('dashboard');
  const [currentGameId, setCurrentGameId] = useState<Id<"games"> | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Authenticated>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🧮 MathRush
              </div>
                <nav className="hidden md:flex space-x-6">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'dashboard' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView('lobby')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'lobby' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Play Game
                  </button>
                  <button
                    onClick={() => setCurrentView('leaderboard')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'leaderboard' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Leaderboard
                  </button>
                  <button
                    onClick={() => setCurrentView('profile')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'profile' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setCurrentView('settings')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'settings' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Settings
                  </button>
                </nav>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      </Authenticated>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Content 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          currentGameId={currentGameId}
          setCurrentGameId={setCurrentGameId}
        />
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
}

function Content({ 
  currentView, 
  setCurrentView, 
  currentGameId, 
  setCurrentGameId 
}: {
  currentView: string;
  setCurrentView: (view: 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings') => void;
  currentGameId: Id<"games"> | null;
  setCurrentGameId: (id: Id<"games"> | null) => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const currentPlayer = useQuery(api.players.getCurrentPlayer);

  if (loggedInUser === undefined || currentPlayer === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Unauthenticated>
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🧮 MathRush
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the fun multiplayer math adventure! Challenge friends, learn new concepts, and become a math champion! 🏆
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        {!currentPlayer ? (
          <CreatePlayer />
        ) : (
          <>
            {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
            {currentView === 'lobby' && (
              <GameLobby 
                setCurrentView={setCurrentView} 
                setCurrentGameId={setCurrentGameId}
              />
            )}
            {currentView === 'game' && currentGameId && (
              <GameRoom 
                gameId={currentGameId} 
                setCurrentView={setCurrentView}
                setCurrentGameId={setCurrentGameId}
              />
            )}
            {currentView === 'leaderboard' && <Leaderboard />}
            {currentView === 'profile' && <PlayerProfile />}
            {currentView === 'settings' && <Settings />}
          </>
        )}
      </Authenticated>
    </div>
  );
}
