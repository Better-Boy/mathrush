import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface GameRoomProps {
  gameId: Id<"games">;
  setCurrentView: (view: 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings') => void;
  setCurrentGameId: (id: Id<"games"> | null) => void;
}

interface Question {
  _id: Id<"questions">,
  question: string,
  options: [],
  correctAnswer: number,
  difficulty: "easy" | "medium" | "hard",
  topic: string,
  explanation: string
}

export function GameRoom({ gameId, setCurrentView, setCurrentGameId }: GameRoomProps) {
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const game = useQuery(api.games.getGame, { gameId });
  const startGame = useMutation(api.games.startGame);
  const currentPlayer = useQuery(api.players.getCurrentPlayer);
  const sendInvitation = useAction(api.games.sendGameInvitation);
  const getNextQuestion = useMutation(api.questions.getNextQuestion);
  const updateAnswer = useMutation(api.games.updateAnswer);
  const markParticipantInactive = useMutation(api.games.markParticipantInactive);
  const sendMailAfterGame = useMutation(api.emails.sendPostGameMail);
  if(!currentPlayer) throw new Error("player not there");
  const currentPlayerGameDetails = game?.participants.find((p: any) => p.playerId === currentPlayer._id);
  const isHost = game?.hostId === currentPlayer._id;

  useEffect(() => {
    const addNextQuestion = async () =>{
      const currentQuestion = await getNextQuestion({
      gameId: gameId
    }); 
    setCurrentQuestion(currentQuestion);
    };
    if(game?.status === 'active') {
      addNextQuestion();
      setIsReady(true);
    }
  }, [game?.status]);
  
  useEffect(() => {
    const sendMail = async () =>{
      await sendMailAfterGame({
      gameId: gameId,
      timeLeft: timeLeft
    }); 
    };

    if(isHost && gameFinished){
      sendMail();
    }
  }, [gameFinished]);

  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isReady && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setExpired();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReady, timeLeft]);

  if (!game || !currentPlayer) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  const setExpired = async () => {
    setGameFinished(true);
  };

  const handleSendInvitations = async () => {
    
    if (!inviteEmails.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }

    const existingInvites = game.invites.map(invite => invite.email) ?? [];

    const emails = [...new Set(inviteEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0 && !existingInvites.includes(email)))];

      if(emails.length == 0){
        toast.info("No new invites to be sent");
        setShowInviteModal(false);
        setInviteEmails("");
        return;
      }
  

    try {
      await sendInvitation({ gameId, emails });
      toast.success(`Invitations sent to ${emails.length} email${emails.length > 1 ? 's' : ''}!`);
      setShowInviteModal(false);
      setInviteEmails("");
    } catch (error) {
      toast.error("Failed to send invitations");
      console.log(error);
    }
  };

  const handleNextQuestion = async () => {
    if(gameFinished || currentPlayerGameDetails.currentQuestionCount == game.maxQuestions){
      setGameFinished(true);
      return;
    }
    const currentQuestion = await getNextQuestion({
      gameId: gameId
    });   
    setCurrentQuestion(currentQuestion);

    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSubmitAnswer = async (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    const isCorrect = optionIndex === currentQuestion?.correctAnswer;
    if(currentQuestion?._id){
      await updateAnswer({
        gameId,
        questionId: currentQuestion?._id,
        playerAnswerIndex: optionIndex,
        isCorrect: isCorrect
    });
    }
    try {
      if(isCorrect){
      toast.success(`Correct! +5 points! 🎉`);
      }else{
        toast.error(`Incorrect! -5 points 😔`);
      }
    } catch (error) {
      toast.error("Failed to submit answer");
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleStartGame = async () => {
    try {
      await startGame({ gameId });
      toast.success("Game started!");
    } catch (error) {
      toast.error("Failed to start game");
    }
  };

  const handleLeaveGame = async () => {
    await markParticipantInactive({gameId});
    toast.info(currentPlayer.username + " left")
    setCurrentGameId(null);
    setCurrentView('lobby');
  };

  const copyInviteCode = () => {
    if (game?.inviteCode) {
      navigator.clipboard.writeText(game.inviteCode);
      toast.success("Invite code copied to clipboard!");
    }
  };

  if (!game || !currentPlayer) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (game?.status === 'waiting') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🎮 Game Lobby</h1>
            <p className="text-gray-600">Waiting for the host to start the game...</p>
          </div>

          {/* Invite Code Section */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Invite Code</h3>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-300">
                  <span className="text-3xl font-mono font-bold text-blue-600 tracking-widest">
                    {game.inviteCode}
                  </span>
                </div>
                <button
                  onClick={copyInviteCode}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📋 Copy
                </button>
              </div>
              <p className="text-sm text-blue-600 mt-2">Share this code with friends to join!</p>
              
              {isHost && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📧 Send Email Invites
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Game Settings</h3>
              <div className="space-y-2 text-gray-600">
                <div>📊 Questions: {game.maxQuestions}</div>
                <div>🎯 Difficulty: {game.difficulty}</div>
                <div>📚 Topic: {game.topic}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Players
              </h3>
              <div className="space-y-2">
                {game.participants.map((participant: any) => (
                  <div key={participant._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3"
                      style={{ backgroundColor: participant?.profileColor }}
                    >
                      {participant?.profileIcon}
                    </div>
                    <span className="font-medium text-gray-800">
                      {participant?.username}
                      {participant._id === game.hostId && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Host
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {game.invites.map((invite, index) => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 border-2 border-orange-300"
    >
     ? 
    </div>
    <div className="flex flex-col">
      <span className="font-medium text-gray-800 mb-2">
        player {index + 1}
        <span className="ml-2 text-xs px-2 py-1 rounded-full border-2 border-orange-300">
          invite {invite.emailStatus}
        </span>
      </span>
      {isHost && (
        <span className="text-sm text-gray-600 mt-1">
          {invite.email}
        </span>
      )}
    </div>
  </div>
))}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {isHost && (
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
              >
                Start Game 🚀
              </button>
            )}
            {!isHost && (<button
              onClick={handleLeaveGame}
              className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Leave Game
            </button>)}
          </div>
        </div>

        {/* Email Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📧 Send Email Invites</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses (comma-separated)
                  </label>
                  <textarea
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder="friend1@example.com, friend2@example.com"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSendInvitations}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Invites
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteEmails("");
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if(gameFinished){
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🏆 Game Finished!
            </h1>
            {timeLeft <= 0 && (
              <p className="text-red-600 text-lg">
              Time's Up!!
            </p>
            )}
            <p className="text-gray-600 text-lg">Check your email for results. Don't forget to enable "Game Result" in settings.</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentView('lobby')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Play Again 🎮
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-purple-600">
              Question {currentPlayerGameDetails.currentQuestionCount} of {game.maxQuestions}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-green-600'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {currentQuestion?.question || "No question"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => handleSubmitAnswer(index)}
                disabled={showResult || gameFinished}
                className={`p-4 rounded-xl text-left font-medium transition-all transform hover:scale-105 disabled:transform-none ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : isSelected
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                    : 'bg-blue-50 border-2 border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showResult && currentQuestion?.explanation && (
          <div className="mt-6 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Explanation</h3>
                <p className="text-blue-700 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Players */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Players</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {game.participants
            .map((participant:any) => (
            <div key={participant._id} className="text-center p-3 bg-gray-50 rounded-xl">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto mb-2"
                style={{ backgroundColor: participant?.profileColor }}
              >
                {participant?.profileIcon}
              </div>
              <div className="font-medium text-gray-800 text-sm">
                {participant?.username}
              </div>
              <div className="text-lg font-bold text-purple-600">
                {participant?.score}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
              onClick={handleNextQuestion}
              className="bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Next Question
            </button>
       {!isHost && (<button
              onClick={handleLeaveGame}
              className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Leave Game
            </button>)}
        </div>
    </div>
  );
}
