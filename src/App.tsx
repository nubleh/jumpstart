import React, { useState } from 'react';

import styled, { keyframes, css } from 'styled-components';

import decklist from './data/decklist.json';
import boosterImg from './506px-Jumpstart_Booster.png';

const imgPath = 'https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=';
const linkPath = 'https://gatherer.wizards.com/Pages/Search/Default.aspx?name=';
const imgPathById = 'https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';
const linkPathById = 'https://gatherer.wizards.com/Pages/Card/Details.aspx?printed=true&multiverseid=';
const lands = [
  'Island',
  'Plains',
  'Mountain',
  'Swamp',
  'Forest',
];
const idMap: { [key: string]: number } = {
  'Wizards Island': 489631,
  'Well-Read Island': 489637,
  'Under the Sea Island': 489630,
  'Spirits Island': 489635,
  'Pirates Island': 489636,
  'Milling Island': 489634,
  'Archaeology Island': 489633,
  'Above the Clouds Island': 489632,
  'Rainbow Terramorphic Expanse': 489662,
  'Walls Forest': 489659,
  'Tree-Hugging Forest': 489654,
  'Predatory Forest': 489660,
  'Plus One Forest': 489656,
  'Lands Forest': 489655,
  'Elves Forest': 489661,
  'Dinosaurs Forest': 489657,
  'Cats Forest': 489658,
  'Spellcasting Mountain': 489650,
  'Smashing Mountain': 489651,
  'Seismic Mountain': 489648,
  'Minotaurs Mountain': 489653,
  'Lightning Mountain': 489652,
  'Goblins Mountain': 489649,
  'Dragons Mountain': 489646,
  'Devilish Mountain': 489647,
  'Unicorns Plains': 489625,
  'Legion Plains': 489622,
  'Heavily Armored Plains': 489627,
  'Feathered Friends Plains': 489628,
  'Enchanted Plains': 489626,
  'Dogs Plains': 489629,
  'Doctor Plains': 489623,
  'Angels Plains': 489624,
  'Witchcraft Swamp': 489643,
  'Vampires Swamp': 489644,
  'Spooky Swamp': 489645,
  'Rogues Swamp': 489641,
  'Reanimated Swamp': 489640,
  'Phyrexian Swamp': 489642,
  'Minions Swamp': 489638,
  'Discarding Swamp': 489639,

  // plain ones
  'Swamp': 488467,
  'Plains': 488461,
  'Forest': 488473,
  'Mountain': 488470,
  'Island': 488464,
};

const arenaAlts: { [key: string]: string } = {
  'Chain Lightning': 'Lightning Strike',
  'Lightning Bolt': 'Lightning Strike',
  'Ball Lightning': 'Lightning Serpent',
  'Ajani\'s Chosen': 'Archon of Sun\'s Grace',
  'Angelic Arbiter': 'Serra\'s Guardian',
  'Draconic Roar': 'Scorching Dragonfire',
  'Goblin Lore': 'Goblin Oriflamme',
  'Flametongue Kavu': 'Fanatic of Mogis',
  'Exhume': 'Bond of Revival',
  'Fa\'adiyah Seer': 'Dryad Greenseeker',
  'Mausoleum Turnkey': 'Audacious Thief',
  'Path to Exile': 'Banishing Light',
  'Read the Runes': 'Gadwick, the Wizened',
  'Reanimate': 'Doomed Necromancer',
  'Rhystic Study': 'Teferi\'s Ageless Insight',
  'Sheoldred, Whispering One': 'Carnifex Demon',
  'Scourge of Nel Toth': 'Woe Strider',
  'Scrounging Bandar': 'Pollenbright Druid',
  'Thought Scour': 'Weight of Memory',
  'Time to Feed': 'Prey Upon'
};

function App() {
  const { data } = decklist;

  const [chosenPacks, setChosenPacks] = useState([] as number[]);
  const [choices, setChoices] = useState([] as number[]);
  const [isArena, setIsArena] = useState(false);

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
      // ...nextDeck.cards.map(card => {
      //   const matchingLand = lands.find(land => {
      //     const variantName = `${nextDeck.shortName.toLowerCase()} ${land.toLowerCase()}`;
      //     return variantName === card.toLowerCase();
      //   });
      //   if (matchingLand) {
      //     return matchingLand;
      //   }
      //   return card;
      // }),
      ...nextDeck.cards.map(card => {
        if (isArena && arenaAlts[card]) {
          return arenaAlts[card];
        }
        return card;
      }),
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

  const switchMode = () => {
    setIsArena(!isArena);
  };

  return (
    <Main>
      <Controls>
        <Switch active={isArena ? 2 : 1} onClick={switchMode}>
          <span>Paper</span>
          <span>Arena</span>
        </Switch>
        <button onClick={draft3Packs}>Reveal 3 Packs</button>
        <button onClick={resetPacks}>Reset</button>
        <a
          href='https://magic.wizards.com/en/articles/archive/feature/jumpstart-decklists-2020-06-18'
          rel='noopener'
          target='_blank'
        >
          decklist came from here
        </a>
        <a
          href='https://magic.wizards.com/en/articles/archive/news/jumpstart-cards-being-replaced-mtg-arena-2020-06-17'
          rel='noopener'
          target='_blank'
        >
          arena replacements here
        </a>
        <a
          href='https://github.com/nubleh/jumpstart'
          rel='noopener'
          target='_blank'
        >
          source available on github
        </a>
        {choices.length > 0 && <Choices>
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
              {frontCard && <Card><img src={getImagePath(frontCard)}/></Card>}
            </div>;
          })}
        </Choices>}
      </Controls>

      {deck.length > 0 && <Deck>
        <div>
          {deckName} ({deck.length} cards)
        </div>
        {deck.map((card, i) => {
          const url = card.indexOf('http') === -1 ? getImagePath(card) : card;
          const link = idMap[card] ? `${linkPathById}${idMap[card]}` : `${linkPath}${card}`;
          return <a
            href={link}
            rel="noopener"
            target="_blank"
            key={`${card}-${i}`}
          >
            <Card>
              <img src={url}/>
            </Card>
          </a>;
        })}
      </Deck>}
    </Main>
  );
}

const Controls = styled.div`
  position: fixed;
  top: 0;
  padding: 20px 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.3);
  left: 0;
  width: 100%;
`;

interface SwitchProps {
  active: number;
}
const Switch = styled.div<SwitchProps>`
  display: inline-block;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  margin: 0 16px;
  user-select: none;

  > span {
    padding: 0 16px;
    display: inline-block;
    border-radius: 30px;
    transition: background 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }

  ${({ active }) => css`
    > span:nth-child(${active}) {
      background: rgba(0, 0, 0, 0.6);
    }
  `}
`;

const Main = styled.div`
  padding: 20px 40px;

  button {
    cursor: pointer;
  }

  a {
    color: #fff;
    margin-left: 20px;
    font-size: 12px;
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
  margin: 80px 0;
  ${Card} {
    display: inline-block;

    &:hover {
      transform: scale(1.5);
      z-index: 2;
    }
  }
`;

function getImagePath(card: string) {
  if (idMap[card]) {
    return `${imgPathById}${idMap[card]}`;
  }
  return `${imgPath}${card}`;
}

export default App;
