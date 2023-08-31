// 코드를 실행하기 전에 DOM이 완전히 로드될 때까지 기다리기
document.addEventListener('DOMContentLoaded', () => {
  let board = null;
  const game = new Chess();
  const moveHistory = document.getElementById('move-history');
  let moveCount = 1;
  let userColor = 'w'; // 유저의 색깔을 흰색으로 초기화

// 컴퓨터에서의 랜덤한 움직임을 만들기위한 기능
const makeRandomMove = () => {
  const possibleMoves = game.moves();

  if(game.game_over()){
    alert("Checkmate!");
  }else{
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIdx];
    game.move(move);
    board.position(game.fen());
    recordMove(move, moveCount); // 움직임과 그 숫자를 기록하고 나타내기
    moveCount++; 
  }
};

// 기록하고 나타내기 위한 기능 움직임을. 움직임 기록 안에서
const recordMove = (move, count) => {
  const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
  moveHistory.textContent += formattedMove + ' ';
  moveHistory.scrollTop = moveHistory.scrolHeight;
};

// 드래그 포지션의 시작부분을 컨트롤하기위한 기능
const onDragStart = (source, piece) => {
  // 오로지 자기 색깔일 때만 말 움직임이 허락됨.
  return !game.game_over() && piece.search(userColor) === 0;
};

// 판에서 아웃된 것들 컨트롤
const onDrop = (source, target) => {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  if(move === null) return 'snapback';

  window.setTimeout(makeRandomMove, 250);
  recordMove(move.san, moveCount); // 기록하고 나타낸다 움직의 횟수를
  moveCount++;
};

// 스냅 움직임을 조절하기위한 기능
const onSnapEnd = () => {
  board.position(game.fen());
};

//체스판 옵션 선택
const boardConfig = {
  showNotation: true,
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onSnapEnd,
  moveSpeed: 'fast',
  snapBackSpeed: 500,
  snapSpeed: 100,
};

// 체스판 초기화
board = Chessboard('board', boardConfig);

//다시 시작 버튼 실행버튼
document.querySelector('.set-pos').addEventListener('click', () => {
  const fen = prompt("Enter the FEN notation for the desire position!");
  if (fen !== null) {
    if (game.load(fen)) {
      board.position(fen);
      moveHistory.textContent = '';
      moveCount = 1;
      userColor = 'w';
      }else {
      alert("Invalid FEN notation. 다시 해보겠니?")
    }
  }
});

//판을 접기위한 버튼
document.querySelector('.flip-board').addEventListener('click', () => {
  board.flip();
  makeRandomMove();
  // Toggle user's color after flipping the board
  userColor = userColor === 'w'? 'b' : 'w';
});

});




