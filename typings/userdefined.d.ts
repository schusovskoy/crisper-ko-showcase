declare class Inputmask {
    constructor(pattern: string);
    mask(element: HTMLElement);
    unmaskedvalue(): string;
}

declare var VK: any;
declare var FB: any;

declare function require(moduleId: string): any;