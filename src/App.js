import Die from './components/Die'
import React from 'react'
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

function App(){

    function generateNewDie(){
        return {
            id: nanoid(),
            value: Math.ceil(Math.random() * 6),
            isHeld: false
        }
    }

    function allNewDie(){
        const n_dice = 10;
        let dice=[]
        for (let i=0; i<n_dice; i++){
            dice.push(generateNewDie());
        }
        return dice;
    }

    function rollDice(){
        if (tenzies){
            setDice(allNewDie());
            setTenzies(false);
            setCount(1);
        } else {
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }));
            setCount((count) => count+1);
        }
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die =>  {
            return die.id === id ? {...die, isHeld: !die.isHeld} :  die
        }))
    }

    function resetScore(){
        localStorage.clear();
        setLowScore(localStorage.getItem("lowScore"));
    }

    const [dice, setDice] = React.useState(allNewDie());
    const [tenzies, setTenzies] = React.useState(false);
    const [count, setCount] = React.useState(1);
    const [lowScore, setLowScore] = React.useState(localStorage.getItem("lowScore"));

    React.useEffect(() => {
        const oneValue = dice[0].value;
        const wonState = dice.every(die => die.isHeld && die.value === oneValue);
        if (wonState) {
            setTenzies(true);
        }

    }, [dice])

    React.useEffect(() => {
        if (tenzies && (count < lowScore || lowScore == null)){
            localStorage.setItem("lowScore", count);
            setLowScore(count);
        }
    }, [tenzies]) // eslint-disable-line react-hooks/exhaustive-deps

    const diceElements = dice.map(die => {
        return <Die 
        key={die.id} 
        value={die.value} 
        isHeld={die.isHeld} 
        holdDice={()  => holdDice(die.id)}
    />
    })

    return (
        <>
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.<br/>Try to beat you LowScore! (You can reset it if it seems unbeatable.)</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button onClick={rollDice} className="roll-dice">{tenzies ? "New Game" : "Roll"}</button>
            <p>Your current number of rolls: {count}</p>
            <div className="results">
                {!(lowScore === null) &&
                    <>
                    <p className="results--lowscore">Score to beat: {lowScore}</p>
                    <p className="results--button">
                        <button onClick={resetScore} className="results--reset">Reset LowScore</button>
                    </p>
                    </>
                }
            </div>
        </main>
        <footer>
            Check out <a href="https://www.scrimba.com/learn/learnreact">this</a> course to learn how to build this project and more.
        </footer>
        </>

    )
}

export default App