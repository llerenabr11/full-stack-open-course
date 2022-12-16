const Course = ({ course }) => {
  return (
    <li>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </li>
  );
};

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = ({ part }) => {
  return (
    <li>
      {part.name} {part.exercises}
    </li>
  );
};

const Content = ({ parts }) => {
  return (
    <ul>
      {parts.map((part) => (
        <Part key={part.id} part={part}></Part>
      ))}
    </ul>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises
    </p>
  );
};

export default Course;
