import { styles } from './_app.styles';

import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  memo,
} from 'react';
import Square from './Square';
import { useCountDownInterval, Timer } from './Timer';

export type BoardProps = {
  xIsNext: boolean;
  squares: ('X' | 'O' | null)[];
  onPlay: (nextSquares: ('X' | 'O' | null)[], i: number) => void;
  setWinner: (winner: 'X' | 'O' | null) => void;
  winner: 'X' | 'O' | null;
  size: number;
  countTime: number;
  setCountTime: React.Dispatch<React.SetStateAction<number>>;
  //setCountTime: (arg0: number | ((prevCountTime: number) => number)) => void;
};

const Board = memo(function Board({
  xIsNext,
  squares,
  onPlay,
  setWinner,
  winner,
  size,
  countTime,
  setCountTime,
}: BoardProps): JSX.Element {
  useEffect(() => {
    setCountTime(7);
  }, [xIsNext, setCountTime]);

  useCountDownInterval(countTime, setCountTime, setWinner, xIsNext);

  const handleClick = useCallback(
    (i: any) => {
      if (winner || squares[i] || isDraw) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      onPlay(nextSquares, i);
    },

    [squares, xIsNext, onPlay, winner]
  );

  const {
    winner: calcWinner,
    line,
    isDraw,
  } = useMemo(() => calculateWinner(squares, size), [squares, size]);

  useEffect(() => {
    if (calcWinner) {
      setWinner(calcWinner);
    }
  }, [calcWinner, setWinner]);

  const status = useMemo(() => {
    if (winner) {
      setCountTime(0);
      return 'Winner: ' + winner;
    } else if (isDraw) {
      setCountTime(0);
      return 'Draw';
    } else {
      return 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  }, [winner, isDraw, xIsNext, setCountTime]);

  //Timerをけしても再レンダリング起こる。
  return (
    <div>
      <Timer countTime={countTime} />
      <div css={styles.status}>{status}</div>
      <div css={styles.boardRow}>
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          bingoSquare={Boolean(line?.includes(0))}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          bingoSquare={Boolean(line?.includes(1))}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          bingoSquare={Boolean(line?.includes(2))}
        />
      </div>
      <div css={styles.boardRow}>
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          bingoSquare={Boolean(line?.includes(3))}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          bingoSquare={Boolean(line?.includes(4))}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          bingoSquare={Boolean(line?.includes(5))}
        />
      </div>
      <div css={styles.boardRow}>
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          bingoSquare={Boolean(line?.includes(6))}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          bingoSquare={Boolean(line?.includes(7))}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          bingoSquare={Boolean(line?.includes(8))}
        />
      </div>
      <h4 css={styles.h4}>注：行:1,2,3 列:A,B,C</h4>
    </div>
  );
});

type Bingo = ('X' | 'O' | null)[];

function calculateWinner(squares: Bingo, size: number) {
  const findWinningLines = (squares: Bingo) => {
    const range = [...Array(size).keys()];
    const rows = range.map((i) => range.map((j) => i * size + j));
    const columns = range.map((i) => range.map((j) => j * size + i));
    const diagonals = [
      range.map((i) => i * size + i),
      range.map((i) => (i + 1) * size - (i + 1)),
    ];
    return [...rows, ...columns, ...diagonals];
  };

  let lines = findWinningLines(squares);
  let isDraw = true;

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i], isDraw: false };
    }
    console.log([squares[a], squares[b], squares[c]]);
    const hasX = [squares[a], squares[b], squares[c]].includes('X');
    const hasO = [squares[a], squares[b], squares[c]].includes('O');

    if (!(hasX && hasO)) {
      isDraw = false;
    }
  }
  if (isDraw) {
    return { winner: null, line: null, isDraw: true };
  }

  return { winner: null, line: null, isDraw: false };
}

export default Board;

// export default memo(function Board({
//   xIsNext,
//   squares,
//   onPlay,
//   setWinner,
//   winner,
//   size,
//   countTime,
//   setCountTime,
// }: BoardProps): JSX.Element {
//   //親に移動
//   //const [countTime, setCountTime] = useState<number>(5);

//   useEffect(() => {
//     setCountTime(7);
//   }, [xIsNext]);

//   useCountDownInterval(countTime, setCountTime, setWinner, xIsNext);

//   const handleClick = useCallback(
//     (i: number) => {
//       if (winner || squares[i] || isDraw) {
//         return;
//       }
//       const nextSquares = squares.slice();
//       if (xIsNext) {
//         nextSquares[i] = 'X';
//       } else {
//         nextSquares[i] = 'O';
//       }
//       //This just put arguments to handlePlay function
//       onPlay(nextSquares, i);
//       //dependancyの値が変わらない限り新しい関数インスタンスが生成されない
//     },
//     //
//     [squares, xIsNext, onPlay, winner]
//   );

//   type WinnerLine = {
//     winner: 'X' | 'O' | null;
//     line: number[] | null;
//     isDraw: boolean;
//   };

//   const {
//     winner: calcWinner,
//     line,
//     isDraw,
//   }: WinnerLine = useMemo(() => calculateWinner(squares, size), [squares]);

//   //挿入　もし勝者が配列によって決まったならそっちを出す（すぐに実行しないで、依存値が変わるまで待つ）
//   useEffect(() => {
//     if (calcWinner) {
//       setWinner(calcWinner);
//     }
//   }, [calcWinner]);

//   //let status;
//   const status = useMemo(() => {
//     // if (winner) {
//     //   status = 'Winner: ' + winner;
//     //   setCountTime(0);
//     // } else if (isDraw) {
//     //   setCountTime(0);
//     //   status = 'Draw';
//     // } else {
//     //   status = 'Next player: ' + (xIsNext ? 'X' : 'O');
//     // }
//     //秒が変わるごとにステータスが更新されるのをやめたかった　失敗
//     if (winner) {
//       setCountTime(0);
//       return 'Winner: ' + winner;
//     } else if (isDraw) {
//       setCountTime(0);
//       return 'Draw';
//     } else {
//       return 'Next player: ' + (xIsNext ? 'X' : 'O');
//     }
//     //, setCountTime
//   }, [winner, isDraw, xIsNext]);

//   return (
//     <div>
//       <Timer countTime={countTime} />
//       <div css={styles.status}>{status}</div>
//       <div css={styles.boardRow}>
//         <Square
//           value={squares[0]}
//           onSquareClick={() => handleClick(0)}
//           bingoSquare={Boolean(line?.includes(0))}
//         />
//         <Square
//           value={squares[1]}
//           onSquareClick={() => handleClick(1)}
//           bingoSquare={Boolean(line?.includes(1))}
//         />
//         <Square
//           value={squares[2]}
//           onSquareClick={() => handleClick(2)}
//           bingoSquare={Boolean(line?.includes(2))}
//         />
//       </div>
//       <div css={styles.boardRow}>
//         <Square
//           value={squares[3]}
//           onSquareClick={() => handleClick(3)}
//           bingoSquare={Boolean(line?.includes(3))}
//         />
//         <Square
//           value={squares[4]}
//           onSquareClick={() => handleClick(4)}
//           bingoSquare={Boolean(line?.includes(4))}
//         />
//         <Square
//           value={squares[5]}
//           onSquareClick={() => handleClick(5)}
//           bingoSquare={Boolean(line?.includes(5))}
//         />
//       </div>
//       <div css={styles.boardRow}>
//         <Square
//           value={squares[6]}
//           onSquareClick={() => handleClick(6)}
//           bingoSquare={Boolean(line?.includes(6))}
//         />
//         <Square
//           value={squares[7]}
//           onSquareClick={() => handleClick(7)}
//           bingoSquare={Boolean(line?.includes(7))}
//         />
//         <Square
//           value={squares[8]}
//           onSquareClick={() => handleClick(8)}
//           bingoSquare={Boolean(line?.includes(8))}
//         />
//       </div>
//       <h4 css={styles.h4}>注：行:1,2,3 列:A,B,C</h4>
//     </div>
//   );
// });

// type Bingo = ('X' | 'O' | null)[];

// function calculateWinner(squares: Bingo, size: number) {
//   const findWinningLines = (squares: Bingo) => {
//     // const size =;
//     console.log('Sanmoku size is' + size);
//     //Array.prototype.keys()メソッド マスの並びのインデックス　rangeの中身は[0,1,2]
//     const range = [...Array(size).keys()];
//     //ネストしたmap iは行jは列　よって　0*3+0, 0*3+1 0*3+2 で[0,1,2] 内側のmapはincrement j
//     const rows = range.map((i) => range.map((j) => i * size + j));
//     // 0*3+0,1*3+0,2*3+0 で[0,3,6]
//     const columns = range.map((i) => range.map((j) => j * size + i));
//     const taikakusen = [
//       range.map((i) => i * size + i),

//       range.map((i) => (i + 1) * size - (i + 1)),
//     ];

//     //展開して入れる
//     return [...rows, ...columns, ...taikakusen];
//   };
//   let lines = findWinningLines(squares);

//   let isDraw = true;

//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return { winner: squares[a], line: lines[i], isDraw: false };
//     }

//     const hasX = [squares[a], squares[b], squares[c]].includes('X');
//     const hasO = [squares[a], squares[b], squares[c]].includes('O');

//     if (!(hasX && hasO)) {
//       isDraw = false;
//     }
//   }
//   if (isDraw) {
//     return { winner: null, line: null, isDraw: true };
//   }

//   return { winner: null, line: null, isDraw: false };
// }
