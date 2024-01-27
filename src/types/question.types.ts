import * as z from 'zod';

export enum EQuestionType {
    Text = 'text',
    Select = 'select',
    // TODO: Implement the rest of the types
    // Date = 'date',
    // Time = 'time',
    // DateTime = 'datetime',
    // Radio = 'radio',
    // Checkbox = 'checkbox',
    // File = 'file',
    // Image = 'image',
    // Rating = 'rating',
    // Range = 'range',
    // Color = 'color',
}

export enum ETextSubType {
    Short = 'short',
    Long = 'long',
    Email = 'email',
    Number = 'number',
    URL = 'url',
    Phone = 'phone',
    Password = 'password',
    Address = 'address',
}

export enum ESelectSubType {
    Single = 'single',
    Multiple = 'multiple',
}

const ZBaseQuestion = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
    placeholder: z.string().optional(),
    type: z.nativeEnum(EQuestionType),
});

export const ZTextQuestion = z.object({
    ...ZBaseQuestion.shape,
    type: z.literal(EQuestionType.Text),
    subType: z.nativeEnum(ETextSubType),
});

export type TTextQuestion = z.infer<typeof ZTextQuestion>;

export const ZSelectQuestion = z.object({
    ...ZBaseQuestion.shape,
    type: z.literal(EQuestionType.Select),
    subType: z.nativeEnum(ESelectSubType),
    options: z.array(z.string()),
});

export type TSelectQuestion = z.infer<typeof ZSelectQuestion>;

export const ZQuestion = z.union([ZTextQuestion, ZSelectQuestion]);

export type TQuestion = z.infer<typeof ZQuestion>;