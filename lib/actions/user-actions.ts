'use server'

import { Query, ID } from "node-appwrite"
import { cookies } from "next/headers"
import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { appwriteConfig } from "@/lib/appwrite/config"
import { parseStringify } from "@/lib/utils"
import { avatarPlaceholder } from "@/constants"

// user enters full name and email
// check if the user already exists using the email
// send OTP to users email
// send a secret key for creating a sesion
// create a new user document if the user is a new user
// return the users accountId that will be uses to complete the login
// verify OTP and auth to login

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient()

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  )

  return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(), email)

    return session.userId
  } catch (error) {
    handleError(error, "Failed to send email OTP")
  }
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string}) => {
  console.log('1')
  const existingUser = await getUserByEmail(email)

  const accountId = await sendEmailOTP({ email })

  if ( !accountId )  throw new Error("Failed to send an OTP")

  if ( !existingUser ) {
    const { databases } = await createAdminClient()
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholder,
        accountId
      }
    )
  }
  return parseStringify({ accountId })
}

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient()
  const result = await account.get()
  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('accountId', [result.$id])]
  )

  if ( user.total <= 0 ) return null
  return parseStringify(user.documents[0])
}
