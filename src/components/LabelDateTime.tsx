import { format, parse } from 'date-fns';
import React, { useMemo } from 'react';

export type Props = {
  value: string | null | undefined;
  stringFormat?: string | undefined;
  dateOnly?: boolean | null | undefined;
  showBrackets?: boolean;
};

export const LabelDateTime: React.FC<Props> = (props) => {
  const formatText = useMemo(() => {
    if (props.dateOnly) {
      return 'yyyy/MM/dd';
    }
    return 'yyyy/MM/dd HH:mm';
  }, [props.dateOnly]);

  const dateTimeText = useMemo(() => {
    try {
      let m: string;
      if (props.stringFormat) {
        m = format(
          parse(props.value ?? '', props.stringFormat, new Date()),
          formatText
        );
      } else {
        m = format(new Date(props.value ?? ''), formatText);
      }
      return m;
    } catch {
      return null;
    }
  }, [props.value, formatText]);

  if (!dateTimeText) {
    return null;
  }

  return (
    <span>
      {props.showBrackets && <>（</>}
      {dateTimeText}
      {props.showBrackets && <>）</>}
    </span>
  );
};
