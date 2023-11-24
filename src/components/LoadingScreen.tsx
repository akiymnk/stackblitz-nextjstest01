import { ReactNode } from 'react';
import { Spinner } from 'react-bootstrap';

export type PropsType = {
  children?: ReactNode;
  showLoading?: boolean;
};

export const LoadingScreen = (props: PropsType) => {
  return (
    <div>
      <div>{props.children}</div>
      {props.showLoading !== false && (
        <div className="global-window-loading d-flex flex-column justify-content-center align-items-center vw-100 vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
};
