import React, { useCallback, useEffect, useRef } from 'react';
import dompurify from 'dompurify';
//import "react-quill/dist/quill.snow.css";
import '../richtexteditor/index.scss';

interface HtmlViewProps extends React.HTMLAttributes<HTMLElement> {
  value: string | undefined;
  maxHeight?: number | null;
  onScrollBottom?: () => void;
}

dompurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener');
  }
});

const HtmlView = (props: HtmlViewProps) => {
  const refDiv = useRef<HTMLDivElement>(null);
  const sanitizer = dompurify.sanitize;
  const htmlContent = props.value ?? '';

  const style = { ...props.style };
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight;
    style.overflow = 'auto';
  }

  const onScrollDiv = useCallback(() => {
    if (refDiv.current && props.onScrollBottom) {
      const clientHeight = refDiv.current.clientHeight;
      const scrollHeight = refDiv.current.scrollHeight;

      if (scrollHeight - (clientHeight + refDiv.current.scrollTop) <= 10) {
        props.onScrollBottom();
      }
    }
  }, [props]);

  useEffect(() => {
    const refDivCurrent = refDiv.current;

    // スクロールイベント登録
    refDivCurrent?.addEventListener('scroll', onScrollDiv);

    // 初期として、スクロールチェック
    onScrollDiv();

    // イベント解除
    return () => refDivCurrent?.removeEventListener('scroll', onScrollDiv);
  }, [onScrollDiv]);

  return (
    <div
      ref={refDiv}
      className={
        props.className + ' ql-editor ' + (props.maxHeight ? ' border ' : '')
      }
      style={style}
      dangerouslySetInnerHTML={{
        __html: sanitizer(htmlContent, { ADD_ATTR: ['target'] }),
      }}
    ></div>
  );
};

export default HtmlView;
