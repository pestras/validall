export declare const To: {
    lowercase: (value: string) => string;
    uppercase: (value: string) => string;
    capitalizeFirst: (value: string) => string;
    capitalizeFirstAll: (value: string) => string;
    trim: (value: string) => string;
    path: (value: string) => string;
};
export declare const ValidallRepo: Map<string, any>;
export declare function isSchema(input: {
    [key: string]: any;
}): boolean;
export declare class ReferenceState {
    private static state;
    static HasReference(vName: string, reference: string): boolean;
    static SetReference(vName: string, reference: string): void;
}
