export interface Character {
    id:       number;
    name:     string;
    status:   string;
    species:  string;
    type:     string;
    gender:   string;
    origin:   Location;
    location: Location;
    image:    string;
    episode:  string[];
    url:      string;
    created:  Date;
}

export enum Unknown {
    Status = "Maybe is alive or not",
    Origin = "We don't know where this character comes from",
    Gender = "Gender undefined",
    Dimension = "This location has no dimension"
}

export interface Location {
    name: string;
    url:  string;
}
