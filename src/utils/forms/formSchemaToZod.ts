import jsonSchemaToZod from "json-schema-to-zod";
import type { ZodObject } from "zod";
import type { TFormSchema } from "~/types/form.types";

/* eslint-disable */

export function parseZodObjectFromString(str: string): ZodObject<any> {
    const { z } = require("zod");

    // Assuming str contains a valid Zod object string
    // Wrap the string inside a function to evaluate it
    const evalString = `(function() { return ${str}; })();`;

    // Evaluate the string and execute the function to get the Zod object
    const zodObject = eval(evalString) as ZodObject<any>;

    // Ensure that the evaluated object is of type Zod.Object
    if (zodObject instanceof z.ZodObject) {
        return zodObject;
    } else {
        throw new Error("Parsed object is not a Zod.Object");
    }
}

export function formSchemaToZod(formSchema: TFormSchema) {
    return parseZodObjectFromString(jsonSchemaToZod(formSchema));
}