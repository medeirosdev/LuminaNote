/**
 * Type declarations for sql.js module
 */
declare module 'sql.js' {
    export interface Database {
        run(sql: string, params?: unknown[]): void;
        exec(sql: string): QueryExecResult[];
        prepare(sql: string): Statement;
        export(): Uint8Array;
        close(): void;
    }

    export interface Statement {
        bind(params?: unknown[]): boolean;
        step(): boolean;
        get(): unknown[];
        free(): void;
    }

    export interface QueryExecResult {
        columns: string[];
        values: unknown[][];
    }

    export interface SqlJsStatic {
        Database: new (data?: ArrayLike<number>) => Database;
    }

    export interface InitSqlJsOptions {
        locateFile?: (file: string) => string;
    }

    export default function initSqlJs(options?: InitSqlJsOptions): Promise<SqlJsStatic>;
}
