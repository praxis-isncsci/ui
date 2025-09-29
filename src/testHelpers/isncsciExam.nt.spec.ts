import { describe, it, expect } from '@jest/globals';
import { IsncsciExamProvider } from '@app/providers/isncsciExam.provider';
import { getEmptyExamData } from '@core/helpers/examData.helper';
import { ExamData, MotorLevel, MotorLevels, SensoryLevels } from '@core/domain';
import ntCases from './ntCases.json';

type NtCase = {
    id: number;
    group: string;
    comments?: string | null;
    analContraction?: 'Yes' | 'No';
    analSensation?: 'Yes' | 'No';
    totals?: Record<string, string>;
    [key: string]: any;
};

const toExamData = (c: NtCase): ExamData => {
    const exam = getEmptyExamData();

    // VAC / DAP
    exam.voluntaryAnalContraction = c.analContraction ?? null;
    exam.deepAnalPressure = c.analSensation ?? null;

    // Comments
    exam.comments = c.comments ?? null;

    // Non-key muscles
    exam.rightLowestNonKeyMuscleWithMotorFunction = null as unknown as MotorLevel | null;
    exam.leftLowestNonKeyMuscleWithMotorFunction = null as unknown as MotorLevel | null;

    // Sensory values
    SensoryLevels.forEach((lvl) => {
        const key = lvl.toLowerCase();
        const rt = (c as any)[`${key}RightTouch`] ?? '';
        const rp = (c as any)[`${key}RightPrick`] ?? '';
        const lt = (c as any)[`${key}LeftTouch`] ?? '';
        const lp = (c as any)[`${key}LeftPrick`] ?? '';

        (exam as any)[`rightLightTouch${lvl}`] = rt;
        (exam as any)[`rightPinPrick${lvl}`] = rp;
        (exam as any)[`leftLightTouch${lvl}`] = lt;
        (exam as any)[`leftPinPrick${lvl}`] = lp;
    });

    // Motor values (only for motor levels)
    MotorLevels.forEach((lvl) => {
        const key = lvl.toLowerCase();
        const rm = (c as any)[`${key}RightMotor`] ?? '';
        const lm = (c as any)[`${key}LeftMotor`] ?? '';

        (exam as any)[`rightMotor${lvl}`] = rm;
        (exam as any)[`leftMotor${lvl}`] = lm;
    });

    return exam;
};

const normalize = (s: unknown): string =>
    String(s ?? '')
        .normalize('NFKC')
        .replace(/[–—]/g, '-')
        // Collapse spaces around hyphens and commas
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*,\s*/g, ', ')
        // Collapse multiple spaces
        .replace(/\s{2,}/g, ' ')
        .trim();

describe('ISNCSCI NT fixtures → IsncsciExamProvider', () => {
    const provider = new IsncsciExamProvider();

    // Map fixture totals keys -> provider output keys
    const keyAlias: Record<string, string> = {
        rightTouchTotal: 'rightLightTouchTotal',
        leftTouchTotal: 'leftLightTouchTotal',
        rightPrickTotal: 'rightPinPrickTotal',
        leftPrickTotal: 'leftPinPrickTotal',
        touchTotal: 'lightTouchTotal',
        prickTotal: 'pinPrickTotal',
    };

    (ntCases as NtCase[]).forEach((fixture) => {
        const title = `case #${fixture.id} (${fixture.group ?? 'undefined'})`;

        it(title, async () => {
        const examData = toExamData(fixture);
        const result = await provider.calculate(examData);

        const expectedTotals = fixture.totals ?? {};

        Object.entries(expectedTotals).forEach(([k, v]) => {
            const resolvedKey = keyAlias[k] ?? k;
            if (resolvedKey in result) {
            const actual = normalize((result as any)[resolvedKey]);
            const expected = normalize(v);
            expect(actual).toBe(expected);
            }
        });

        if (fixture.analContraction) {
            expect(typeof result.injuryComplete).toBe('string');
        }
        if (fixture.comments) {
            expect(result.neurologicalLevelOfInjury).toEqual(expect.any(String));
        }
        });
    });
});
