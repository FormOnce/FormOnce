import type { JSONSchema7 } from 'json-schema'

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-explicit-any
export type TFormSchema = {
  type: JSONSchema7['type']
  description?: string
  properties: JSONSchema7['properties']
  required: string[]
}
