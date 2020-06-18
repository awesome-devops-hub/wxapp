import { MockData } from "../Mock";
import {
  AnnualLeaveInfoResponse,
  AnnualLeaveInfoRequest,
  IAnnualLeavePb,
} from "../../protocol/LeaveProto";

const mockData: IAnnualLeavePb = {
  taken: "3",
  balanceToDate: "5",
  balanceToYearEnd: "13",
};

export const mockLeave: MockData[] = [
  {
    request: AnnualLeaveInfoRequest,
    response: () =>
      AnnualLeaveInfoResponse.create({
        data: mockData,
      }),
  },
];
