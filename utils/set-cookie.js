export const setRefreshTokenCookie = (res, r) => {
  console.log(res.cookie);
  const maxAge = 30 * 24 * 60 * 60 * 1000;
  res.cookie("refreshToken", r, { maxAge, httpOnly: true });
}