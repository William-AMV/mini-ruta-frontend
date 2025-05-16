export enum RoleEnum {
    ADMINISTRATOR = "Administrator",
    PUBLISHER = "Publisher"
}

export interface RoleList {
    key: string | null,
    value: string
}

export const RoleTypeList: RoleList[] = Object.entries(RoleEnum).map(([key, value]) => ({key, value}));
