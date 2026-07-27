const characters = [
  {
    id: 'space-worm',
    name: 'Space Worm',
    title: '🚀 Space Worm',
    description: 'A calm explorer for quiet desktop support.',
    image: '../assets/space-worm.png',
    accent: '#7c3aed',
    animation: {
      idle: { duration: '2.8s', amplitude: '5px' },
      thinking: { duration: '1.6s', amplitude: '7px' },
      speaking: { duration: '0.7s', amplitude: '6px' },
      error: { duration: '0.35s', amplitude: '8px' },
      happy: { duration: '0.9s', amplitude: '8px' }
    }
  },
  {
    id: 'wizard-worm',
    name: 'Wizard Worm',
    title: '🪄 Wizard Worm',
    description: 'A thoughtful guide with a spark of magic.',
    image: '../assets/wizard-worm.png',
    accent: '#0f766e',
    animation: {
      idle: { duration: '2.6s', amplitude: '4px' },
      thinking: { duration: '1.4s', amplitude: '6px' },
      speaking: { duration: '0.65s', amplitude: '5px' },
      error: { duration: '0.3s', amplitude: '7px' },
      happy: { duration: '0.85s', amplitude: '7px' }
    }
  },
  {
    id: 'viking-worm',
    name: 'Viking Worm',
    title: '⚔️ Viking Worm',
    description: 'A bold little adventurer with a cheerful streak.',
    image: '../assets/viking-worm.png',
    accent: '#c2410c',
    animation: {
      idle: { duration: '2.9s', amplitude: '4px' },
      thinking: { duration: '1.5s', amplitude: '6px' },
      speaking: { duration: '0.75s', amplitude: '5px' },
      error: { duration: '0.32s', amplitude: '7px' },
      happy: { duration: '0.88s', amplitude: '7px' }
    }
  }
];

const defaultCharacterId = 'space-worm';

function getCharacterById(id) {
  return characters.find((character) => character.id === id) || characters.find((character) => character.id === defaultCharacterId);
}

module.exports = {
  characters,
  defaultCharacterId,
  getCharacterById
};
