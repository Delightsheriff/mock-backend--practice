// import { Request, Response } from "express";
// import Booking from "../../models/bookingModel";
// import Property from "../../models/propertyModel";

// const async function BookProperty (req: Request, res: Response) {
//   try {
//     const { homeId, userId, startDate, endDate } = req.body;

//     // Check if the home exists and is available
//     const home = await Property.findById(homeId);
//     if (!home || !home.available) {
//       return res.status(400).json({ error: 'Home is not available' });
//     }

//     // Check if there are available slots
//     if (home.slots <= 0) {
//       return res.status(400).json({ error: 'No available slots for this home' });
//     }

//     // Ensure the start date is at least one week from now
//     const oneWeekFromNow = new Date();
//     oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
//     const requestedStartDate = new Date(startDate);

//     if (requestedStartDate < oneWeekFromNow) {
//       return res.status(400).json({ error: 'Start date must be at least one week from today' });
//     }

//     // Calculate total price (starting from one week after the requested start date)
//     const actualStartDate = new Date(requestedStartDate);
//     actualStartDate.setDate(actualStartDate.getDate() + 7);
//     const days = Math.ceil((new Date(endDate).getTime() - actualStartDate.getTime()) / (1000 * 3600 * 24));
//     const totalPrice = home.price * days;

//     // Create a new booking
//     const booking = new Booking({
//       homeId,
//       userId,
//       startDate: actualStartDate,
//       endDate,
//       totalPrice,
//       paymentStatus: 'pending'
//     });

//     // Save the booking and update home slots
//     await booking.save();
//     home.slots -= 1;
//     await home.save();

//     // Initiate payment
//     const paymentRequest = {
//       email: req.body.email!, // Assuming the user's email is sent in the request
//       amount: totalPrice,
//     };
//     const paymentResponse = await initializePayment(req, res);

//     // Update booking with payment information
//     booking.paymentStatus = paymentResponse.data.status === 'success' ? 'completed' : 'failed';
//     await booking.save();

//     res.json({
//       booking: booking,
//       paymentInfo: paymentResponse.data
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while booking the home' });
//   }
// }
