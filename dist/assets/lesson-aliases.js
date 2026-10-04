// Keep old bookmarks/progress without listing the obsolete duplicate lesson.
export const canonicalLessonId=id=>id==='packet'?'internet':id;
export function mergeLegacyProgress(progress){return progress.packet&&!progress.internet?{...progress,internet:progress.packet}:progress;}
