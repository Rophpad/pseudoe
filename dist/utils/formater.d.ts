export type CaseStyle = "lower" | "upper" | "kebab" | "snake" | "camel" | "pascal" | "none";
export interface FormatOptions {
    sep?: string;
    case?: CaseStyle;
    prefix?: string;
    suffix?: string;
    tokenLength?: number;
    useUUID?: boolean;
}
export declare function formatPseudoe(base: string, opts?: FormatOptions): string;
