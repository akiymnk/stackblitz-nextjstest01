import { ReactNode } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export const ToolTip = (props: {
  title: ReactNode;
  class?: string | undefined;
  children: ReactNode;
}) => {
  const title = props.title;

  const renderTooltip = (props: any) => {
    return (
      <Tooltip {...props}>
        <div style={{ maxHeight: '15rem' }} className="overflow-hidden">
          {title}
        </div>
      </Tooltip>
    );
  };

  return (
    <OverlayTrigger
      trigger={['focus', 'hover']}
      placement="top"
      overlay={renderTooltip}
    >
      <div className={props.class}>{props.children}</div>
    </OverlayTrigger>
  );
};
