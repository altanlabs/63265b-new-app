import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import confetti from 'canvas-confetti';

type Operation = 'suma' | 'resta' | 'multiplicacion' | 'division' | 'tablas';

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

const MathGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = useCallback(() => {
    const operations: Operation[] = ['suma', 'resta', 'multiplicacion', 'division', 'tablas'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case 'suma':
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 100);
        answer = num1 + num2;
        break;
      case 'resta':
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case 'multiplicacion':
        num1 = Math.floor(Math.random() * 12);
        num2 = Math.floor(Math.random() * 12);
        answer = num1 * num2;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10);
        num1 = num2 * answer;
        break;
      case 'tablas':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 0;
        num2 = 0;
        answer = 0;
    }

    return { num1, num2, operation, answer };
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(120);
    setCurrentQuestion(generateQuestion());
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setScore(prev => prev - 3);
    }
    
    setUserAnswer('');
    setCurrentQuestion(generateQuestion());
  };

  const getOperationSymbol = (operation: Operation) => {
    switch (operation) {
      case 'suma': return '+';
      case 'resta': return '-';
      case 'multiplicacion': return '×';
      case 'division': return '÷';
      case 'tablas': return '×';
      default: return '';
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
      setShowResult(true);
    }
  }, [gameStarted, timeLeft]);

  if (showResult) {
    return (
      <Card className="p-6 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">¡Juego terminado!</h2>
        <p className="text-xl mb-4">Tu puntuación final: {score}</p>
        <Button onClick={() => {
          setShowResult(false);
          setScore(0);
        }} className="w-full">
          Jugar de nuevo
        </Button>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <Card className="p-6 max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">¡Matemáticas Divertidas! 🎮</h1>
        <p className="mb-4">¿Estás listo para practicar matemáticas?</p>
        <Button onClick={startGame} className="w-full">
          ¡Empezar a jugar!
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <Progress value={(timeLeft / 120) * 100} className="w-full h-3" />
        <p className="text-center mt-2">Tiempo restante: {timeLeft} segundos</p>
      </div>
      
      <Card className="p-6">
        <div className="text-center mb-4">
          <p className="text-xl font-bold">Puntuación: {score}</p>
        </div>
        
        {currentQuestion && (
          <div className="text-center mb-6">
            <p className="text-3xl font-bold mb-4">
              {currentQuestion.num1} {getOperationSymbol(currentQuestion.operation)} {currentQuestion.num2} = ?
            </p>
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-2xl mb-4"
              placeholder="Tu respuesta"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  checkAnswer();
                }
              }}
            />
            <Button onClick={checkAnswer} className="w-full">
              Comprobar
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MathGame;