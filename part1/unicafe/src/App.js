import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  let all = good + neutral + bad;
  let average = (good - bad) / all;
  let positive = (good / all) * 100;

  if (all == 0) return <p>No feedback given</p>;

  return (
    <>
      <h3>statistics</h3>
      <table>
        <tbody>
          <StatisticLine text="good" value={good}></StatisticLine>
          <StatisticLine text="neutral" value={neutral}></StatisticLine>
          <StatisticLine text="bad" value={bad}></StatisticLine>
          <StatisticLine text="all" value={all}></StatisticLine>
          <StatisticLine text="average" value={average}></StatisticLine>
          <StatisticLine text="positive" value={positive + " %"}></StatisticLine>
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClickGood = () => {
    console.log("Good button clicked");
    setGood(good + 1);
  };
  const handleClickNeutral = () => {
    console.log("Neutral button clicked");
    setNeutral(neutral + 1);
  };
  const handleClickBad = () => {
    console.log("Bad button clicked");
    setBad(bad + 1);
  };

  return (
    <div>
      <h3>give feedback</h3>
      <Button onClick={handleClickGood} text="good"></Button>
      <Button onClick={handleClickNeutral} text="neutral"></Button>
      <Button onClick={handleClickBad} text="bad"></Button>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  );
};

export default App;
