const paths = {
  leaf: 'M20 4C11 2 3 6 4 14c1 7 11 8 14 1 2-4 2-8 2-11ZM4 21 15 10M9 16v-5M9 16h5',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  book: 'M12 5v16M12 5C9 2 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-2-10 1Z',
  connect: 'M9 8h6M6 10v5M18 10v5M9 18h6M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  sprout: 'M12 22V12M12 16C3 17 2 12 2 8c7-1 10 3 10 8ZM12 12c0-7 4-10 10-10 0 7-3 10-10 10Z',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  check: 'M4 12l5 5L20 6',
  close: 'm6 6 12 12M6 18 18 6',
  search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  chevron: 'm6 9 6 6 6-6',
  pause: 'M8 5v14M16 5v14',
  play: 'm8 4 12 8-12 8Z',
};

export default function CeibaIcon({ name, size = 24, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.leaf} /></svg>;
}
