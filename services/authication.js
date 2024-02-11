import jwt from "jsonwebtoken";
const secret = "Superman@123";
export const createtoken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role:user.role
    },
    secret
  );
  return token;
};
export const validate = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};
