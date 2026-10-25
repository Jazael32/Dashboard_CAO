'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { updateRows } from '@/data/db/ExcelActions';
import { datasetReducer, initialDatasetState, type Row } from './DatasetReducer';

export function useEditableDataset(id: string, headers: string[], initialRows: Row[]) {
  // El estado inicial viene del servidor; después, el cliente lo edita
  const [state, dispatch] = useReducer(datasetReducer, {
    ...initialDatasetState,
    headers,
    data: initialRows,
    currentId: id,
  });

  const editCell = useCallback(
    (rowIndex: number, columnId: string, value: unknown) =>
      dispatch({ type: 'CELL_EDITED', rowIndex, columnId, value }),
    [],
  );

  const deleteRows = useCallback(
    (rowIndexes: number[]) => dispatch({ type: 'ROWS_DELETED', rowIndexes }),
    [],
  );

  const saveChanges = useCallback(async () => {
    if (!state.dirty) return;

    const savedData = state.data;
    dispatch({ type: 'SAVE_STARTED' });
    try {
      await updateRows(id, savedData);
      dispatch({ type: 'SAVE_SUCCEEDED', savedData });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SAVE_FAILED' });
    }
  }, [id, state.dirty, state.data]);

  // Ctrl/Cmd + S guarda
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveChanges();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveChanges]);

  // Aviso al cerrar o recargar con cambios sin guardar
  useEffect(() => {
    if (!state.dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state.dirty]);

  return {
    headers: state.headers,
    data: state.data,
    dirty: state.dirty,
    saveStatus: state.saveStatus,
    error: state.error,
    editCell,
    deleteRows,
    saveChanges,
  };
}