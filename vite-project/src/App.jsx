import { useState, useRef } from 'react'
import './App.css'

function Button({
  text,
  onClick = () => { },
  onMouseEnter,
  className = "",
  type = "button",
  disabled = false,
  clickSound
}) {

  const handleClick = () => {
    if (clickSound?.current) {
      clickSound.current.currentTime = 0
      clickSound.current.volume = 1.0
      clickSound.current.play()
    }
  }

  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={() => {
        handleClick()
        onClick()
      }}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

function App() {
  const [name, setName] = useState("")
  const [mode, setMode] = useState("start")
  const [maxRounds, setMaxRounds] = useState(3)
  const [round, setRound] = useState(1)
  const [lives, setLives] = useState({ player: 3, computer: 3 })
  const [userChoice, setUserChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [roundResult, setRoundResult] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState("")
  const [gameLog, setGameLog] = useState("")
  const [playerDamage, setPlayerDamage] = useState(false);
  const [computerDamage, setComputerDamage] = useState(false);

  const hoverSound = useRef(null)
  const mapSound = useRef(null)
  const clickSound = useRef(null)
  const domerSound = useRef(null)
  const winSound = useRef(null)
  const ouchSound = useRef(null)
  const loseSound = useRef(null)


  const playSound = (soundRef) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0
      soundRef.current.volume = 1.0
      soundRef.current.play().catch(err => console.error("Audio error:", err))
    }
  }
  const stopSound = (soundRef) => {
  if (soundRef.current) {
    soundRef.current.pause();      // stop it
    soundRef.current.currentTime = 0; // reset to start
  }
}
  const selectMode = (rounds) => {
    setMaxRounds(rounds)
    setLives({
      player: rounds,  // Lives equal to rounds
      computer: rounds
    })
  }

  const isSuddenDeath = () => {
    return maxRounds > 1 && lives.player === 1 && lives.computer === 1
  }
  const takePlayerDamage = () => {
    setPlayerDamage(true);
    setTimeout(() => setPlayerDamage(false), 150)

  }
  const takeComputerDamage = () => {
    setComputerDamage(true);
    setTimeout(() => setComputerDamage(false), 150)
  }
  const resetGame = () => {
    setRound(1)
    setLives({
      player: maxRounds,
      computer: maxRounds
    })
    setUserChoice(null)
    setComputerChoice(null)
    setRoundResult("")
    setGameOver(false)
    setWinner("")
    setGameLog("Game Started!")
    playSound(mapSound)
    stopSound(winSound)
  }

  const determineWinner = (user, computer) => {
    if (user === computer) return "tie" && setGameLog(` ${round}: It's a tie!`)
    else {
      playSound(ouchSound)
    }

    if (
      (user === 0 && computer === 2) ||
      (user === 1 && computer === 0) ||
      (user === 2 && computer === 1)
    ) {
      return "win"
    }
    return "lose"
  }

  const handleChoice = (choice) => {
    const computer = Math.floor(Math.random() * 3)
    setUserChoice(choice)
    setComputerChoice(computer)

    const result = determineWinner(choice, computer)
    setRoundResult(result)

    if (result === "win") {
      setGameLog(` ${round}: You win the round!`)
      takeComputerDamage()
      const newComputerLives = lives.computer - 1
      setLives({ ...lives, computer: newComputerLives })

      if (newComputerLives === 0) {
        setGameOver(true)
        setWinner("player")
        setGameLog(` ${round}: YOU WIN!!!`)
        playSound(winSound)
      }
    } else if (result === "lose") {
      setGameLog(` ${round}: You lose the round!`)
      takePlayerDamage()
      const newPlayerLives = lives.player - 1
      setLives({ ...lives, player: newPlayerLives })

      if (newPlayerLives === 0) {
        setGameOver(true)
        setWinner("computer")
        setGameLog(` ${round}: YOU LOSE!!!`)
        playSound(loseSound)
      }
    }

    if (!gameOver && result !== "tie") {
      setRound(round + 1)
    }
  }

  function enterName() {
    setMode("mode")
  }

  function playGame() {
    setMode("play")
    playSound(mapSound)
    setGameLog("Game started!")
  }



  return (
    <>
      <audio ref={clickSound} src="/RockPaperScissors/soundEffects/btn-sfx.mp3" preload="auto" />
      <audio ref={mapSound} src="/RockPaperScissors/soundEffects/bass.mp3" preload="auto" />
      <audio ref={hoverSound} src="/RockPaperScissors/soundEffects/Click.wav" preload="auto" />
      <audio ref={domerSound} src="/RockPaperScissors/soundEffects/domer.mp3" preload="auto" />

      <div className={mode === "play" ? "play-gradient" : ""}>
        {mode === "start" && (
          <>
            <h1 className="mb-5">Rock Paper Scissors!</h1>

            <div className="container text-center">
              <div className="d-flex align-items-center gap-2 mb-3">
                <input
                  className="form-control p-3 rounded shadow-sm"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Button
                  text="i"
                  className="p-3 enter shadow btn btn-success rounded-circle"
                  clickSound={clickSound}
                  onClick={() => alert("Rock Paper Scissors is a game where Rock beats scissors, paper beats rock, and scissors beats paper")}
                />
              </div>

              <Button
                text="Play"
                className="p-3 shadow btn play w-100"
                onClick={enterName}
                disabled={!name}
                clickSound={clickSound}
              />
            </div>
          </>
        )}

        {mode === "mode" && (
          <>
            <h1 className="mb-5">Choose a Mode!</h1>

            <div className="container text-center w-100">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3 w-100">
                <Button text="Best of 1" className="p-3 shadow btn btn-success" clickSound={clickSound} onClick={() => selectMode(1)} />
                <Button text="Best of 3" className="p-3 shadow btn btn-success" clickSound={clickSound} onClick={() => selectMode(3)} />
                <Button text="Best of 5" className="p-3 shadow btn btn-success" clickSound={clickSound} onClick={() => selectMode(5)} />
              </div>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3 w-100">
              <Button
                text="Play"
                className="p-3 shadow btn play w-100"
                onClick={playGame}
                clickSound={clickSound}
              />
               <Button
                  text="i"
                  className="p-3 enter shadow btn btn-success rounded-circle"
                  clickSound={clickSound}
                  onClick={() => alert("Best of one is one round, best of 3 is three rounds, and so on.")}
                />
                </div>
            </div>
          </>
        )}

        {mode === "play" && (
          <>
            <audio ref={winSound} src="/RockPaperScissors/soundEffects/win.mp3" preload="auto" />
            <audio ref={ouchSound} src="/RockPaperScissors/soundEffects/ouch.mp3" preload="auto" />
            <audio ref={loseSound} src="/RockPaperScissors/soundEffects/lose.mp3" preload="auto" />
            <h1 className="p-2 mb-5 text-white">Round {round}</h1>
            {isSuddenDeath() && <h2 className="text-warning">SUDDEN DEATH!</h2>}
            <h2 className="game-logs text-white">{gameLog}</h2>
            <Button text={gameOver ? "Play Again" : ""} className="p-3 shadow btn btn-success text-white " onClick={gameOver ? resetGame : ""} />

            <div className="game">
              <div className="bart mb-3">
                <h2 className="fs-1 mb-5 sh shadow border-rounded">
                  {"❤️".repeat(lives.player)}
                </h2>
                <img onClick={() => playSound(domerSound)} src="./Images/realDomer.png"  className={`bart-img img-fluid mb-3 ${playerDamage ? "damage" : ""}`} />
                <h3 className='fs-1'>{name}</h3>
              </div>

              <div className="vs">
                <img src="./Images/vs.png.png" className="img-fluid p-5" />
              </div>

              <div className="homer mb-3">
                <h2 className="fs-1 mb-5 shadow border-rounded">
                  {"❤️".repeat(lives.computer)}
                </h2>
                <img src="./Images/Homer.png"  className={`domer-img img-fluid mb-3 ${computerDamage ? "damage" : ""}`} />
                <h3 className='fs-1'>bad guy</h3>
              </div>
            </div>

            <div className="options d-flex justify-content-center gap-5">
              <Button onClick={!gameOver ? () => handleChoice(0) : undefined} text="🪨" className="option" onMouseEnter={() => playSound(hoverSound)} clickSound={clickSound} />
              <Button onClick={!gameOver ? () => handleChoice(1) : undefined} text="📄" className="option" onMouseEnter={() => playSound(hoverSound)} clickSound={clickSound} />
              <Button onClick={!gameOver ? () => handleChoice(2) : undefined} text="✂️" className="option" onMouseEnter={() => playSound(hoverSound)} clickSound={clickSound} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export { Button }
export default App