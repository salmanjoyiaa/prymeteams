"use client";

type Props = {
  action: (formData: FormData) => Promise<void>;
  idName: string;
  idValue: string;
  label?: string;
  confirmMessage?: string;
  extraFields?: Record<string, string>;
};

export function ConfirmDelete({
  action,
  idName,
  idValue,
  label = "Delete",
  confirmMessage = "Delete this record? This cannot be undone.",
  extraFields,
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name={idName} value={idValue} />
      {extraFields
        ? Object.entries(extraFields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))
        : null}
      <button
        type="submit"
        className="cursor-pointer rounded-lg border border-[#5A1F27] bg-[#130B0E] px-2.5 py-1 text-xs font-semibold text-[#FF8A8E] transition hover:bg-[#1A1014]"
      >
        {label}
      </button>
    </form>
  );
}
