export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  number: string;
  prefix: string;
  mstrid: string;
  role: string;
  isPortfolioActive: boolean;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  number: string;
  prefix: string;
  mstrid: string;
  role: string;
  isPortfolioActive: boolean;
}
