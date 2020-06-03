import { MockData } from "../Mock";
import {
  HotSearchRequest,
  SearchHistoryRequest,
  HotSearchResponse,
  SearchHistoryResponse,
} from "../../protocol/SearchProto";

const pagingMock = {
  page: 0,
  size: 10,
  totalCount: 12,
  totalPage: 10,
};
const searchEntriesMock = [
  "Leave Policy",
  "Salary Statement",
  "How to",
  "VPN Stuff",
  "Wifi Guest",
  "Offices",
  "Admin Contacts",
  "Insurance",
  "EAP",
  "Code of Conduct",
  "Invoice",
  "Buddy Program",
];
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const mockSearch: MockData[] = [
  {
    request: HotSearchRequest,
    response: () =>
      HotSearchResponse.create({
        paging: pagingMock,
        entries: {
          entries: searchEntriesMock.slice(getRandomIntInclusive(1, 12)),
        },
      }),
  },
  {
    request: SearchHistoryRequest,
    response: () =>
      SearchHistoryResponse.create({
        paging: pagingMock,
        entries: {
          entries: searchEntriesMock.slice(getRandomIntInclusive(1, 12)),
        },
      }),
  },
];
