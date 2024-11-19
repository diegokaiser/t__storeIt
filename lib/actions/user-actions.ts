'use server'

import { Query, ID } from "node-appwrite"
import { createAdminClient } from "@/lib/appwrite"
import { appwriteConfig } from "@/lib/appwrite/config"
import { parseStringify } from "@/lib/utils"

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

const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(), email)

    return session.userId
  } catch (error) {
    handleError(error, "Failed to send email OTP")
  }
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string}) => {
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
        avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
        accountId
      }
    )
  }
  return parseStringify({ accountId })
}