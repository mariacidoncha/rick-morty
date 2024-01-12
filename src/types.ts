export type Info = {
    next: string
}

export type API = {
    info: Info,
    results: Episode[]
}

export type Episode = {
    name: string,
    air_date: string,
    episode: string
}
