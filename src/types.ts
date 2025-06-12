/*──────────────────────────────┐
│  Общие типы обмена с расширением │
└──────────────────────────────*/

export type SummarizerButton = "summarize" | "timestamps" | "question";

/** Что присылает расширение на /api/analyze */
export interface SummarizerRequestPayload {
  /** YouTube-ID ролика */
  videoId: string;
  /** Нажатая кнопка */
  button: SummarizerButton;
  /** Язык ответа (ISO-2) */
  lang: string;
  /** Уровень детализации */
  detail: string;
  /** Текст вопроса (может быть null) */
  query: string | null;
  /** Полный транскрипт видео */
  transcript: string;
  /** Epoch-метка на стороне расширения */
  ts: number;
}

/*────────── Ответ сервера ─────────*/

/** Успешный результат */
export interface SummarizerOk {
  ok: true;
  videoId: string;
  button: SummarizerButton;
  /** Итоговый текст (summary / timestamps / answer) */
  result: string;
}

/** Ошибка (любая) */
export interface SummarizerFail {
  ok: false;
  error: string; // человекочитаемое сообщение
}

/** Итоговый тип, который реально возвращается */
export type SummarizerResponse = SummarizerOk | SummarizerFail;
