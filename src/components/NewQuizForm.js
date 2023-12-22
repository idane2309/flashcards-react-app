import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../app/routes";
// import selectors
import { selectTopics } from "../features/topics/TopicsSlice"
import { addQuiz } from "../features/quizzes/QuizzesSlice"
import { addCard } from "../features/cards/CardsSlice"

export default function NewQuizForm() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [topicId, setTopicId] = useState("");
  const navigate = useNavigate();
  const topics = useSelector(selectTopics); 
  const topicsArray = Object.values(topics);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.length === 0) {
      alert('Please enter a quiz name.');
      return;
    }
  
    if (cards.length === 0) {
      alert('Please add at least one card.');
      return;
    }
  
    for (let card of cards) {
      if (card.front.trim() === '' || card.back.trim() === '') {
        alert('Please fill in both sides of all cards.');
        return;
      }
    }

    // Check for valid topic selection
    if (!topicId || !topics[topicId]) {
      alert('Please select a valid topic.');
      return;
    }

    const cardIds = [];

    // create the new cards here and add each card's id to cardIds
    // create the new quiz here
    cards.forEach((card) => {
      const cardId = uuidv4()
      cardIds.push(cardId)
      // dispatch add card action
      dispatch(addCard({ id: cardId, front: card.front, back: card.back}))
    })

    const quizId = uuidv4();

    // dispatch add quiz action 
    dispatch(addQuiz({ id: quizId, name, topicId, cardIds }))
    navigate(ROUTES.quizzesRoute())
  };

  const addCardInputs = (e) => {
    e.preventDefault();
    setCards(cards.concat({ front: "", back: "" }));
  };

  const removeCard = (e, index) => {
    e.preventDefault();
    setCards(cards.filter((card, i) => index !== i));
  };

  const updateCardState = (index, side, value) => {
    const newCards = cards.slice();
    newCards[index][side] = value;
    setCards(newCards);
  };

  return (
    <section>
      <h1>Create a new quiz</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="quiz-name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Quiz Title"
        />
        <select
          id="quiz-topic"
          onChange={(e) => setTopicId(e.currentTarget.value)}
          placeholder="Topic"
        >
          <option value="">Topic</option>
          {Object.values(topics).map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        
        {topicsArray.length === 0 && (
          <div className="warning-message">
            <p>No topics available. Please create a new topic first in the 'Topics' tab.</p>
          </div>
        )}


        {cards.length > 0 && <h2>Cards</h2>}

        {cards.map((card, index) => (
          <div key={index} className="card-front-back">
            <input
              id={`card-front-${index}`}
              value={cards[index].front}
              onChange={(e) =>
                updateCardState(index, "front", e.currentTarget.value)
              }
              placeholder="Front"
            />

            <input
              id={`card-back-${index}`}
              value={cards[index].back}
              onChange={(e) =>
                updateCardState(index, "back", e.currentTarget.value)
              }
              placeholder="Back"
            />

            <button
              onClick={(e) => removeCard(e, index)}
              className="remove-card-button"
            >
              Remove Card
            </button>
          </div>
        ))}
        <div className="actions-container">
          <button onClick={addCardInputs}>Add a Card</button>
          <button type="submit">Create Quiz</button>
        </div>
      </form>
    </section>
  );
}
