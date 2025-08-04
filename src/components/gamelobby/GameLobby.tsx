import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import {  
  CreateGameForm, 
  JoinGameForm, 
  DIFFICULTY_LEVELS 
} from "../../types/interfaces";
import { GameLobbyProps } from "./types";
import { AVAILABLE_TOPICS } from "./constants";
import CreateGameSection from "./CreateGameSection";
import JoinGameSection from "./JoinGameSection";
import "./style.css";

export function GameLobby({ setCurrentView, setCurrentGameId }: GameLobbyProps) {
  // Form state using TypeScript interfaces
  const [joinForm, setJoinForm] = useState<JoinGameForm>({
    inviteCode: ""
  });
  
  const [gameSettings, setGameSettings] = useState<CreateGameForm>({
    maxQuestions: 10,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    topic: 'addition',
  });
  
  // Type-safe mutations
  const createGame = useMutation(api.games.createGame);
  const joinGameByCode = useMutation(api.games.joinGameByCode);
  
  // Handle game creation
  const handleCreateGame = async () => {
    if (!gameSettings.topic) {
      toast.error("Please select a math topic");
      return;
    }
    
    try {
      const result = await createGame(gameSettings);
      setCurrentGameId(result.gameId);
      setCurrentView('game');
      toast.success(`Game created! Invite code: ${result.inviteCode}`);
    } catch (error) {
      toast.error("Failed to create game");
      console.error("Failed to create game:", error);
    }
  };
  
  // Handle joining game
  const handleJoinGame = async () => {
    if (!joinForm.inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }
    
    if (joinForm.inviteCode.length !== 6) {
      toast.error("Invite code must be 6 characters long");
      return;
    }
    
    try {
      const gameId = await joinGameByCode({ 
        inviteCode: joinForm.inviteCode.trim().toUpperCase() 
      });
      setCurrentGameId(gameId);
      setCurrentView('game');
      toast.success("Joined game!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join game";
      toast.error(errorMessage);
      console.error("Failed to join game:", error);
    }
  };
  
  // Handle invite code changes
  const handleInviteCodeChange = (inviteCode: string) => {
    setJoinForm({ inviteCode });
  };
  
  return (
    <div className="game-lobby-container">
      {/* Header */}
      <div className="game-lobby-header">
        <h1 className="game-lobby-title">
          <span className="gradient-text">🎮 Game Lobby</span>
        </h1>
        <p className="game-lobby-subtitle">Create a game or join with an invite code!</p>
      </div>
      
      {/* Main Content Grid */}
      <div className="game-lobby-grid">
        {/* Create Game Section */}
        <CreateGameSection
          gameSettings={gameSettings}
          setGameSettings={setGameSettings}
          onCreateGame={handleCreateGame}
          availableTopics={[...AVAILABLE_TOPICS]}
        />
        
        {/* Join Game Section */}
        <JoinGameSection
          inviteCode={joinForm.inviteCode}
          setInviteCode={handleInviteCodeChange}
          onJoinGame={handleJoinGame}
        />
      </div>
    </div>
  );
}