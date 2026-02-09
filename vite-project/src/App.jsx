import { useState, useRef } from 'react'
import './App.css'

function Button({
  text,
  onClick = () => {}, 
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
  const [maxRounds, setMaxRounds] = useState(1) // 1, 3, or 5
  const [round, setRound] = useState(1)
  const [lives, setLives] = useState({ player: 3, computer: 3 })
  const [userChoice, setUserChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [roundResult, setRoundResult] = useState("") // "win", "lose", "tie"
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState("") // "player" or "computer"

  const hoverSound = useRef(null)
  const mapSound = useRef(null)
  const clickSound = useRef(null)
  const domerSound = useRef(null)

const determineWinner = (user, computer) => {
   if (user === computer) return "tie";
   
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
    const computer = Math.floor(Math.random() * 3);
    setUserChoice(choice)
    setComputerChoice(computer)

    const result = determineWinner(choice, computer)
    setRoundResult(result)

    if (result === "win") {
      const newComputerLives = lives.computer - 1;
      setLives({...lives, computer: newComputerLives})

    }
    if (lives.computer === 0) {
      setGameOver(true)
      setWinner("player")
    }
    else if (result === "lose") {
      const newPlayerLives = lives.player - 1
      setLives({ ...lives, player: newPlayerLives })
      
      // Check if computer won the game
      if (newPlayerLives === 0) {
        setGameOver(true)
        setWinner("computer")
      }
    }
    // If tie, no lives lost
    
    // Move to next round if game isn't over
    if (!gameOver && result !== "tie") {
      setRound(round + 1)
    }
    const isSuddenDeath = () => {
    return maxRounds > 1 && lives.player === 1 && lives.computer === 1
    }
    const selectMode = (rounds) => {
      setMaxRounds(rounds)
      setLives({
        player: rounds === 1 ? 1 : 3,
        computer: rounds === 1 ? 1 : 3
      })
    }
     const resetGame = () => {
    setRound(1)
    setLives({ 
      player: maxRounds === 1 ? 1 : 3, 
      computer: maxRounds === 1 ? 1 : 3 
    })
    setUserChoice(null)
    setComputerChoice(null)
    setRoundResult("")
    setGameOver(false)
    setWinner("")
  }
  }

  function enterName() {
    setMode("mode")
  }

  function playGame() {
    setMode("play")
    playSound(mapSound)
  }

  const playSound = (soundRef) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0
      soundRef.current.volume = 1.0
      soundRef.current.play().catch(err => console.error("Audio error:", err))
    }
  }

  return (
    <>
      <audio ref={clickSound} src="/soundEffects/btn-sfx.mp3" preload="auto" />
      <audio ref={mapSound} src="/soundEffects/bass.mp3" preload="auto" />
      <audio ref={hoverSound} src="/soundEffects/Click.wav" preload="auto" />

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
                  text="Enter"
                  className="p-3 enter shadow btn btn-success"
                  clickSound={clickSound}
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

              <Button
                text="Play"
                className="p-3 shadow btn play w-100"
                onClick={playGame}
                clickSound={clickSound}
              />
            </div>
          </>
        )}

        {mode === "play" && (
          <>
          <audio ref={domerSound} src="/soundEffects/domer.mp3" preload="auto" />
            <h1 className="p-2 mb-5 text-white">Round one</h1>
            <h2 className="game-logs text-white">Start the game...</h2>

            <div className="game">
              <div className="bart mb-3">
                <h2 className="fs-1 mb-5 sh shadow border-rounded">❤️❤️❤️</h2>
                <img onClick={() => playSound(domerSound)} src="/Images/realDomer.png" className="bart-img img-fluid mb-3" />
                <h3 className='fs-1'>{name}</h3>
              </div>

              <div className="vs">
                <img src="/Images/vs.png.png" className="img-fluid p-5" />
              </div>

              <div className="homer mb-3">
                <h2 className="fs-1 mb-5 shadow border-rounded">❤️❤️❤️</h2>
                <img src="/Images/Homer.png" className="domer-img mb-3 img-fluid" />
                <h3 className='fs-1'>bad guy</h3>
              </div>
            </div>

            <div className="options d-flex justify-content-center gap-5">
              <Button text="🪨" className="option" onMouseEnter={() => playSound(hoverSound)} clickSound={clickSound} />
              <Button text="📄" className="option" onMouseEnter={() => playSound(hoverSound)} clickSound={clickSound} />
              <Button text="✂️" className="option" onMouseEnter={() => playSound(hoverSound)} clickSound={clickSound} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export { Button }
export default App