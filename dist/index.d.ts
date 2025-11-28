import { FormatOptions } from "./utils/formater";
export declare class pseudoe {
    private opts;
    constructor(options: FormatOptions);
    options(options: FormatOptions): void;
    default(tag?: string): string;
    style(theme?: string): string;
    random(...themes: string[]): string;
}
