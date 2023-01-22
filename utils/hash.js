import bcrypt from 'bcrypt';

export const getHashPassword = async (p) => {
  return bcrypt.hash(p, 3);
};

export const comparePassword = async (p, u) => {
  return await bcrypt.compare(p, u);
}