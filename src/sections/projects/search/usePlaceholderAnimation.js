import { useEffect, useState } from 'react';
import { getJamoSequenceForTyping, jamosToDisplayForTyping } from './hangul.js';

const TYPING_MS = 90;
const PAUSE_AFTER_FULL_MS = 2000;
const PAUSE_AFTER_EMPTY_MS = 1000;
const CURSOR_BLINK_MS = 500;

const JAMO_FIRST = 0x3131;
const JAMO_LAST = 0x318e;

function isJamo(c) {
  if (typeof c !== 'string' || c.length !== 1) return false;
  const code = c.charCodeAt(0);
  return code >= JAMO_FIRST && code <= JAMO_LAST;
}

function prefixToDisplay(prefixList) {
  if (prefixList.length === 0) return '';
  let idx = 0;
  while (idx < prefixList.length && !isJamo(prefixList[idx])) idx++;
  const asciiPart = prefixList.slice(0, idx).join('');
  const jamoPart = prefixList.slice(idx).join('');
  return asciiPart + (jamoPart ? jamosToDisplayForTyping(jamoPart) : '');
}

function getTypingSteps(str) {
  const jamoList = getJamoSequenceForTyping(str);
  const steps = [];
  for (let i = 1; i <= jamoList.length; i++) {
    steps.push(prefixToDisplay(jamoList.slice(0, i)));
  }
  return steps;
}

function getDeleteStepsBySyllable(str) {
  const units = [...str];
  const steps = [];
  for (let i = units.length; i >= 0; i--) {
    steps.push(units.slice(0, i).join(''));
  }
  return steps;
}

export function usePlaceholderAnimation(examples, opts = {}) {
  const paused = Boolean(opts?.paused);
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

  const list = Array.isArray(examples) && examples.length > 0 ? examples : ['검색...'];

  useEffect(() => {
    if (paused) {
      setDisplayText('');
      setStepIndex(0);
      setExampleIndex(0);
      setPhase('typing');
    }
  }, [paused]);

  useEffect(() => {
    setExampleIndex(0);
    setStepIndex(0);
    setPhase('typing');
    setDisplayText('');
  }, [list]);

  useEffect(() => {
    if (paused) return;
    let t;
    const full = list[exampleIndex];
    const typingSteps = getTypingSteps(full);
    const deleteSteps = getDeleteStepsBySyllable(full);

    if (phase === 'typing') {
      if (stepIndex >= typingSteps.length) {
        t = setTimeout(() => setPhase('pauseFull'), 0);
        return () => clearTimeout(t);
      }
      setDisplayText(typingSteps[stepIndex]);
      t = setTimeout(() => setStepIndex((s) => s + 1), TYPING_MS);
      return () => clearTimeout(t);
    }

    if (phase === 'pauseFull') {
      t = setTimeout(() => {
        setPhase('deleting');
        setStepIndex(0);
      }, PAUSE_AFTER_FULL_MS);
      return () => clearTimeout(t);
    }

    if (phase === 'deleting') {
      if (stepIndex >= deleteSteps.length) {
        t = setTimeout(() => setPhase('pauseEmpty'), 0);
        return () => clearTimeout(t);
      }
      setDisplayText(deleteSteps[stepIndex]);
      t = setTimeout(() => setStepIndex((s) => s + 1), TYPING_MS);
      return () => clearTimeout(t);
    }

    if (phase === 'pauseEmpty') {
      t = setTimeout(() => {
        setExampleIndex((i) => (i + 1) % list.length);
        setPhase('typing');
        setStepIndex(0);
      }, PAUSE_AFTER_EMPTY_MS);
      return () => clearTimeout(t);
    }
  }, [paused, list, exampleIndex, stepIndex, phase]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCursorVisible((v) => !v);
    }, CURSOR_BLINK_MS);
    return () => clearInterval(id);
  }, [paused]);

  return { displayText, cursorVisible };
}

export default usePlaceholderAnimation;
