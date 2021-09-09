import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import colors from "../shared/styles";

const Input = styled.input<{ width: string }>`
  border-radius: 5px;
  border: 1px solid ${colors.lightBlue};
  padding: 5px 10px;
  width: ${({ width }) => width};
`;
const Label = styled.label({
  width: `100%`,
});

function TableTextInput({
  name,
  ...overRide
}: {
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <td>
      <Label htmlFor={name}>
        <Input id={name} name={name} type="text" {...overRide} width="250px" />
      </Label>
    </td>
  );
}

function TableNumberInput({
  name,
  ...overRide
}: { name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isNum, setIsNum] = React.useState(false);
  return (
    <td>
      <Label htmlFor={name}>
        <Input
          onFocus={() => setIsNum(!isNum)}
          onBlur={() => setIsNum(!isNum)}
          id={name}
          name={name}
          type={isNum ? "number" : "text"}
          min={0}
          max={100}
          {...overRide}
          width="69px"
        />
      </Label>
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

const LongTh = styled.th`
  min-width: 272.233px;
  ${tableHeader}
`;
const ShortTh = styled.th`
  min-width: 90.233px;
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
            <LongTh>Label</LongTh>
            <ShortTh>Vision</ShortTh>
            <ShortTh>Ability</ShortTh>
            <ShortTh>Delete</ShortTh>
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
