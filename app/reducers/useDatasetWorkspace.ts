'use client';

import { useCallback, useEffect, useReducer, useRef, type ChangeEvent } from 'react';
import { parseExcelAdvanced } from '@/lib/excelParser';
import {
  saveDataset,
  getDataset,
  listDatasets,
  deleteDataset,
} from '@/data/db/ExcelActions';
import { datasetReducer, initialDatasetState } from './DatasetReducer';
import { exportRowsToXlsx } from '@/lib/exportExcel';

// Configuración del parser: un solo lugar para cambiarla
// const HEADER_KEYWORD = 'C.A.';
// const STOP_ON_EMPTY_COLUMN = 'C.A.';

export type UploadWorkbookParams = {
  file: File;
  name: string;
  tableHeader: string;
  stopOnColumn: string;
};

export function useDatasetWorkspace() {

  const [state, dispatch] = useReducer(datasetReducer, initialDatasetState);

  const refreshSaved = useCallback(async () => {
    try {
      dispatch({ type: 'SAVED_LIST_LOADED', saved: await listDatasets() });
    } catch (err) {
      console.error('Error loading saved datasets', err);
    }
  }, []);

  useEffect(() => {
    refreshSaved();
  }, [refreshSaved]);

  const uploadWorkbook = useCallback(
    async ({ file, name, tableHeader, stopOnColumn }: UploadWorkbookParams) => {
      dispatch({ type: 'LOADING', value: true });
      dispatch({ type: 'ERROR', message: null });

      try {
        const result = await parseExcelAdvanced(
          file,
          undefined,
          tableHeader,
          stopOnColumn,
        );

        // La tabla se muestra de inmediato
        dispatch({ type: 'TABLE_PARSED', headers: result.headers, data: result.data });

        // Y se guarda en la base de datos con el nombre que eligió el usuario
        const { id } = await saveDataset(name, result.headers, result.data, result.profile);
        dispatch({ type: 'TABLE_SAVED', id });
        await refreshSaved();
      } catch (err) {
        console.error(err);
        dispatch({ type: 'ERROR', message: 'Error parsing or saving the Excel file.' });
        throw err; // el modal lo captura para NO cerrarse y mostrar el error
      } finally {
        dispatch({ type: 'LOADING', value: false });
      }
    },
    [refreshSaved],
  );

  const openDataset = useCallback(
    async (id: string) => {
      dispatch({ type: 'LOADING', value: true });
      dispatch({ type: 'ERROR', message: null });
      try {
        const dataset = await getDataset(id);
        if (!dataset) {
          dispatch({ type: 'ERROR', message: 'Dataset not found.' });
          await refreshSaved();
          return;
        }
        dispatch({
          type: 'TABLE_OPENED',
          id: dataset.id,
          headers: dataset.columns,
          data: dataset.rows,
        });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'ERROR', message: 'Error loading the saved table.' });
      } finally {
        dispatch({ type: 'LOADING', value: false });
      }
    },
    [refreshSaved],
  );

  const removeDataset = useCallback(
    async (id: string) => {
      try {
        await deleteDataset(id);
        if (id === state.currentId) dispatch({ type: 'TABLE_CLEARED' });
        await refreshSaved();
      } catch (err) {
        console.error(err);
        dispatch({ type: 'ERROR', message: 'Error deleting the table.' });
      }
    },
    [state.currentId, refreshSaved],
  );

  const downloadDataset = useCallback(async (id: string) => {
    try {
      const dataset = await getDataset(id);
      if (!dataset) {
        dispatch({ type: 'ERROR', message: 'Dataset not found.' });
        return;
      }
      exportRowsToXlsx(dataset.columns, dataset.rows, dataset.name);
    } catch (err) {
      console.error(err);
      dispatch({ type: 'ERROR', message: 'Error downloading the table.' });
    }
  }, []);

  return {
    ...state,
    uploadWorkbook,
    openDataset,
    removeDataset,
    downloadDataset,
  };
}