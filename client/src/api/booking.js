import { axiosInstance } from ".";

/** Current user's bookings — requires auth (JWT in axios interceptor). */
export const getMyBookings = async () => {
  const response = await axiosInstance.get("/api/booking/get-all-bookings");
  return response.data;
};
