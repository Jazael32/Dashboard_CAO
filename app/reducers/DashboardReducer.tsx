import { useReducer, useRef } from 'react';

export interface DashboardState {
  selectedWorkbook: string;
  activeSection: string;
  searchTerm: string;
  mobileNav: boolean;
}

export type DashboardAction =
  | { type: 'SET_SELECTED_WORKBOOK'; payload: string }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'SET_MOBILE_NAV'; payload: boolean }
  | { type: 'RESET_FILTERS' }; // Opcional: util para limpiar busqueda y workbook

export const initialState: DashboardState = {
  selectedWorkbook: 'all',
  activeSection: 'Dashboard',
  searchTerm: '',
  mobileNav: false,
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_SELECTED_WORKBOOK':
      return { ...state, selectedWorkbook: action.payload };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, mobileNav: !state.mobileNav };
    case 'SET_MOBILE_NAV':
      return { ...state, mobileNav: action.payload };
    case 'RESET_FILTERS':
      return { ...state, selectedWorkbook: 'all', searchTerm: '' };
    default:
      return state;
  }
}