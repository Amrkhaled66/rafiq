import { useCallback, useState } from "react";

export type LessonWatchIntent = "watch" | "unwatch";

export type LessonWatchTarget = {
  id: number;
  lessonName: string;
  intent: LessonWatchIntent;
};

type UseLessonWatchConfirmationOptions = {
  onWatch: (id: number) => Promise<unknown>;
  onUnwatch: (id: number) => Promise<unknown>;
};

const UPDATE_ERROR_MESSAGE = "تعذر تحديث حالة الحصة. حاول مرة أخرى.";

export function useLessonWatchConfirmation({
  onWatch,
  onUnwatch,
}: UseLessonWatchConfirmationOptions) {
  const [target, setTarget] = useState<LessonWatchTarget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestConfirmation = useCallback(
    (nextTarget: LessonWatchTarget) => {
      if (isSubmitting) return;
      setErrorMessage(null);
      setTarget(nextTarget);
    },
    [isSubmitting],
  );

  const dismiss = useCallback(() => {
    if (isSubmitting) return;
    setErrorMessage(null);
    setTarget(null);
  }, [isSubmitting]);

  const confirm = useCallback(async () => {
    if (!target || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const execute = target.intent === "watch" ? onWatch : onUnwatch;
      await execute(target.id);
      setTarget(null);
    } catch {
      setErrorMessage(UPDATE_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onUnwatch, onWatch, target]);

  return {
    target,
    isSubmitting,
    errorMessage,
    requestConfirmation,
    confirm,
    dismiss,
  };
}
