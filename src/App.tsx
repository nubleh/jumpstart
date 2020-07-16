import React, { useState } from 'react';

import styled, { keyframes } from 'styled-components';

import decklist from './data/decklist.json';
import boosterImg from './506px-Jumpstart_Booster.png';

const imgPath = 'https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=';
const linkPath = 'https://gatherer.wizards.com/Pages/Search/Default.aspx?name=';
const lands = [
  'Island',
  'Plains',
  'Mountain',
  'Swamp',
  'Forest',
];

function App() {
  const { data } = decklist;

  const [chosenPacks, setChosenPacks] = useState([] as number[]);

  const [choices, setChoices] = useState([] as number[]);

  const draft3Packs = () => {
    const drafted = [];
    while(drafted.length < 3) {
      const i = Math.floor(Math.random() * data.length);
      const candidate = data[i];
      const chosenNames = drafted.map(i => data[i]).map(deck => deck.shortName);
      if (
        chosenNames.indexOf(candidate.shortName) === -1
        && chosenPacks.indexOf(i) === -1
        && choices.indexOf(i) === -1
      ) {
        drafted.push(i);
      }
    }
    setChoices(drafted);
  };

  const choosePack = (i: number) => {
    return () => {
      setChoices([]);
      setChosenPacks([...chosenPacks, i]);
    };
  };

  const resetPacks = () => {
    setChoices([]);
    setChosenPacks([]);
  };

  const deck = chosenPacks.reduce((carry, next) => {
    const nextDeck = data[next];
    if (!nextDeck) {
      return carry;
    }
    return [
      ...nextDeck.cards,
      ...carry,
    ];
  }, [] as string[]);

  const deckName = chosenPacks.reduce((carry, next) => {
    const nextDeck = data[next];
    if (!nextDeck) {
      return carry;
    }
    if (carry === '') {
      return nextDeck.shortName;
    }
    return carry.trim() + ' + ' + nextDeck.shortName;
  }, '');

  return (
    <Main>
      <button onClick={draft3Packs}>Reveal 3 Packs</button>
      <button onClick={resetPacks}>Reset</button>
      <Choices>
        {choices.map((i, k) => {
          const deck = data[i];
          const frontCard = deck.cards.find(name => lands.indexOf(name) !== -1);
          return <div
            key={deck.name}
            onClick={choosePack(i)}
            style={{
              animationDelay: `${k * 0.3}s`,
            }}
          >
            <ChoiceName>
              {deck.shortName}
            </ChoiceName>
            <Booster>
              <img src={boosterImg}/>
            </Booster>
            <Card><img src={`${imgPath}${frontCard}`}/></Card>
          </div>;
        })}
      </Choices>

      {deck.length > 0 && <Deck>
        <div>
          {deckName} ({deck.length} cards)
        </div>
        {deck.map((card, i) => {
          return <a
          href={`${linkPath}${card}`}
          rel="noopener"
          target="_blank"
          key={`${card}-${i}`}
        >
            <Card>
              <img src={`${imgPath}${card}`}/>
            </Card>
          </a>;
        })}
      </Deck>}
    </Main>
  );
}

const Main = styled.div`
  padding: 20px 40px;

  button {
    cursor: pointer;
  }
`;

const ChoiceName = styled.div`
  background: rgba(0, 0, 0, 0.6);
  display: inline-block;
  padding: 4px 16px;
  font-size: 12px;
  border-radius: 100px;
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 2;
`;

const Card = styled.div`
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  width: 233px;
  height: 310px;
  transition: transform 0.1s;

  > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const Booster = styled.div`
  > img {
    width: 200px;
  }
`;

const appear = keyframes`
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
`;
const Choices = styled.div`
  padding-top: 40px;

  ${Booster} {
    position: relative;
    z-index: 1;
  }
  ${Card} {
    position: absolute;
    z-index: 0;
    top: -10px;
    transform: translateX(-50%) scale(0.7);
    left: 50%;
    transform-origin: center top;
  }

  > div {
    display: inline-block;
    margin: 8px;
    position: relative;
    cursor: pointer;
    transition: opacity 0.1s;
    animation: ${appear} 1s 1;
    animation-fill-mode: forwards;
    transform: translateY(50px);
    opacity: 0;

    &:hover {
      ${Card} {
        transform: translateX(-50%) scale(0.7) translateY(-50px);
      }
    }
  }
`;

const Deck = styled.div`
  margin: 40px 0;
  ${Card} {
    display: inline-block;

    &:hover {
      transform: scale(1.5);
      z-index: 2;
    }
  }
`;

export default App;
