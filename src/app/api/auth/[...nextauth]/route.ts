import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if Supabase is configured
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
          return true;
        }

        try {
          // Save user to Supabase
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single();

          if (!existingUser) {
            const { error } = await supabase.from("users").insert({
              email: user.email,
              name: user.name,
            });

            if (error) {
              return true;
            }
          } else {
            // Update existing user info
            const { error } = await supabase
              .from("users")
              .update({
                name: user.name,
              })
              .eq("email", user.email);
          }
        } catch (error) {
          return true;
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
