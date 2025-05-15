import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from 'bcryptjs'; // Import bcryptjs for password comparison
import config from "@/config"; // Assuming this file exists and is configured
import connectMongo from "./mongo"; // Assuming this utility connects to MongoDB

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        // This profile function is used when a user signs in with Google.
        // It shapes the user object that NextAuth will use.
        return {
          id: profile.sub, // Google's unique ID for the user
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified, // Good to store this
          createdAt: new Date(), // Good for tracking when the user first signed up via Google
        };
      },
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password", placeholder: "Your password" }
      },
      async authorize(credentials, req) {
        // Ensure credentials are provided
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const { email, password } = credentials;
        let client;

        try {
          // Wait for the MongoDB connection promise to resolve
          // connectMongo should be a Promise that resolves to a MongoClient instance
          client = await connectMongo;
          const db = client.db(); // Use your database name if it's not the default one in the URI

          // Find the user by email in your 'users' collection
          // Adjust 'users' if your collection has a different name
          const user = await db.collection('users').findOne({ email: email.toLowerCase() });

          if (!user) {
            console.log("No user found with this email:", email);
            return null; // User not found
          }

          // Check if the user document has a password (it might be an OAuth-only account)
          if (!user.password) {
            console.log("User found but has no password set (possibly OAuth account):", email);
            return null; // Or handle as a specific error like "Please sign in with your social account"
          }

          // Compare the provided password with the stored hashed password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          console.log(password, user.password)

          if (!passwordsMatch) {
            console.log("Password does not match for user:", email);
            return null; // Passwords do not match
          }

          console.log("Credentials validated for user:", email);
          // If authentication is successful, return the user object
          // Ensure the returned object structure is consistent with what your app expects
          // and what other providers (like Google) might return.
          // Exclude sensitive information like the password hash.
          return {
            id: user._id.toString(), // MongoDB ObjectId to string
            name: user.name,
            email: user.email,
            image: user.image,
            // Add any other user properties you want in the JWT/session
            // e.g., role: user.role
          };

        } catch (error) {
          console.error("Error in authorize function:", error);
          return null; // Return null on any error
        }
        // Note: MongoClient connection closing is typically handled by the MongoDBAdapter
        // or at the application level, not usually within each authorize call.
        // If connectMongo establishes a new connection each time and doesn't manage pooling/closing,
        // you might need to add client.close() in a finally block, but this is uncommon for shared promises.
      }
    })
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    // The session callback is called whenever a session is checked.
    // By default, only a subset of the token is returned for security reasons.
    // We are adding the user's ID (from token.sub) to the session object.
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub; // token.sub contains the user ID from authorize or profile
      }
      // You can add other properties from the token to the session here
      // if (token?.role) {
      //   session.user.role = token.role;
      // }
      return session;
    },
    // The JWT callback is called when a JWT is created (i.e., on sign in)
    // or updated (i.e., whenever a session is accessed in the client).
    // The returned value will be encrypted and stored in a cookie.
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      // The 'user' object is the one returned from the 'authorize' function (for credentials)
      // or the 'profile' function (for OAuth providers).
      if (user) {
        token.sub = user.id; // Persist the user ID from authorize/profile into the token
        // You can add other custom properties to the token here
        // For example, if your user object from authorize/profile has a 'role':
        // if (user.role) {
        //  token.role = user.role;
        // }
      }
      return token;
    },
  },
  session: {
    // Strategy: "jwt" means that NextAuth will use JSON Web Tokens for session management.
    // The session data will be stored in a JWT cookie, not in the database (unless using database sessions).
    strategy: "jwt",
  },
  pages: {
    // signIn: '/auth/signin', // Optionally, specify custom sign-in page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for email provider)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: config.colors.main, // Your brand color from config
    // Add your own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`, // Your logo from config
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
};
