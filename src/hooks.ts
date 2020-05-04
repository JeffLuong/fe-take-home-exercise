import { useEffect, useState, useRef, useReducer, useCallback } from 'react';

export const useDebounce = (initValue: string, delay: number): string => {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
      const timeout = setTimeout(() => {
          setValue(initValue);
      }, delay);

      return () => clearTimeout(timeout);
  }, [initValue, delay]);

  return value;
};

export function useEventListener(event: string, callback: EventListener, options?: { targetEl: HTMLElement }) {
  const savedCallback = useRef<EventListener>();
  const el = (options && options.targetEl) || window;

  useEffect(() => {
    if (callback !== savedCallback.current) {
      savedCallback.current && el.removeEventListener(event, savedCallback.current);
    }

    el.addEventListener(event, callback);
    savedCallback.current = callback;

    return () => {
      if (el && savedCallback.current) {
        el.removeEventListener(event, savedCallback.current);
      }
    };
  }, [callback, el, event]);
}

type UndoRedoState = {
  past: string[];
  current: string;
  future: string[];
};

type UndoRedoAction =  {
  type: string,
  payload?: {
    newCurrent: string;
  }
};

enum UndoRedoActionTypes {
  UNDO = 'UNDO',
  REDO = 'REDO',
  SET = 'SET'
}

const UNDO = UndoRedoActionTypes.UNDO;
const REDO = UndoRedoActionTypes.REDO;
const SET = UndoRedoActionTypes.SET;

const undoRedoDucer = (state: UndoRedoState, action: UndoRedoAction): UndoRedoState => {
  const { past, current, future } = state;
  const { type, payload } = action;

  switch(type) {
    case UNDO:
      const lastVal = past[past.length - 1];
      const updatedPast = past.slice(0, past.length - 1);
      return {
        past: updatedPast,
        current: lastVal,
        future: [current, ...future]
      };
    case REDO:
      const [futureVal, ...newFuture] = future;
      return {
        past: [...past, current],
        current: futureVal,
        future: newFuture
      };
    case SET:
      if (payload) {
        return {
          past: [...past, current],
          current: payload.newCurrent,
          future: []
        };
      }
      return state;
    default:
      return state;
  }
};

export const useUndoRedo = (initial: string): [string, Function, Function, Function] => {
  const [state, dispatch] = useReducer(undoRedoDucer, { past: [], current: initial, future: [] });
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  const undoFunc = useCallback(() => {
    if (canUndo) {
      dispatch({ type: UNDO });
    }
  }, [canUndo]);

  const redoFunc = useCallback(() => {
    if (canRedo) {
      dispatch({ type: REDO });
    }
  }, [canRedo]);

  const setFunc = useCallback((newCurrent: string) => {
    dispatch({ type: SET, payload: { newCurrent } });
  }, []);

  return [state.current, undoFunc, redoFunc, setFunc];
};