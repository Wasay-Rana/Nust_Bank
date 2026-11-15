import type { SubjectKey } from '@/lib/types';
import { ALL_SUBJECT_INFO } from '@/lib/types';

const colorMap: Record<SubjectKey, string> = {
  math:  'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  phy:   'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
  eng:   'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-300',
  chem:  'bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-300',
  intel: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
};

export function SubjectBadge({ subject, extra }: { subject: SubjectKey; extra?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${colorMap[subject]}`}>
      {ALL_SUBJECT_INFO[subject].name}{extra ? ` · ${extra}` : ''}
    </span>
  );
}
