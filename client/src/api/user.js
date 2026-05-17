import { axiosInstance } from ".";

export const RegisterUser = async (value) => {
  const response = await axiosInstance.post("/api/users/register", value);
  return response.data;
};

export const LoginUser = async (value) => {
  const response = await axiosInstance.post("/api/users/login", value);
  return response.data;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance.get("/api/users/get-current-user");
  return response.data;
};

export const ForgetPassword = async (value) => {
  const response = await axiosInstance.patch(
    "/api/users/forgetpassword",
    value,
  );
  return response.data;
};

export const ResetPassword = async (value, id) => {
  const response = await axiosInstance.patch(
    `/api/users/resetpassword/${id}`,
    value,
  );
  return response.data;
};
