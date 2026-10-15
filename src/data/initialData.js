// Branches and Semesters for Chaibasa Engineering College (CEC)
// Affiliated with Jharkhand University of Technology (JUT), Ranchi

export const BRANCHES = [
  { id: 'all', name: 'All Branches', short: 'All' },
  { id: 'cse', name: 'Computer Science & Engineering', short: 'CSE' },
  { id: 'ece', name: 'Electronics & Communication', short: 'ECE' },
  { id: 'ee', name: 'Electrical Engineering', short: 'EE' },
  { id: 'me', name: 'Mechanical Engineering', short: 'ME' },
  { id: 'ce', name: 'Civil Engineering', short: 'CE' },
];

export const SEMESTERS = [
  { value: 'all', label: 'All Sem' },
  { value: 1, label: 'Sem 1' },
  { value: 2, label: 'Sem 2' },
  { value: 3, label: 'Sem 3' },
  { value: 4, label: 'Sem 4' },
  { value: 5, label: 'Sem 5' },
  { value: 6, label: 'Sem 6' },
  { value: 7, label: 'Sem 7' },
  { value: 8, label: 'Sem 8' },
];

// Dynamically generate years from the current year down to 2010.
// When 2027, 2028 or any future year arrives, it will automatically appear at the top!
const currentYear = new Date().getFullYear();
const startYear = 2010;

export const YEARS = [
  'All Years',
  ...Array.from({ length: Math.max(0, currentYear - startYear + 1) }, (_, i) => String(currentYear - i)),
];

// Clean empty starting state - no dummy data!
export const INITIAL_PAPERS = [];
