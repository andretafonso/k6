import { RequestBody } from 'k6/http';

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
}

export interface TestsFile {
  requests: REQUEST[];
}

export type BodyType = Record<string, unknown>;

export interface REQUEST {
  disable: boolean;
  method: HTTP_METHOD;
  path: string;
  body: BodyType;
  threshold: number;
  tag: string;
}

export type Threshold = Record<string, string[]>;

export interface Tag {
  [name: string]: string;
}

export interface ThresholdAndTags {
  thresholds: Threshold;
  tags: Tag[];
}

export interface AuthInfo {
  url: string;
  data: RequestBody;
  tokenPath: string;
}

export interface CONFIG {
  authInfo: AuthInfo;
  baseUrl: string;
  requests: REQUEST[];
}
