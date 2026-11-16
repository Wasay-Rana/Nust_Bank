import type { SubjectKey } from '@/lib/types';
import { ALL_SUBJECT_INFO } from '@/lib/types';

const colorMap: Record<SubjectKey, string> = {
  math:  'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  phy:   'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300',
  eng:   'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  chem:  'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  intel: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
};

export function SubjectBadge({ subject, extra }: { subject: SubjectKey; extra?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${colorMap[subject]}`}>
      {ALL_SUBJECT_INFO[subject].name}{extra ? ` · ${extra}` : ''}
    </span>
  );
}
