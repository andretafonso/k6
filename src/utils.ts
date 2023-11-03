import { check } from 'k6';
import { SharedArray } from 'k6/data';
import http from 'k6/http';
import { AuthInfo, BodyType, CONFIG, REQUEST, TestsFile, ThresholdAndTags } from '../models';

export class Utils {
  static loadConfig = (): CONFIG => {
    return {
      authInfo: getData<AuthInfo>(`${__ENV.AUTH_INFO}`),
      baseUrl: `${__ENV.API_URL}`,
      requests: getRequests(`${__ENV.DATA_FILE}`),
    };
  };

  static getAuthToken = (authInfo: AuthInfo) => {
    const loginRes = http.post(authInfo.url, authInfo.data, { responseType: 'text' });
    const authToken = loginRes.json(authInfo.tokenPath);
    check(authToken, { 'logged in successfully': () => authToken !== '' });
    return authToken;
  };

  static getThresholdsAndTags = (requests: REQUEST[]): ThresholdAndTags => {
    return requests.reduce(
      (thresholdAndTags: ThresholdAndTags, request: REQUEST) => {
        thresholdAndTags.thresholds[`http_req_duration{name:${request.tag}}`] = [`min<=${request.threshold}`];
        thresholdAndTags.tags.push({ name: request.tag });
        return thresholdAndTags;
      },
      { thresholds: {}, tags: [] }
    );
  };
}

/////// Private methods ///////
const getData = <T>(filePath: string): T => {
  return JSON.parse(open(filePath));
};

const getRequests = (filePath: string): REQUEST[] => {
  return new SharedArray('requests', function () {
    const loadedRequests: REQUEST[] = getData<TestsFile>(filePath).requests;
    return loadedRequests.reduce((requestsToTest: REQUEST[], request: REQUEST) => {
      if (request.disable) return requestsToTest;
      if (request.body.name_of_the_file) {
        request.body = getData<BodyType>(`${request.body.name_of_the_file}`);
      }
      requestsToTest.push(request);
      return requestsToTest;
    }, []);
  });
};
