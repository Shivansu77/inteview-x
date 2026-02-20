import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for Web Speech Synthesis (TTS).
 * Handles voice selection, Chrome workarounds, and avatar state.
 */
export function useSpeechSynthesis({ onSpeakStart, onSpeakEnd } = {}) {
  const keepAliveRef = useRef(null);
  const isMountedRef = useRef(true);

  // Track mount state so we don't update after unmount
  useEffect(() => {
    isMountedRef.current = true;

    // Pre-load voices (some browsers fire voiceschanged async)
    const synth = window.speechSynthesis;
    synth.getVoices();
    const handleVoicesChanged = () => synth.getVoices();
    synth.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      isMountedRef.current = false;
      synth.cancel();
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, []);

  const speakText = useCallback(
    (text) => {
      return new Promise((resolve) => {
        if (!text || text.trim().length === 0) {
          resolve();
          return;
        }

        const synth = window.speechSynthesis;
        synth.cancel();

        setTimeout(() => {
          if (!isMountedRef.current) { resolve(); return; }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.93;
          utterance.pitch = 1.05;
          utterance.volume = 1.0;

          // Pick the best English voice available
          const voices = synth.getVoices();
          const preferred =
            voices.find(
              (v) =>
                v.lang.startsWith("en") &&
                (v.name.includes("Samantha") ||
                  v.name.includes("Daniel") ||
                  v.name.includes("Karen") ||
                  v.name.includes("Google US English"))
            ) ||
            voices.find((v) => v.lang.startsWith("en") && v.localService) ||
            voices.find((v) => v.lang.startsWith("en"));

          if (preferred) utterance.voice = preferred;

          utterance.onstart = () => {
            if (isMountedRef.current) onSpeakStart?.();
          };

          // Chrome bug: long utterances cut off after ~15s
          keepAliveRef.current = setInterval(() => {
            if (!synth.speaking) {
              clearInterval(keepAliveRef.current);
              keepAliveRef.current = null;
              return;
            }
            synth.pause();
            synth.resume();
          }, 10000);

          utterance.onend = () => {
            if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
            if (isMountedRef.current) onSpeakEnd?.();
            resolve();
          };

          utterance.onerror = (e) => {
            if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
            console.warn("TTS error:", e?.error);
            if (isMountedRef.current) onSpeakEnd?.();
            resolve();
          };

          if (synth.paused) synth.resume();
          synth.speak(utterance);
        }, 80);
      });
    },
    [onSpeakStart, onSpeakEnd]
  );

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
  }, []);

  const warmUp = useCallback(() => {
    const warm = new SpeechSynthesisUtterance(" ");
    warm.volume = 0.01;
    window.speechSynthesis.speak(warm);
  }, []);

  return { speakText, cancelSpeech, warmUp };
}
