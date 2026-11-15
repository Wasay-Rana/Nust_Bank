import type { SubjectKey } from '@/lib/types';
import { SUBJECTS } from '@/lib/types';

const colorMap: Record<SubjectKey, string> = {
  math:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
  phy:   'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300',
  eng:   'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
  chem:  'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300',
  intel: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
};

export function SubjectBadge({ subject, extra }: { subject: SubjectKey; extra?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorMap[subject]}`}>
      {SUBJECTS[subject].name}{extra ? ` · ${extra}` : ''}
    </span>
  );
}
