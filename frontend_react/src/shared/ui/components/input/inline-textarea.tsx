import { cn } from '@/shared/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

export type InlineTextareaProps = React.ComponentProps<
  typeof TextareaAutosize
> & {
  // 改行させない
  disableLineBreaks?: boolean;
};

export const InlineTextarea = ({
  onKeyDown,
  className,
  disableLineBreaks,
  ...props
}: InlineTextareaProps) => {
  return (
    <TextareaAutosize
      className={cn('resize-none focus:outline-none', className)}
      onKeyDown={(e) => {
        if (disableLineBreaks && e.key === 'Enter') {
          e.preventDefault();
        }
        return onKeyDown?.(e);
      }}
      {...props}
    />
  );
};
