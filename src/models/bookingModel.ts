import mongoose, { Model, Schema, Types } from "mongoose";
import { IBooking } from "../common/interfaces/booking";
import { PaymentStatus } from "../common/constants";

export interface IBookingDocument extends IBooking, Document {
  _id: Types.ObjectId;
}

const BookingSchema = new Schema<IBookingDocument>({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: [true, "Property ID is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.Pending,
  },
});

const Booking: Model<IBookingDocument> = mongoose.model<IBookingDocument>(
  "Booking",
  BookingSchema,
);

export default Booking;
