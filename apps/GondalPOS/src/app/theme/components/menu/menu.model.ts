export class Menu {
    constructor(
        public id: number,
        public title: string,
        public routerLink: string|any,
        public href: string|null,
        public icon: string,
        public target: string|null,
        public hasSubMenu: boolean,
        public parentId: number,
        public groupid: number[]
    ) { }
}
