export interface IRepo {
  description: string;
  id: number;
  name: string;
  releases: IRepoVersion[];
  url: string;
}

export interface IRepoVersion {
  body: string;
  id: number;
  releaseDate: string;
  repoId: number;
  seen: boolean;
  version: string;
  versionId: number;
}
