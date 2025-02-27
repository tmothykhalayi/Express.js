import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = (password) =>{
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password, salt);

};
bcrypt.hashSync('password', 10);
export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
export const generateToken = (id) => jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
export const verifyToken = (token) => jwt.verify(token, process.env.SECRET);
export const findUser = (id) => mockusers.find(user => user.id === id);
export const findUserByEmail = (email) => mockusers.find(user => user.email === email);
export const findUserByUsername = (username) => mockusers.find(user => user.username === username);
export const findUserByToken = (token) => mockusers.find(user => user.token === token);
export const findUserByResetToken = (resetToken) => mockusers.find(user => user.resetToken === resetToken);
export const findUserByVerificationToken = (verificationToken) => mockusers.find(user => user.verificationToken === verificationToken);
export const findUserByPassword = (password) => mockusers.find(user => user.password === password);
export const findUserByRole = (role) => mockusers.find(user => user.role === role);
export const findUserByStatus = (status) => mockusers.find(user => user.status === status);
export const findUserByCreatedAt = (createdAt) => mockusers.find(user => user.createdAt === createdAt);
export const findUserByUpdatedAt = (updatedAt) => mockusers.find(user => user.updatedAt === updatedAt);
export const findUserByDeletedAt = (deletedAt) => mockusers.find(user => user.deletedAt === deletedAt);
export const findUserByFirstname = (firstname) => mockusers.find(user => user.firstname === firstname);
export const findUserByLastname = (lastname) => mockusers.find(user => user.lastname === lastname);
export const
export const findUserBy
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);      
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);
export const findUserBy = (email) => mockusers.find(user => user.email === email);