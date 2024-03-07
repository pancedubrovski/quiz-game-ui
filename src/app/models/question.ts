import { QuestionStatus } from "./questionStatus";

export  interface Question {
    index: number;
    questionId: number;
    expression: string;
    status: QuestionStatus;
    kind: string;
    isCorrected?: boolean;
    result?: string;
    answer?: string;
}