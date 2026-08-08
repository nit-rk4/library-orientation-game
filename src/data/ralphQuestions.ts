import type { RalphQuestion } from '../types/game'

export const ralphQuestions: RalphQuestion[] = [
  {
    id: 'library-services',
    statement: 'The library offers more than books, including study spaces, digital resources, and research support.',
    isTrue: true,
    explanation: 'College libraries connect students with spaces, technology, collections, and expert help.',
    topic: 'LIBRARY SERVICES',
  },
  {
    id: 'borrowing-rules',
    statement: 'A borrowed item can be kept past its due date as long as another student has not requested it.',
    isTrue: false,
    explanation: 'Return or renew items by their due dates. Renewal rules depend on the library account and item.',
    topic: 'BORROWING RULES',
  },
  {
    id: 'opac',
    statement: 'The OPAC can show a book’s call number, location, and current availability.',
    isTrue: true,
    explanation: 'The catalog helps you identify an item and locate or request it.',
    topic: 'OPAC',
  },
  {
    id: 'ebooks',
    statement: 'Every library e-book may be downloaded permanently and shared with anyone.',
    isTrue: false,
    explanation: 'E-book access, downloads, and sharing follow license and platform rules.',
    topic: 'E-BOOKS',
  },
  {
    id: 'databases',
    statement: 'Library databases can help you find scholarly articles that may not appear in a basic web search.',
    isTrue: true,
    explanation: 'Databases provide focused search tools and access to curated academic sources.',
    topic: 'DATABASES',
  },
  {
    id: 'librarian-help',
    statement: 'A librarian can help you improve keywords and choose an appropriate database for your topic.',
    isTrue: true,
    explanation: 'Research help includes building search strategies, evaluating sources, and navigating tools.',
    topic: 'LIBRARIAN HELP',
  },
  {
    id: 'responsible-behavior',
    statement: 'Food, drink, noise, and room-use rules are identical in every part of every library.',
    isTrue: false,
    explanation: 'Policies can vary by library and zone. Check posted guidance for the space you are using.',
    topic: 'RESPONSIBLE USE',
  },
  {
    id: 'research-support',
    statement: 'Research support is only useful after you have finished writing your paper.',
    isTrue: false,
    explanation: 'Ask early: research support can help from topic selection through source evaluation and citation.',
    topic: 'RESEARCH SUPPORT',
  },
  {
    id: 'book-care',
    statement: 'If a library book is damaged, report it to library staff instead of attempting your own repair.',
    isTrue: true,
    explanation: 'Staff can document damage and use materials and methods appropriate for library collections.',
    topic: 'BOOK CARE',
  },
  {
    id: 'account-security',
    statement: 'It is safe to share your library login with a classmate when you are working on the same assignment.',
    isTrue: false,
    explanation: 'Keep account credentials private. Shared access can expose personal data and violate license terms.',
    topic: 'ACCOUNT SECURITY',
  },
]
