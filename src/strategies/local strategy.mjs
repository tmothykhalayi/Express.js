import passport from "passport";
import LocalStrategy, { Strategy } from "passport-local";
export const mockusers = [
    {
        id: 1,
        username: "admin",
        password: "password",
        displayname: "Admin"
    },
    {
        id: 2,
        username: "user",
        password: "password",
        displayname: "User"
    }
];
//serializing and deserializing users
passport.serializeUser((user, done) => {
    console.log('serializing user');
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    console.log('deserializing user');  
    const user = mockusers.find(user => user.id === id);
    done(null, user);
});
console.log('usernames${mockusers[0].username}');
console.log('passwords${mockusers[0].password}');
passsport.use(
    new Strategy((username, password, done) => {
        const user = mockusers.find(user => user.username === username);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } )
);