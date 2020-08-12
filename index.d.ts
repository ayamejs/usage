
declare module "@ayamejs/usage" {
  export interface Tag {
    name: string;
    type: string;
    required: boolean;
    rest: boolean;
    options?: string[];
    literal: boolean;
  }

  export function parse(input: string): Tag;
  export function format(input: string, sep?: string): string;

  const version: string;
  export { version };
}
