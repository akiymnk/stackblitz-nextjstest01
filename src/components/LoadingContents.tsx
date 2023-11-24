import { ReactNode } from 'react';

export type PropsType = {
  children?: ReactNode;
  showLoading?: boolean;
  rows?: number;
};

export const LoadingContents: React.FC<PropsType> = (props: PropsType) => {
  if (!props.showLoading) {
    return <>{props.children}</>;
  }

  const rows = props.rows ?? 10;
  const nodeIndexList = [];
  const nodes = [
    <p className="placeholder-glow">
      <span className="placeholder w-25"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-75"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-50"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-50"></span>
    </p>,
    <p className="placeholder-glow">
      <span className="placeholder w-50"></span>
    </p>,
  ];

  for (let i = 0; i < rows; i++) {
    const index = i % nodes.length;
    nodeIndexList.push(index);
  }

  return (
    <div>
      {nodeIndexList.map((i) => (
        <div key={i}>{nodes[i]}</div>
      ))}
    </div>
  );
};
