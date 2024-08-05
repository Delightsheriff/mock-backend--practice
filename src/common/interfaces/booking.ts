import { Types } from "mongoose";
import { PaymentStatus } from "../constants";

export interface IBooking {
  propertyId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  paymentStatus: PaymentStatus;
}
