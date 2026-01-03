import { useState, useRef, useCallback } from 'react';

export const useProblemFormState = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [difficulty, setDifficulty] = useState("Easy");
  
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerValue, setTimerValue] = useState(5);

  const [hintOpen, setHintOpen] = useState(false);
  const [hint, setHint] = useState("");

  const [limitAttempts, setLimitAttempts] = useState<number | null>(1);
  const [visible, setVisible] = useState(true);

  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const resetForm = useCallback(() => {
    setTitle("");
    setPrompt("");
    setDifficulty("Easy");
    setLimitAttempts(1);
    setTimerOpen(false);
    setTimerValue(5);
    setHintOpen(false);
    setHint("");
    setVisible(true);
  }, []);

  return {
    title,
    setTitle,
    prompt,
    setPrompt,
    editingPrompt,
    setEditingPrompt,
    promptInputRef,
    difficulty,
    setDifficulty,
    timerOpen,
    setTimerOpen,
    timerValue,
    setTimerValue,
    hintOpen,
    setHintOpen,
    hint,
    setHint,
    limitAttempts,
    setLimitAttempts,
    visible,
    setVisible,
    showLimitPopup,
    setShowLimitPopup,
    resetForm,
  };
};
