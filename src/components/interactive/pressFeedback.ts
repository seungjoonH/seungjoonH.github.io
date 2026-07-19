// 클릭 피드백 클래스 — press=scale, shade=음영, press-shade=둘 다
export const PRESS_FEEDBACKS = ['press', 'shade', 'press-shade'] as const;
export type PressFeedback = (typeof PRESS_FEEDBACKS)[number];

export function pressFeedbackClass(feedback: PressFeedback): string {
  switch (feedback) {
    case 'press':
      return 'clickable';
    case 'shade':
      return 'hoverable';
    case 'press-shade':
      return 'clickable hoverable';
  }
}
