import { useState, useEffect } from "react";
import personService from "./services/persons";

const Filter = ({ onChange }) => {
  return (
    <div>
      filter shown with <input onChange={onChange}></input>
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  handleAddButton,
  handleOnChangeName,
  handleOnChangeNumber,
}) => {
  return (
    <form onSubmit={handleAddButton}>
      <div>
        name: <input value={newName} onChange={handleOnChangeName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleOnChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ personsToShow, setPersons, setPersonsToShow, persons }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <Person
          key={person.name}
          person={person}
          setPersons={setPersons}
          setPersonsToShow={setPersonsToShow}
          persons={persons}
        ></Person>
      ))}
    </ul>
  );
};

const Person = (props) => {
  const onClickDelete = (person) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${person.name} from your contacts?`
      )
    ) {
      personService
        .deletePerson(person.id)
        .then((response) => {
          console.log(
            `The contact ${person.name}:${person.number} has been deleted from the server`
          );
          // Delete the contact in the browser states
          let newPersons = props.persons.filter((p) => p.id != person.id);

          props.setPersons(newPersons);
          props.setPersonsToShow(newPersons);
        })
        .catch((error) => {
          console.log(
            `Unable to delete the contact ${person.name}:${person.number}. ${error}`
          );
        });
    }
  };

  return (
    <li>
      {props.person.name}: {props.person.number}{" "}
      <button
        onClick={() => {
          onClickDelete(props.person);
        }}
      >
        delete
      </button>
    </li>
  );
};

const Notification = ({ message, errorFlag }) => {
  let style = {
    fontSize: 20,
    color: "green",
    borderColor: "green",
    background: "lightgrey",
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (errorFlag) {
    style = { ...style, color: "red", borderColor: "red" };
  }

  if (message === null) {
    return null;
  }

  return <div style={style}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [personsToShow, setPersonsToShow] = useState(persons);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorFlag, setErrorFlag] = useState(false);

  useEffect(() => {
    console.log("efect");
    personService.getAllPersons().then((allPersons) => {
      console.log("promise fulfilled");
      setPersons(allPersons);
      refreshPersonsToShow(allPersons);
    });
  }, []);

  const handleAddButton = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);

    // Check if the person already exists
    if (persons.some((person) => person.name == newName)) {
      let samePerson = persons.find((p) => p.name === newName);
      // Check if the number is not the same saved already
      if (samePerson.number !== newNumber) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          let updatedPerson = { ...samePerson, number: newNumber };
          personService
            .updatePerson(samePerson.id, updatedPerson)
            .then((response) => {
              console.log(
                `The phone number of ${newName} has been updated to: ${newNumber}`
              );
              let newPersons = persons.map((p) =>
                p.id !== samePerson.id ? p : response
              );
              setPersons(newPersons);
              setPersonsToShow(newPersons);
              showNotification(
                `The number of ${newName} has been updated to: ${newNumber}`
              );
            })
            .catch((error) => {
              console.log(
                `Unable to update the phone number of ${newName} to ${newNumber}: ${error}`
              );
              if (error.response.status == 404) {
                showNotification(
                  `Information of ${newName} has already been removed from server`,
                  true
                );
              }
            });
        }
      } else {
        alert(
          `${newName} is already added to phonebook with the given number: ${newNumber}`
        );
      }
    } else {
      // save the new person to the server
      let newContact = { name: newName, number: newNumber };
      personService
        .createPerson(newContact)
        .then((addedPerson) => {
          let newPersons = persons.concat(addedPerson);
          setPersons(newPersons);
          //Change personsToShow to show the new person added
          refreshPersonsToShow(newPersons);
          setNewName("");
          setNewNumber("");
          console.log(
            `Contact ${addedPerson.name}: ${addedPerson.number} was saved to the server`
          );
          showNotification(`Added ${newName}`);
        })
        .catch((error) => {
          console.log(
            `Unable to save the given contact to the server: ${error}`
          );
        });
    }
  };

  const refreshPersonsToShow = (persons) => {
    setPersonsToShow(
      persons.filter((person) =>
        person.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  };

  const showNotification = (message, isError = false) => {
    setNotificationMessage(message);

    if (isError) {
      setErrorFlag(true);
    }

    setTimeout(() => {
      setNotificationMessage(null);

      if (isError) {
        setErrorFlag(false);
      }
    }, 5000);
  };

  const handleOnChangeName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleOnChangeNumber = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleOnChangeFilterShown = (event) => {
    console.log(event.target.value);
    //Change personsToShow
    setPersonsToShow(
      persons.filter((person) =>
        person.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setFilterValue(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        errorFlag={errorFlag}
      ></Notification>
      <Filter onChange={handleOnChangeFilterShown}></Filter>
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleAddButton={handleAddButton}
        handleOnChangeName={handleOnChangeName}
        handleOnChangeNumber={handleOnChangeNumber}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        setPersons={setPersons}
        setPersonsToShow={setPersonsToShow}
        persons={persons}
      ></Persons>
    </div>
  );
};

export default App;
