import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.3/index.js';
import exec from 'k6/execution';
import http, { Params } from 'k6/http';
import { Options } from 'k6/options.js';
import { CONFIG, HTTP_METHOD, ThresholdAndTags } from '../models';
import { Utils } from '../utils';

const config: CONFIG = Utils.loadConfig();
const thresholdAndTags: ThresholdAndTags = Utils.getThresholdsAndTags(config.requests);

http.setResponseCallback(http.expectedStatuses(200));

// Init code (Once per VU)
export const options: Options = {
  vus: 1,
  iterations: 3,
  discardResponseBodies: true,
  noCookiesReset: true,
  insecureSkipTLSVerify: true,
  thresholds: {
    'iteration_duration{group:::setup}': [`max>=0`],
    'iteration_duration{scenario:default}': [`max>=0`],
    'http_req_duration{group:::setup}': [`max>=0`],
    'http_req_duration{scenario:default}': [`max>=0`],
    http_req_failed: ['rate===0'],
    ...thresholdAndTags.thresholds,
  },
};

// Setup code (Once)
export function setup() {
  const authToken = Utils.getAuthToken(config.authInfo);
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };
}

// VU code (Once per iteration, as many times as the test options require)
export default function (params: Params) {
  config.requests.forEach((request, index) => {
    const url = `${config.baseUrl}${request.path}`;
    params.tags = thresholdAndTags.tags[index];

    switch (request.method.toUpperCase()) {
      case HTTP_METHOD.GET:
        http.get(url, params);
        break;
      case HTTP_METHOD.POST:
        http.post(url, JSON.stringify(request.body), params);
        break;
      default:
        // will abort the test returning the exit code 108
        exec.test.abort(`Request: '${request.tag}', Invalid method: '${request.method}'. Possible values: [GET, POST].`);
    }
  });
}

// After your test runs, k6 aggregates your metrics into a JavaScript object. The handleSummary() function takes this object as an argument
export function handleSummary(data: unknown) {
  let manipulatedData = JSON.parse(JSON.stringify(data));
  delete manipulatedData.setup_data;
  return {
    stdout: textSummary(manipulatedData, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(manipulatedData),
  };
}
