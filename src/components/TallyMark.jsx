export default function TallyMark({ count, color }) {
  if (count === 0) {
    return (
      <svg className="tally-svg" width="14" height="20" viewBox="0 0 14 20">
        <line x1="2" y1="4" x2="2" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      </svg>
    );
  }

  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  const groupW = 24,
    gap = 8,
    strokeSpace = 4.5;
  const totalGroups = groups + (remainder > 0 ? 1 : 0);
  const width = totalGroups * groupW + Math.max(0, totalGroups - 1) * gap + 4;

  const lines = [];
  let x = 2;
  let key = 0;

  for (let g = 0; g < groups; g++) {
    for (let i = 0; i < 4; i++) {
      const lx = x + i * strokeSpace;
      lines.push(<line key={key++} x1={lx} y1="3" x2={lx} y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />);
    }
    lines.push(
      <line key={key++} x1={x - 2} y1="16" x2={x + 4 * strokeSpace + 2} y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    );
    x += groupW + gap;
  }

  if (remainder > 0) {
    for (let i = 0; i < remainder; i++) {
      const lx = x + i * strokeSpace;
      lines.push(<line key={key++} x1={lx} y1="3" x2={lx} y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />);
    }
  }

  return (
    <svg className="tally-svg" width={width} height="20" viewBox={`0 0 ${width} 20`}>
      {lines}
    </svg>
  );
}
