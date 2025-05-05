import { i18n } from '../i18n';

const getTranslatedDeck = (id, words) => {
  const t = i18n.global.t;
  const deckKey = id.replace('-', '');
  return {
    id,
    name: t(`decks.${deckKey}.name`),
    description: t(`decks.${deckKey}.description`),
    icon: getDeckIcon(id),
    words,
    created: new Date('2023-01-01'),
    lastStudied: null
  };
};

const getDeckIcon = (id) => {
  switch (id) {
    case 'default-toefl':
      return '📚';
    case 'default-gre':
      return '🎓';
    case 'default-business':
      return '💼';
    default:
      return '📖';
  }
};

const defaultDecks = [
  {
    id: 'default-toefl',
    words: [
      {
        id: 'word-1',
        term: 'abate',
        definition: 'to become less intense or widespread',
        example: 'The storm abated during the night.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-2',
        term: 'admonish',
        definition: 'to express warning or disapproval to someone',
        example: 'The teacher admonished the students for their poor behavior.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-3',
        term: 'affluent',
        definition: 'having a great deal of money; wealthy',
        example: 'He grew up in an affluent neighborhood.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-4',
        term: 'ambiguous',
        definition: 'open to more than one interpretation; not clear or decided',
        example: 'The results of the experiment were ambiguous.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-5',
        term: 'benevolent',
        definition: 'well-meaning and kindly',
        example: 'The benevolent organization provides food for the homeless.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      }
    ],
    icon: '📚',
    created: new Date('2023-01-01'),
    lastStudied: null
  },
  {
    id: 'default-gre',
    words: [
      {
        id: 'word-6',
        term: 'aberration',
        definition: 'a departure from what is normal, usual, or expected',
        example: 'The warm weather in January was an aberration.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-7',
        term: 'abridge',
        definition: 'shorten (a book, movie, speech, or other text) without losing the sense',
        example: 'The novel has been abridged to make it suitable for children.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-8',
        term: 'abscond',
        definition: 'leave hurriedly and secretly, typically to escape from custody or avoid arrest',
        example: 'The suspect absconded before the police arrived.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-9',
        term: 'acumen',
        definition: 'the ability to make good judgments and quick decisions',
        example: 'Her business acumen has led to the company\'s success.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-10',
        term: 'alacrity',
        definition: 'brisk and cheerful readiness',
        example: 'She accepted the invitation with alacrity.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      }
    ],
    icon: '🎓',
    created: new Date('2023-01-01'),
    lastStudied: null
  },
  {
    id: 'default-business',
    words: [
      {
        id: 'word-11',
        term: 'acquisition',
        definition: 'the purchase of one company by another',
        example: 'The acquisition of the startup cost the company $10 million.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-12',
        term: 'assets',
        definition: 'property owned by a company that has value',
        example: 'The company\'s assets include buildings, equipment, and investments.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-13',
        term: 'benchmark',
        definition: 'a standard or point of reference against which things may be compared',
        example: 'The company\'s performance will be measured against industry benchmarks.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-14',
        term: 'leverage',
        definition: 'use borrowed capital for an investment, expecting the profits to be greater than the interest payable',
        example: 'The company leveraged its assets to finance the new project.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      },
      {
        id: 'word-15',
        term: 'overhead',
        definition: 'the ongoing expenses of operating a business',
        example: 'The company reduced overhead by moving to a smaller office.',
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      }
    ],
    icon: '💼',
    created: new Date('2023-01-01'),
    lastStudied: null
  }
];

export default defaultDecks;