import { useState } from 'react'

const Button = ({ onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
    )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length))
  const [mostVotedAnecdote, setMostVotedAnecdote]  = useState(0)


  const handleNextAnecdoteClick = () => {
    let random = Math.floor(Math.random() * anecdotes.length)
    console.log("Button clicked.", "Random number --> ", random)
    setSelected(random)
  }

  const handleVoteClick = () => {
    const copyPoints = [ ...points ]
    copyPoints[selected] += 1
    setPoints(copyPoints)
    setMostVotedAnecdote(getMostVotedAnecdote(copyPoints))
    console.log(mostVotedAnecdote)
  }

  // get the anecdote with most votes
  const getMostVotedAnecdote = (points) => {
    let maxVote = points[mostVotedAnecdote]
    let maxIndex = mostVotedAnecdote
    
    for (let i = 0; i < points.length; i++) {

      if (points[i] > maxVote) {
        maxVote = points[i]
        maxIndex = i
      }
    }

    return maxIndex
  }
  
  return (
    <div>
      <h3>Anecdote of the day</h3>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes </p>
      <Button onClick={handleVoteClick} text="vote"></Button>
      <Button onClick={handleNextAnecdoteClick} text="next anecdote"></Button>
      <h3>Anecdote with most votes</h3>
      <p>{anecdotes[mostVotedAnecdote]}</p>
      <p>has {points[mostVotedAnecdote]} votes</p>
    </div>
  )
}

export default App