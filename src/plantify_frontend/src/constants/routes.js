export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  EXPLORE: '/explore',
  REGISTER: {
    FOUNDER: '/register/founder',
    INVESTOR: '/register/investor'
  },
  STARTUP: {
    DETAILS: (id) => `/startup/${id}`,
    CREATE: '/startup/create'
  }
};

export const NAVIGATION_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Explore', path: ROUTES.EXPLORE },
  { label: 'Register', submenu: [
    { label: 'As Founder', path: ROUTES.REGISTER.FOUNDER },
    { label: 'As Investor', path: ROUTES.REGISTER.INVESTOR }
  ]}
];
