import NextAuth from "next-auth";
import { authOptions } from "./authOption";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


/*

next-auth guide for future reference

1. create directory according to docs api/auth/[...nextauth]/(route.ts & authOptions.ts)
2. copy paste credentials provider or other providers code from docs
3. alter credentials inputs in credentialProvider as per your need

4. write authorize method with type Promise<any> & any logic, but last you have to return user(at last after all checks) or throw error
5.add secret in .env
6. provide route in pages section
7. provide strategy( jwt/database ) in session section
8. again copy paste callbacks section starter code from docs, removes uneccessary parameters, and alter token & session as per your need

9. while altering User & Session & JWT, you need to alter their type first in next-auth module via next-auth.d.ts file under types folder same level as app, can be found in docs search for defaultSession["user"]
10. after callbacks export and import in route.ts under same folder
11. again copy paste handler code from docs and provide authOptions directly without object - code : NextAuth(authOptions)

12. again copy paste middleware code from next-auth({default}) docs & from next docs then just write redirection logic for url paths

13. again copy paste useSession hook code from docs in (frontend) page.tsx under login under app folder 

14. again copy paste sessionProvider code from docs in AuthProvider.tsx under context folder same level as app folder alter it reduce parameters to childern and it's type : React.ReactNode, inside return {children} warp to useSession , export as AuthProvider or something else but first letter should be capital (maybe)

15. and import in layout.tsx under app folder and wrap the body part inside return part with AuthProvider

16. that's all , learned till yet

*/