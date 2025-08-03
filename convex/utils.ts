export function fallbackQuestion(difficulty: string, topic: string) {
  return {
    question: "What is 5 + 3?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
    difficulty,
    topic,
    explanation: "The answer of 5 + 3 is 8."
  };
}

export function fallbackNews(){
    return [
  {
    "title": "Google DeepMind & OpenAI AI Models Win Gold at IMO",
    "summary": "For the first time, AI systems achieved gold‑medal‑level performance at the International Mathematical Olympiad by solving five of six problems in natural language under competition conditions.",
    "url": "https://www.reuters.com/world/asia-pacific/google-openais-ai-models-win-milestone-gold-global-math-competition-2025-07-21/"
  },
  {
    "title": "Human Students Outscore AI at IMO Despite AI Gold-Level Results",
    "summary": "Even though top AI models reached gold medal scores at IMO, 26 human contestants still scored higher—underscoring the enduring strength of human intuition in the toughest math problems.",
    "url": "https://www.wsj.com/tech/ai/imo-gold-math-olympiad-google-deepmind-openai-2450095e"
  },
  {
    "title": "OpenAI: No Fundamental Barrier to AI Matching Expert Mathematicians",
    "summary": "OpenAI’s Noam Brown asserts that recent breakthroughs suggest AI may eventually rival expert mathematicians in reasoning—though human oversight and creativity will remain essential.",
    "url": "https://timesofindia.indiatimes.com/education/news/could-ai-replace-expert-mathematicians-here-is-what-openais-noam-brown-says/articleshow/123043018.cms"
  }
];
}

export function fallbackMathConcept(){
    return {
  "title": "Modular Arithmetic (≡ Modulo)",
  "description": "Modular arithmetic is a system of arithmetic for integers, where numbers wrap around after reaching a certain value called the modulus. It's written as: a ≡ b (mod m), meaning that a and b leave the same remainder when divided by m. This concept is the backbone of many real-world systems, including cryptography, computer science, and even clock arithmetic (e.g., 15 o'clock is 3 PM because 15 ≡ 3 (mod 12)). It helps simplify calculations and analyze repeating patterns.",
  "learnMoreLinks": [
    {
      "text": "Introduction to Modular Arithmetic",
      "url": "https://artofproblemsolving.com/wiki/index.php/Modular_arithmetic/Introduction"
    },
    {
      "text": "Modular Arithmetic in Cryptography",
      "url": "https://en.wikipedia.org/wiki/Modular_arithmetic"
    },
    {
      "text": "How Clocks Use Modular Arithmetic",
      "url": "https://openstax.org/books/contemporary-mathematics/pages/3-7-clock-arithmetic"
    }
  ]
};
}

export function generateGameResultEmail(participants: any) {
  const tableRows = participants.map((player: any, index: any) => `
    <tr style="border-bottom: 1px solid #e9ecef;">
      <td style="padding: 15px 20px; font-weight: bold; color: ${getRankColor(index)};">${getRankDisplay(index)}</td>
      <td style="padding: 15px 20px; font-weight: 600; color: #212529;">${player.username}</td>
      <td style="padding: 15px 20px; text-align: center; font-weight: bold; color: #212529; font-size: 16px;">${player.score}</td>
    </tr>
  `).join('');
  return `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px; font-weight: bold;">🏆 Game Leaderboard</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Current Standings</p>
        </div>

        <!-- Leaderboard Table -->
        <div style="padding: 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <!-- Table Header -->
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 15px 20px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6;">Rank</th>
                        <th style="padding: 15px 20px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6;">Username</th>
                        <th style="padding: 15px 20px; text-align: center; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6;">Score</th>
                    </tr>
                </thead>
                <!-- Table Body -->
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d; font-size: 12px;">Keep playing to climb the leaderboard!</p>
        </div>
    </div>
</body>
  `;
}

const getRankColor = (index: number): string => {
    switch (index) {
      case 0: return '#ffd700'; // Gold
      case 1: return '#c0c0c0'; // Silver
      case 2: return '#cd7f32'; // Bronze
      default: return '#6c757d'; // Gray
    }
  };

const getRankDisplay = (index: number): string => {
    switch (index) {
      case 0: return '🥇 1st';
      case 1: return '🥈 2nd';
      case 2: return '🥉 3rd';
      default: return `${index + 1}th`;
    }
  };

export function generateDailyQuestionEmail(questionData: any) { 
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🧮 Daily Math Challenge</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Ready for today's brain teaser?</p>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Today's Question</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
          <p style="font-size: 18px; font-weight: bold; color: #333; margin: 0;">${questionData.question}</p>
        </div>
        
        <div style="margin: 20px 0;">
          ${questionData.options.map((option: string, index: number) => `
            <div style="background: #f8f9fa; 
                        padding: 12px; margin: 8px 0; border-radius: 8px; 
                        border-left: 4px solid #dee2e6;">
              <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
            </div>
          `).join('')}
        </div>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h4 style="color: #1976d2; margin: 0 0 10px 0;">💡 Explanation</h4>
          <p style="color: #333; margin: 0; line-height: 1.5;">Correct Answer: ${String.fromCharCode(65 + questionData.correctAnswer)}</p>
          <p style="color: #333; margin: 0; line-height: 1.5;">${questionData.explanation}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; font-size: 14px;">Challenge your friends and keep learning! 🌟</p>
      </div>
    </div>
  `;
}


export function generateWeeklyDigestEmail(mathConcept: any) { 
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; padding: 20px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden; position: relative;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 30px; text-align: center; position: relative; overflow: hidden;">
            <h1 style="color: white; font-size: 2em; font-weight: 700; margin-bottom: 8px; position: relative; z-index: 2; margin-top: 0;">MathRush Weekly Digest</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1em; font-weight: 300; position: relative; z-index: 2; margin: 0;">Your curated dose of news and knowledge</p>
            <div style="background: rgba(255, 255, 255, 0.2); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 500; margin-top: 10px; display: inline-block; backdrop-filter: blur(10px); position: relative; z-index: 2;">${getCurrentWeekString()}</div>
        </div>
        
        <div style="padding: 40px 30px;">
            
            <div style="margin-bottom: 40px;">
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; color: #2d3748; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
                    <h2 style="color: #2d3748; margin-bottom: 20px; margin-top: 0; font-size: 1.8em; font-weight: 600; position: relative; text-align: center;">🧮 Math Concept of the Week</h2>
                    <div style="font-size: 1.4em; font-weight: 600; margin-bottom: 15px; position: relative; z-index: 2; color: #2d3748;">${mathConcept.title}</div>
                    <div style="font-size: 1em; line-height: 1.7; color: #4a5568; position: relative; z-index: 2;">
                        ${mathConcept.description}
                    </div>
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                        <h4 style="color: #2d3748; font-size: 0.95em; font-weight: 600; margin-bottom: 10px; margin-top: 0;">Learn More:</h4>
                        ${mathConcept.learnMoreLinks.map((link: any) => `<a href="${link.url}" style="color: #667eea; text-decoration: none; font-size: 0.9em; display: inline-block; margin-right: 15px; margin-bottom: 5px; font-weight: 500; transition: color 0.2s ease;">${link.text}</a>`).join(', ')}
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: #2d3748; color: #a0aec0; text-align: center; padding: 30px; font-size: 0.9em;">
            <p style="margin: 0 0 10px 0;">Thanks for reading! Have feedback or suggestions?</p>
            <p style="margin: 10px 0; margin-top: 10px;">
                <a href="https://mathrush.online/" style="color: #667eea; text-decoration: none; font-weight: 500;">SignIn</a> |
                <a href="https://mathrush.online/" style="color: #667eea; text-decoration: none; font-weight: 500;">feedback</a>
            </p>
            <p style="margin: 15px 0 0 0; opacity: 0.7;">
                © 2025 MathRush. All rights reserved.
            </p>
        </div>
    </div>
    </div>
  `;
}

export function generateWeeklyDigestEmail_(newsData: any, mathConcept: any) { 
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; padding: 20px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden; position: relative;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 30px; text-align: center; position: relative; overflow: hidden;">
            <h1 style="color: white; font-size: 2em; font-weight: 700; margin-bottom: 8px; position: relative; z-index: 2; margin-top: 0;">MathRush Weekly Digest</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1em; font-weight: 300; position: relative; z-index: 2; margin: 0;">Your curated dose of news and knowledge</p>
            <div style="background: rgba(255, 255, 255, 0.2); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 500; margin-top: 10px; display: inline-block; backdrop-filter: blur(10px); position: relative; z-index: 2;">${getCurrentWeekString()}</div>
        </div>
        
        <div style="padding: 40px 30px;">
            <div style="margin-bottom: 40px;">
                <h2 style="color: #2d3748; font-size: 1.8em; font-weight: 600; margin-bottom: 20px; position: relative; text-align: center; margin-top: 0;">🌟 Top News This Week</h2>
                
                ${newsData.map((data: any) => `
                  <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #667eea; transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative; overflow: hidden; cursor: pointer;">
                    <div style="content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite;"></div>
                    <a href="${data.url}" style="color: inherit; text-decoration: none; display: block;">
                        <div style="font-size: 1.2em; font-weight: 600; color: #2d3748; margin-bottom: 8px; line-height: 1.4;">${data.title}</div>
                        <div style="color: #4a5568; font-size: 0.95em; line-height: 1.6;">
                            ${data.summary}</div>
                    </a>
                </div>
                  `).join('')}
                
            </div>
            
            <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 30px 0;"></div>
            
            <div style="margin-bottom: 40px;">
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; color: #2d3748; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
                    <h2 style="color: #2d3748; margin-bottom: 20px; margin-top: 0; font-size: 1.8em; font-weight: 600; position: relative; text-align: center;">🧮 Math Concept of the Week</h2>
                    <div style="font-size: 1.4em; font-weight: 600; margin-bottom: 15px; position: relative; z-index: 2; color: #2d3748;">${mathConcept.title}</div>
                    <div style="font-size: 1em; line-height: 1.7; color: #4a5568; position: relative; z-index: 2;">
                        ${mathConcept.description}
                    </div>
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                        <h4 style="color: #2d3748; font-size: 0.95em; font-weight: 600; margin-bottom: 10px; margin-top: 0;">Learn More:</h4>
                        ${mathConcept.learnMoreLinks.map((link: any) => `<a href="${link.url}" style="color: #667eea; text-decoration: none; font-size: 0.9em; display: inline-block; margin-right: 15px; margin-bottom: 5px; font-weight: 500; transition: color 0.2s ease;">${link.text}</a>`).join(', ')}
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: #2d3748; color: #a0aec0; text-align: center; padding: 30px; font-size: 0.9em;">
            <p style="margin: 0 0 10px 0;">Thanks for reading! Have feedback or suggestions?</p>
            <p style="margin: 10px 0; margin-top: 10px;">
                <a href="https://mathrush.online/" style="color: #667eea; text-decoration: none; font-weight: 500;">SignIn</a> |
                <a href="https://mathrush.online/" style="color: #667eea; text-decoration: none; font-weight: 500;">feedback</a>
            </p>
            <p style="margin: 15px 0 0 0; opacity: 0.7;">
                © 2025 MathRush. All rights reserved.
            </p>
        </div>
    </div>
    </div>
  `;
}


function getCurrentWeekString(){
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    return `Week of ${startOfWeek.toLocaleDateString('en-US', options)}`;
}

export function generateInvitationEmail(gameData: any) {
  const url = `${process.env.SITE_URL || 'http://localhost:5173'}`;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎮 You're Invited!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Join ${gameData.host?.username}'s MathRush Game</p>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Game Details</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
          <div style="margin-bottom: 10px;"><strong>📊 Questions:</strong> ${gameData.maxQuestions}</div>
          <div style="margin-bottom: 10px;"><strong>🎯 Difficulty:</strong> ${gameData.difficulty}</div>
          <div style="margin-bottom: 10px;"><strong>📚 Topics:</strong> ${gameData.topic}</div>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
            <h3 style="color: #1976d2; margin: 0 0 10px 0;">Your Invite Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #1976d2; letter-spacing: 4px; font-family: monospace;">
              ${gameData.inviteCode}
            </div>
          </div>
          <p style="color: #666; font-size: 14px; margin: 0;">
            Enter this code in the Math Quiz app to join the game!
          </p>
        </div>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0;">How to Join</h3>
        <ol style="color: #666; line-height: 1.8;">
          <li>Login (Or SignUp) to <a href=" ${url}">MathRush</a></li>
          <li>Click "Join Game" in the lobby</li>
          <li>Enter the invite code: <strong>${gameData.inviteCode}</strong></li>
          <li>Wait for ${gameData.host?.username} to start the game</li>
          <li>Have fun and show off your math skills! 🧮</li>
        </ol>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; font-size: 14px;">Ready to challenge your brain? Let's do this! 🚀</p>
      </div>
    </div>
  `;
}
