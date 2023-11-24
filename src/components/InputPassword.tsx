import React, { CSSProperties, useState } from 'react';
import './InputPassword.css';
export type Props = {
  wrapperDivClassName?: string;
  wrapperDivStyle?: CSSProperties | undefined;
  isNewFlg?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputPassword = (props: Props) => {
  const [isRevealPassword, setIsRevealPassword] = useState(false);

  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  };

  const isNewFlg = props.isNewFlg;

  // inputの属性にisNewFlgは無いので削除しておく
  const newProps = { ...props };
  delete newProps.isNewFlg;

  return (
    <span
      className={(props.wrapperDivClassName ?? '') + ' position-relative '}
      style={props.wrapperDivStyle}
    >
      <input
        {...newProps}
        className={
          (props.className ?? ' ') +
          ' form-password form-control pe-4 custom-hideicon '
        }
        placeholder={isNewFlg ? '初期パスワード' : 'パスワード'}
        type={isRevealPassword ? 'text' : 'password'}
      />
      <span
        onClick={togglePassword}
        role="presentation"
        style={{ position: 'absolute', left: 'auto', right: 10, top: 0 }}
      >
        {isRevealPassword ? (
          <i className="fas fa-eye" />
        ) : (
          <i className="fas fa-eye-slash" />
        )}
      </span>
    </span>
  );
};
