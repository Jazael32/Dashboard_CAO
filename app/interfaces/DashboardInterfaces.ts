export interface User {
  name: string;
  email: string;
  role: string
}

export interface NavItem {
  label: string;
  icon: React.JSX.Element; // O React.ElementType / React.ComponentType si usas otra librería
  admin?: boolean;  // El '?' indica que es opcional
}

export interface NavItems {
  navItems: NavItem[];
}