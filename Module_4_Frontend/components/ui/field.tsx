import { forwardRef, useId, type HTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD_CLASSES = cn(
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 shadow-sm",
  "placeholder:text-slate-400 transition",
  "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
);

const ERROR_CLASSES = "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20";

interface FieldWrapProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
}

function FieldWrap({ label, error, hint, className, children, id }: FieldWrapProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id: idProp, ...props },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap label={label} error={error} hint={hint} id={id} className={className}>
      <input
        ref={ref}
        id={id}
        className={cn(FIELD_CLASSES, "h-10", error && ERROR_CLASSES)}
        {...props}
      />
    </FieldWrap>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id: idProp, ...props },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap label={label} error={error} hint={hint} id={id} className={className}>
      <textarea
        ref={ref}
        id={id}
        className={cn(FIELD_CLASSES, "min-h-28 px-3.5 py-2.5", error && ERROR_CLASSES)}
        {...props}
      />
    </FieldWrap>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id: idProp, children, ...props },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap label={label} error={error} hint={hint} id={id} className={className}>
      <select
        ref={ref}
        id={id}
        className={cn(FIELD_CLASSES, "h-10 appearance-none bg-white pr-9", error && ERROR_CLASSES)}
        {...props}
      >
        {children}
      </select>
    </FieldWrap>
  );
});