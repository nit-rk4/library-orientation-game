import type { RalphQuestion } from '../types/game'

export const ralphQuestions: RalphQuestion[] = [
  {
    id: 'school-id',
    statement: 'You usually need your school ID to borrow books from the library.',
    isTrue: true,
    explanation: 'Your school ID helps the library identify your account and record borrowed materials.',
    topic: 'BORROWING RULES',
  },
  {
    id: 'due-dates',
    statement: 'You may keep a borrowed book as long as you want without returning it.',
    isTrue: false,
    explanation: 'Library materials have due dates and should be returned or renewed on time.',
    topic: 'BORROWING RULES',
  },
  {
    id: 'opac-search',
    statement: 'OPAC can help you find books and other materials available in the library.',
    isTrue: true,
    explanation: 'OPAC is the library’s online catalog for searching titles, authors, subjects, and locations.',
    topic: 'OPAC',
  },
  {
    id: 'opac-online',
    statement: 'You can use OPAC only when you are standing inside the library.',
    isTrue: false,
    explanation: 'Many libraries allow students to access OPAC online from other locations.',
    topic: 'OPAC',
  },
  {
    id: 'databases-entertainment',
    statement: 'Library databases are useful only for entertainment and social media.',
    isTrue: false,
    explanation: 'Databases provide reliable academic resources such as journal articles, studies, and reports.',
    topic: 'DATABASES',
  },
  {
    id: 'librarian-help',
    statement: 'A librarian can help you find reliable sources for your research assignment.',
    isTrue: true,
    explanation: 'Librarians are trained to assist students with research and information searching.',
    topic: 'LIBRARIAN HELP',
  },
  {
    id: 'book-notes',
    statement: 'It is okay to write notes or highlight pages in a library book.',
    isTrue: false,
    explanation: 'Library books should be kept clean and undamaged so other students can use them.',
    topic: 'BOOK CARE',
  },
  {
    id: 'book-care',
    statement: 'You should handle library books carefully and protect them from food, drinks, and damage.',
    isTrue: true,
    explanation: 'Proper book care helps keep library materials usable for everyone.',
    topic: 'BOOK CARE',
  },
  {
    id: 'silent-area',
    statement: 'Talking loudly in a silent study area is acceptable if you are working on a group project.',
    isTrue: false,
    explanation: 'Group discussions should be done in designated discussion or collaborative areas.',
    topic: 'RESPONSIBLE USE',
  },
  {
    id: 'password-sharing',
    statement: 'You should share your  account password with friends so they can access resources.',
    isTrue: false,
    explanation: 'Your library account and password should be kept private to protect your personal information.',
    topic: 'ACCOUNT SECURITY',
  },
]