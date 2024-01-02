import * as z from 'zod';

export enum EQuestionType {
    TextShort = 'text:short',
    TextLong = 'text:long',
    TextEmail = 'text:email',
    TextNumber = 'text:number',
    TextURL = 'text:url',
    TextPhone = 'text:phone',
    TextPassword = 'text:password',
    TextAddress = 'text:address',
    SelectSingle = 'select:single',
    SelectMultiple = 'select:multiple',
    Date = 'date',
    Time = 'time',
    DateTime = 'datetime',
    Radio = 'radio',
    Checkbox = 'checkbox',
    File = 'file',
    Image = 'image',
    Rating = 'rating',
    Range = 'range',
    Color = 'color',
}

export const ZQuestion = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
    placeholder: z.string().optional(),
    type: z.nativeEnum(EQuestionType),
});

export type TQuestion = z.infer<typeof ZQuestion>;