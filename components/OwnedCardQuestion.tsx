import { useState } from "react";
import { cards } from "@/data/cards";

type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onContinue: (ids: string[]) => void;
};

export function OwnedCardQuestion({ selectedIds, onChange, onContinue }: Props) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const matches = cards.filter((card) => card.name.toLowerCase().includes(query));
  const selected = cards.filter((card) => selectedIds.includes(card.id));

  return (
    <fieldset className="space-y-4">
      <legend className="text-2xl font-semibold text-navy">Which credit cards do you already have?</legend>
      <p className="text-sm text-mid-navy">Optional. Your selections stay in this quiz session.</p>
      <label className="block text-sm font-semibold text-navy">
        Search cards
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="focus-ring mt-1 block w-full rounded-md border border-line px-3 py-2"
        />
      </label>
      {selected.length > 0 && (
        <ul aria-label="Selected cards" className="flex flex-wrap gap-2">
          {selected.map((card) => (
            <li key={card.id} className="rounded-full bg-surface px-3 py-1 text-sm text-navy">{card.name}</li>
          ))}
        </ul>
      )}
      <div className="max-h-52 overflow-y-auto rounded-md border border-line p-2">
        {matches.map((card) => (
          <label key={card.id} className="flex min-h-11 items-center gap-3 rounded-md px-2 text-sm text-navy">
            <input
              type="checkbox"
              checked={selectedIds.includes(card.id)}
              onChange={(event) => onChange(event.target.checked
                ? [...selectedIds, card.id]
                : selectedIds.filter((id) => id !== card.id))}
              className="focus-ring accent-accent-ink"
            />
            <span>{card.name}{card.availability === "discontinued" ? " (legacy)" : ""}</span>
          </label>
        ))}
        {matches.length === 0 && <p role="status" className="p-2 text-sm">No matching cards.</p>}
      </div>
      <p className="text-sm text-mid-navy">If a card is missing, continue with the cards you found.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => onContinue(selectedIds)} className="focus-ring rounded-md bg-accent px-4 py-2 font-semibold text-navy">
          Continue to results
        </button>
        <button type="button" onClick={() => onContinue([])} className="focus-ring rounded-md px-4 py-2 font-semibold text-navy">
          Skip this question
        </button>
      </div>
    </fieldset>
  );
}
