import { Problem } from "../common";
import { Shape } from "../forms";

export interface FiltersProps {
  shapes: Array<{ id: number; type: string; [key: string]: any }>;
  showSides: boolean;
  setShowSides: (show: boolean) => void;
  showAngles: boolean;
  setShowAngles: (show: boolean) => void;
  showAreaByShape: {
    circle: boolean;
    triangle: boolean;
    square: boolean;
  };
  setShowAreaByShape: React.Dispatch<React.SetStateAction<{
    circle: boolean;
    triangle: boolean;
    square: boolean;
  }>>;
  showHeight: boolean;
  setShowHeight: (show: boolean) => void;
  showDiameter: boolean;
  setShowDiameter: (show: boolean) => void;
  showCircumference: boolean;
  setShowCircumference: (show: boolean) => void;
  showLength?: boolean;
  setShowLength?: (show: boolean) => void;
  showMidpoint?: boolean;
  setShowMidpoint?: (show: boolean) => void;
  showMeasurement?: boolean;
  setShowMeasurement?: (show: boolean) => void;
  showArcRadius?: boolean;
  setShowArcRadius?: (show: boolean) => void;
}

export interface DropdownProps {
  difficulty: string;
  setDifficulty: (d: string) => void;
}

export interface LimitAttemptsProps {
  limit: number | null;
  setLimit: (n: number | null) => void;
}

export interface MainAreaProps {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  setSelectedTool: (tool: string | null) => void;
  saveButton?: React.ReactNode;
  shapeLimit: number;
  shapeCount: number;
  onLimitReached: () => void;
  onAllShapesDeleted: () => void;
  pxToUnits: (px: number) => number;
  showAreaByShape: {
    circle: boolean;
    triangle: boolean;
    square: boolean;
  };
  showSides: boolean;
  showAngles: boolean;
  showDiameter: boolean;
  showCircumference: boolean;
  showHeight: boolean;
  showLength?: boolean;
  showMidpoint?: boolean;
  showMeasurement?: boolean;
  showArcRadius?: boolean;
}

export interface ExistingProblemsListProps {
  problems: Problem[];
  onEdit: (problemId: string) => void;
  onDelete: (problemId: string) => void;
}

export interface PromptBoxProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  editingPrompt: boolean;
  setEditingPrompt: (editing: boolean) => void;
  promptInputRef: React.RefObject<HTMLTextAreaElement>;
}

export interface SetVisibilityProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

export interface ShapeLimitPopupProps {
  onClose: () => void;
}

export interface TimerProps {
  timerOpen: boolean;
  setTimerOpen: (open: boolean) => void;
  timerValue: number;
  setTimerValue: (value: number) => void;
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ToolboxProps {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  shapes: Array<{ id: number; type: string; [key: string]: any }>;
  showSides?: boolean;
  setShowSides?: (show: boolean) => void;
  showAngles?: boolean;
  setShowAngles?: (show: boolean) => void;
  showHeight?: boolean;
  setShowHeight?: (show: boolean) => void;
  showDiameter?: boolean;
  setShowDiameter?: (show: boolean) => void;
  showCircumference?: boolean;
  setShowCircumference?: (show: boolean) => void;
  showLength?: boolean;
  setShowLength?: (show: boolean) => void;
  showMidpoint?: boolean;
  setShowMidpoint?: (show: boolean) => void;
  showMeasurement?: boolean;
  setShowMeasurement?: (show: boolean) => void;
  showArcRadius?: boolean;
  setShowArcRadius?: (show: boolean) => void;
  showAreaByShape?: { circle: boolean; triangle: boolean; square: boolean };
  setShowAreaByShape?: (show: { circle: boolean; triangle: boolean; square: boolean }) => void;
}
