import React from "react";
import styled from "@emotion/styled";
import type { ItemType } from "../../types/state";
import colors from "../shared/styles";

const Canvas = styled.canvas<{ curs: string }>`
  border: 2px ${colors.darkGrey} solid;
  cursor: ${({ curs }) => curs};
  position: relative;
  z-index: 0;
`;

const CanvasAreaLabels = styled.div`
  font-family: sans-serif;
  text-align: center;
  position: absolute;
  z-index: -1;
  height: 400px;
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  border: 2px solid transparent;
  div {
    height: 200px;
    width: 200px;
    display: flex;
    justify-content: center;
    span {
      background: ${colors.lightBlue};
      color: ${colors.white};
      padding: 4px 11px;
      margin: 7px;
      border-radius: 5px;
      font-size: 13px;
      font-weight: 600;
    }
  }
  div:nth-of-type(1),
  div:nth-of-type(2) {
    align-items: start;
  }
  div:nth-of-type(3),
  div:nth-of-type(4) {
    align-items: end;
  }
`;

const Svg = styled.svg`
  margin-left: -63px;
  margin-top: 0px;
  overflow: visible;
`;
const CanvasWrapper = styled.div`
  display: grid;
  grid-template-columns: 400px;
  grid-template-rows: 400px;
  max-width: 400px;
  max-height: 400px;
`;
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  if (!text.match(" ")) {
    ctx.fillText(text, x, y);
    return;
  }
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function draw(ctx: CanvasRenderingContext2D, { label, x, y }: ItemType) {
  ctx.save();
  ctx.beginPath();
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `13px sans-serif`;
  ctx.fillStyle = colors.darkBlue;
  wrapText(ctx, label, x * 4 + 8, y * 4 + 8, 400 - x * 4, 14);
  ctx.scale(4, 4);
  ctx.arc(x, y, 15 / 2 / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function Chart({
  data,
  onModify,
}: {
  data: Array<ItemType>;
  onModify: (
    index: number,
    data: { label: string } | { x: number } | { y: number }
  ) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [draggableItem, setDraggableItem] = React.useState(-1);
  const [draggingCursor, setDraggingCursor] = React.useState<
    "grab" | "default" | "grabbing"
  >("default");

  function processEvent(e: React.MouseEvent) {
    if (!canvasRef.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const offsetTop = rect.top;
    const offsetLeft = rect.left;
    return {
      x: (e.clientX - offsetLeft) / 4,
      y: (e.clientY - offsetTop) / 4,
    };
  }

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const squareLength = canvasRef.current.width;
    ctx.clearRect(0, 0, squareLength, squareLength);
    ctx.beginPath();
    ctx.moveTo(squareLength / 2, 0);
    ctx.lineTo(squareLength / 2, squareLength);
    ctx.moveTo(0, squareLength / 2);
    ctx.lineTo(squareLength, squareLength / 2);
    ctx.strokeStyle = "#E3E4E7";
    ctx.stroke();

    data?.forEach(({ label, x, y }) => {
      draw(ctx, { label, x, y });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const isHovering = React.useCallback(
    (targetedX, targetedY) => {
      if (dragging) return;
      const index = data?.findIndex(
        ({ x, y }) =>
          x - 1.5 <= targetedX &&
          x + 1.5 >= targetedX &&
          y - 1.5 <= targetedY &&
          y + 1.5 >= targetedY
      );
      if (index !== -1) {
        setDraggableItem(index);
        setDraggingCursor("grab");
      } else {
        setDraggableItem(-1);
        setDraggingCursor("default");
      }
    },
    [data, dragging]
  );

  return (
    <div style={{ display: "flex" }}>
      <CanvasWrapper>
        <Canvas
          width="400"
          height="400"
          ref={canvasRef}
          onMouseMove={(e) => {
            const targeted = processEvent(e);
            if (!targeted) return;
            isHovering(targeted.x, targeted.y);
            if (!dragging) return;
            onModify(draggableItem, targeted);
          }}
          onMouseDown={() => {
            if (draggableItem === -1) return;
            setDraggingCursor("grabbing");
            setDragging(!dragging);
          }}
          onMouseUp={() => {
            if (draggableItem === -1) return;
            setDragging(!dragging);
            setDraggingCursor("grab");
          }}
          curs={draggingCursor}
        />
        <Svg xmlns="http://www.w3.org/2000/svg">
          <text
            fontSize="13px"
            fontFamily="sans-serf"
            transform="translate(58,0) rotate(270)"
          >
            Ability to execute –&gt;
          </text>
          <text x="65" y="17" fontSize="13px" fontFamily="sans-serf">
            Completeness of vision –&gt;
          </text>
        </Svg>
      </CanvasWrapper>
      <CanvasAreaLabels>
        <div>
          <span>Challengers</span>
        </div>
        <div>
          <span>Leaders</span>
        </div>
        <div>
          <span>Niche Players</span>
        </div>
        <div>
          <span>Visionaries</span>
        </div>
      </CanvasAreaLabels>
    </div>
  );
}

export default Chart;
