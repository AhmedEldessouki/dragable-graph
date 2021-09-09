import React from "react";
import styled from "@emotion/styled";
import type { ItemType } from "../types/state";
import {
  GraphTable,
  Button,
  TableNumberInput,
  TableTextInput,
} from "./components/table";
import Chart from "./components/chart";

type ReducerStateType = Array<ItemType>;

type AppReducerActionType =
  | {
      type: "add";
    }
  | {
      type: "remove";
      payload: ReducerStateType;
    }
  | {
      type: "modify";
      payload: ReducerStateType;
    };

function handleLocalStorage(params: ReducerStateType): void {
  window.localStorage.setItem("App_STATE", JSON.stringify(params));
}

const AppWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 97.5vh;
  justify-content: center;
  align-items: center;
`;

const initialState: ReducerStateType = [
  { label: "1", x: 20, y: 20 },
  { label: "2", x: 40, y: 40 },
  { label: "3", x: 60, y: 60 },
];

const appReducer = (state: ReducerStateType, action: AppReducerActionType) => {
  switch (action.type) {
    case "add":
      const newState = [...state, { label: `new`, x: 50, y: 50 }];
      handleLocalStorage(newState);
      return [...newState];
    case "remove":
      handleLocalStorage(action.payload);
      return [...action.payload];
    case "modify":
      handleLocalStorage(action.payload);
      return [...action.payload];

    default:
      return state;
  }
};

function App() {
  const [chartState, dispatch] = React.useReducer(
    appReducer,
    initialState,
    () => {
      const fetched = window.localStorage.getItem("App_STATE");

      if (fetched) return JSON.parse(fetched);
      return initialState;
    }
  );

  const onModify = React.useCallback(
    (i, data: { label: string } | { x: number } | { y: number }) => {
      chartState.splice(i, 1, { ...chartState[i], ...data });
      dispatch({ type: "modify", payload: chartState });
    },
    [chartState]
  );
  const numDisplay = (num: number) => {
    return num % 1 !== 0 ? num.toFixed(2) : num;
  };

  return (
    <AppWrapper>
      <Chart data={chartState} onModify={onModify} />
      <GraphTable onAdd={() => dispatch({ type: "add" })}>
        <>
          {chartState?.map((item, i) => (
            <tr key={`chart-table-row-${i}`}>
              <TableTextInput
                name={`label-${i}`}
                type="text"
                value={item.label}
                onChange={(e) => {
                  onModify(i, { label: e.currentTarget.value });
                }}
              />
              <TableNumberInput
                name={`vision-${i}`}
                value={numDisplay(item.x)}
                onChange={(e) => {
                  if (e.currentTarget.valueAsNumber > 100) {
                    onModify(i, { x: 100 });
                  } else if (e.currentTarget.valueAsNumber < 0) {
                    onModify(i, { x: 0 });
                  } else {
                    onModify(i, { x: e.currentTarget.valueAsNumber });
                  }
                }}
              />
              <TableNumberInput
                name={`ability-${i}`}
                value={numDisplay(100 - item.y)}
                onChange={(e) => {
                  if (e.currentTarget.valueAsNumber > 100) {
                    onModify(i, { y: 0 });
                  } else if (e.currentTarget.valueAsNumber < 0) {
                    onModify(i, { y: 100 });
                  } else {
                    onModify(i, { y: 100 - e.currentTarget.valueAsNumber });
                  }
                }}
              />
              <td>
                <Button
                  type="button"
                  width="90px"
                  onClick={() => {
                    chartState.splice(i, 1);
                    dispatch({ type: "remove", payload: chartState });
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </>
      </GraphTable>
    </AppWrapper>
  );
}

export default App;
