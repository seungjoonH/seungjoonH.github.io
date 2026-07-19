// 뒤집힌 프로젝트 카드 id 추적
import { create } from 'zustand';

export interface ProjectCardFlipState {
  flippedProjectId: string | null;
  setFlippedProjectId: (id: string | null) => void;
}

export const useProjectCardFlipStore = create<ProjectCardFlipState>((set) => ({
  flippedProjectId: null,
  setFlippedProjectId: (id) => set({ flippedProjectId: id }),
}));

