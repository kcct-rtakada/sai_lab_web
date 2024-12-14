import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/components/GameCanvas.module.scss';

interface Vec2D {
  x: number;
  y: number;
}

interface Ball {
  pos: Vec2D;
  radius: number;
  sp: Vec2D;
}

interface Block {
  pos: Vec2D;
  size: Vec2D;
  isDestroyed: boolean;
}

interface Paddle {
  size: Vec2D;
  x: number;
}

interface GameObj {
  ball: Ball;
  paddle: Paddle;
  blocks: Block[];
}

function RemToPx(rem: number) {
  var fontSize = getComputedStyle(document.documentElement).fontSize;
  return rem * parseFloat(fontSize);
}

export default function StageComponent({ resetFunc }: { resetFunc: Function }) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [gameScreenSize, setGameSize] = useState<Vec2D>({ x: 1, y: 1 });
  const [isRunning, setIsRunning] = useState(false);
  const [splashText, setSplashText] = useState<string | null>('ボタンを押して開始');
  const mainRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameVarRef = useRef<GameObj>({
    ball: {
      pos: {
        x: 0,
        y: 0,
      },
      sp: {
        x: 1,
        y: -1,
      },
      radius: 15,
    },
    paddle: {
      size: {
        x: 70,
        y: 10,
      },
      x: 0,
    },
    blocks: [],
  });

  const isGameStartedRef = useRef<boolean>(false);

  const drawBall = (context: CanvasRenderingContext2D, ball: Ball) => {
    context.beginPath();
    context.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = '#444';
    context.fill();
    context.closePath();
  };

  const drawPaddle = (context: CanvasRenderingContext2D, paddle: Paddle, canvas: HTMLCanvasElement) => {
    context.beginPath();
    context.roundRect(paddle.x, canvas.height - paddle.size.y, paddle.size.x, paddle.size.y, 5);
    context.fillStyle = '#444';
    context.fill();
    context.closePath();
  };

  const drawBlocks = (context: CanvasRenderingContext2D, blocks: Block[], canvas: HTMLCanvasElement) => {
    var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#E17A7E');
    gradient.addColorStop(0.5, '#5FCB59');
    gradient.addColorStop(1, '#5C9DDE');
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        context.beginPath();
        context.roundRect(block.pos.x, block.pos.y, block.size.x, block.size.y, 5);
        context.fillStyle = gradient;
        context.fill();
        context.closePath();
      }
    });
  };

  const draw = () => {
    if (!isGameStartedRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas || canvas == null) return;
    const context = canvas.getContext('2d');
    if (!context || context == null) return;
    const { ball, paddle, blocks } = gameVarRef.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(context, ball);
    drawPaddle(context, paddle, canvas);
    drawBlocks(context, blocks, canvas);

    if (ball.pos.x + ball.sp.x > canvas.width - ball.radius || ball.pos.x + ball.sp.x < ball.radius) {
      ball.sp.x *= -1;
    }

    if (ball.pos.y + ball.sp.y < ball.radius) {
      ball.sp.y *= -1;
    } else if (ball.pos.y + ball.sp.y > canvas.height - ball.radius) {
      if (ball.pos.x > paddle.x - paddle.size.x / 15 && ball.pos.x < paddle.x + paddle.size.x + paddle.size.x / 15) {
        const xPositionRate = (ball.pos.x - (paddle.x + paddle.size.x / 2)) / (paddle.size.x / 2);

        const reflectionAngle = (xPositionRate * Math.PI) / 4;
        const speedBoostMultiplier = 1.025;

        const speed = Math.sqrt(ball.sp.x * ball.sp.x + ball.sp.y * ball.sp.y) * speedBoostMultiplier;
        ball.sp.x = Math.sin(reflectionAngle) * speed;
        ball.sp.y = -Math.cos(reflectionAngle) * speed;
      } else {
        setSplashText('ゲームオーバー');
        gameVarRef.current.blocks = [];
        isGameStartedRef.current = false;
        setIsRunning(false);
        return;
      }
    }

    // 配列削除よりも問題が発生しにくい
    let allDestroyed = true;
    if (blocks.length == 0) allDestroyed = false;
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        allDestroyed = false;
        if (
          (block.pos.x <= ball.pos.x &&
            ball.pos.x <= block.pos.x + block.size.x &&
            ball.pos.y + ball.radius >= block.pos.y &&
            ball.pos.y + ball.radius <= block.pos.y + 5) ||
          (block.pos.x <= ball.pos.x &&
            ball.pos.x <= block.pos.x + block.size.x &&
            ball.pos.y - ball.radius >= block.pos.y + 5 &&
            ball.pos.y - ball.radius <= block.pos.y + block.size.y)
        ) {
          ball.sp.y *= -1;
          block.isDestroyed = true;
        }
        if (
          (ball.pos.x + ball.radius <= block.pos.x + 5 &&
            block.pos.x <= ball.pos.x + ball.radius &&
            ball.pos.y >= block.pos.y &&
            ball.pos.y <= block.pos.y + block.size.y) ||
          (ball.pos.x + ball.radius <= block.pos.x + block.size.x &&
            block.pos.x + block.size.x - 5 <= ball.pos.x - ball.radius &&
            ball.pos.y >= block.pos.y &&
            ball.pos.y <= block.pos.y + block.size.y)
        ) {
          ball.sp.x *= -1;
          block.isDestroyed = true;
        }
      }
    });

    if (allDestroyed) {
      setSplashText('ゲームクリア！！！');
      gameVarRef.current.blocks = [];
      allDestroyed = false;
      isGameStartedRef.current = false;
      setIsRunning(false);
      return;
    }

    ball.pos.x += ball.sp.x;
    ball.pos.y += ball.sp.y;

    requestAnimationFrame(draw);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas || canvas == null) return;
    const { paddle } = gameVarRef.current;
    const relativeMouseX = e.clientX - canvas.offsetLeft;
    if (relativeMouseX > 0 && relativeMouseX < canvas.width) {
      paddle.x = relativeMouseX - paddle.size.x / 2;
    }
  };

  const touchMoveHandler = (e: TouchEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas || canvas == null) return;
    const { paddle } = gameVarRef.current;
    const relativeTapX = e.changedTouches[0].pageX - canvas.offsetLeft;
    if (relativeTapX > 0 && relativeTapX < canvas.width) {
      paddle.x = relativeTapX - paddle.size.x / 2;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas || canvas == null) return;
    const mainDiv = mainRef.current as HTMLDivElement;
    if (!mainDiv || mainDiv == null) return;

    if ((!isRunning && initialized) || (isRunning && gameVarRef.current.blocks.length == 0)) {
      const { ball, paddle } = gameVarRef.current;
      ball.radius = canvas.width / 50;
      ball.pos.x = Math.random() * (canvas.width - 3 * ball.radius) + ball.radius;
      ball.pos.y = (Math.random() * canvas.height) / 2 + ball.radius;

      ball.sp.x = canvas.width / 200 > canvas.height / 200 ? canvas.width / 200 : canvas.height / 200;
      ball.sp.y = canvas.width / 200 > canvas.height / 200 ? canvas.width / 200 : canvas.height / 200;

      paddle.x = (canvas.width - paddle.size.x) / 2;
      paddle.size.x = canvas.width / 5;
      paddle.size.y = canvas.height / 50;

      const gameMode = Math.trunc(Math.random() * 6);

      let blockRows = 0;
      let blockColumns = 0;
      let blockBitArray: number[][] = [];

      if (gameMode == 0) {
        blockRows = 15;
        blockColumns = 13;

        blockBitArray = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
          [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
      } else if (gameMode == 1) {
        blockRows = 16;
        blockColumns = 16;

        blockBitArray = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
      } else if (gameMode == 2) {
        blockRows = 16;
        blockColumns = 16;

        blockBitArray = [
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        ];
      } else if (gameMode == 3) {
        blockRows = 8;
        blockColumns = 13;

        blockBitArray = [
          [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
          [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
          [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
          [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
      } else if (gameMode == 4) {
        blockRows = 18;
        blockColumns = 32;

        blockBitArray = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
      } else if (gameMode == 5) {
        blockRows = 15;
        blockColumns = 15;

        blockBitArray = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
      }

      for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
          if (blockBitArray[r][c] == 0) continue;
          gameVarRef.current.blocks.push({
            pos: {
              x:
                c * (canvas.width / (blockColumns + 2) + canvas.width / (blockColumns + 2) / (blockColumns + 1)) +
                canvas.width / (blockColumns + 2) / 2,
              y:
                r * (canvas.height / (blockRows + 2) + canvas.height / (blockRows + 3) / (blockRows + 2)) +
                canvas.height / (blockRows + 2) / 4,
            },
            size: {
              x: canvas.width / (blockColumns + 2),
              y: canvas.height / (blockRows + 2),
            },
            isDestroyed: false,
          });
        }
      }
    }

    mainDiv.addEventListener('mousemove', mouseMoveHandler);
    mainDiv.addEventListener('touchmove', touchMoveHandler);

    return () => {
      mainDiv.removeEventListener('mousemove', mouseMoveHandler);
      mainDiv.removeEventListener('touchmove', touchMoveHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isRunning]);

  const startGame = () => {
    if (!isGameStartedRef.current) {
      isGameStartedRef.current = true;
      setIsRunning(true);
      setSplashText(null);
      draw();
    }
  };

  const endGame = () => {
    gameVarRef.current.blocks = [];
    isGameStartedRef.current = false;
    setIsRunning(false);
    setSplashText('ゲーム終了');
  };

  useEffect(() => {
    if (!initialized) {
      setGameSize({
        x: window.innerWidth,
        y: window.innerHeight,
      });

      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var cx = 0;
  var cy = 0;
  if (
    (gameScreenSize.x > 800 ? 800 : gameScreenSize.x) <
    (gameScreenSize.y - RemToPx(15) > 600 ? 600 : gameScreenSize.y - RemToPx(15))
  ) {
    cx = gameScreenSize.x > 800 ? 800 : gameScreenSize.x;
    cy = (cx * 3) / 4;
  } else {
    cy = gameScreenSize.y - RemToPx(15) > 600 ? 600 : gameScreenSize.y - RemToPx(15);
    cx = (cy * 4) / 3;
  }

  return (
    <div className={styles.main} ref={mainRef}>
      <canvas className={`${isRunning ? styles.running : ''}`} ref={canvasRef} width={cx} height={cy} />
      {splashText ? (
        <div className={styles.splash_box}>
          <p className={styles.splash_text}>{splashText}</p>
          <button
            className={styles.return_button}
            onClick={() => {
              setSplashText('見つけてくれてありがとう！');
              resetFunc();
            }}
            title='見つけてくれてありがとう！'
          >
            トップへ戻る
          </button>
        </div>
      ) : (
        <></>
      )}

      <div className='start-button'>
        <button
          className={styles.start_button}
          onClick={() => {
            if (!isRunning) startGame();
            else endGame();
          }}
          title={isRunning ? 'ゲームを終了する' : 'ゲームを開始する'}
        >
          {isRunning ? 'ゲーム終了' : 'ゲーム開始'}
        </button>
      </div>
    </div>
  );
}
