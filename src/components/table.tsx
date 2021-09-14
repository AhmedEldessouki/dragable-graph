import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import colors from "../shared/styles";

const Input = styled.input<{ width: string }>`
  border-radius: 5px;
  border: 1px solid ${colors.lightBlue};
  padding: 5px 10px;
  width: ${({ width }) => width};
`;

function TableTextInput({
  name,
  ...overRide
}: {
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <td>
      <label htmlFor={name}>
        <Input id={name} name={name} type="text" {...overRide} width="250px" />
      </label>
    </td>
  );
}

function TableNumberInput({
  name,
  ...overRide
}: { name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isNum, setIsNum] = React.useState("text");
  return (
    <td>
      <label htmlFor={name}>
        <Input
          onFocus={() => setIsNum("number")}
          onBlur={() => setIsNum("text")}
          id={name}
          name={name}
          type={isNum}
          min={0}
          max={100}
          {...overRide}
          width="69px"
        />
      </label>
    </td>
  );
}

type GraphTablePropsType = {
  children: React.ReactChild;
  onAdd: () => void;
};

const Button = styled.button<{ width?: string; ml?: boolean }>`
  background: ${colors.lightGrey};
  border: 1px solid ${colors.lightBlue};
  border-radius: 5px;

  padding: 4px 10px;
  ${({ width }) => width && `width:` + width};
  ${({ ml }) => ml && "margin-left: 2px"};
  :hover {
    background: ${colors.darkGrey};
    color: ${colors.lightGrey};
  }
`;
const Container = styled.section`
  height: 400px;
`;
const tableHeader = css({
  background: `${colors.lightBlue}`,
  color: `${colors.white}`,
  fontFamily: `sans-serif`,
  borderRadius: `3px`,
  fontSize: `1rem`,
  fontWeight: `normal`,
});

const Th = styled.th<{ minWidth: string }>`
  min-width: ${({ minWidth }) => minWidth};
  ${tableHeader}
`;

function GraphTable({ children, onAdd }: GraphTablePropsType) {
  return (
    <Container>
      <Button type="button" onClick={onAdd} ml>
        Add
      </Button>

      <table>
        <thead>
          <tr>
            <Th minWidth="1"> </Th>
            <Th minWidth="272.233px">Label</Th>
            <Th minWidth="90.233px">Vision</Th>
            <Th minWidth="90.233px">Ability</Th>
            <Th minWidth="90.233px">Delete</Th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </Container>
  );
}

const TextInputMemoed = React.memo(TableTextInput);
const NumberInputMemoed = React.memo(TableNumberInput);
export {
  GraphTable,
  TextInputMemoed as TableTextInput,
  NumberInputMemoed as TableNumberInput,
  Button,
};
