export interface ISidebarResponseArrayObject {
    url: string | null,
    preview_url: string | null,
    default: boolean,
    title: string | null,
    readable_content: string | null
}

export interface ISidebarTab {
    title: string,
    url: URL,
    default: boolean
}

export interface IDrawerResponse {
    show_drawer: boolean,
    url: string
}