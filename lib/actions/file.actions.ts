'use server'

import { revalidatePath } from "next/cache"
import { Query, ID, Models } from "node-appwrite"
import { InputFile } from "node-appwrite/file"
import { createAdminClient } from "@/lib/appwrite"
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils"
import { appwriteConfig } from "@/lib/appwrite/config"
import { getCurrentUser } from "./user-actions"

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email])
    ])
  ]

  // TODO: search, sort, limits...
  return queries
}

export const uploadFIle = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
  const { storage, databases } = await createAdminClient()

  try {
    const inputFile = InputFile.fromBuffer(file, file.name)

    const bucketFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), inputFile)

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id
    }

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument,
    ).catch(async (error: unknown) => {
      await storage.deleteFile(appwriteConfig.storageId, bucketFile.$id)
      handleError(error, "Failed to create file document")
    })
    revalidatePath(path)
    return parseStringify(newFile)
  } catch (error) {
    handleError(error, "Failed to upload file")
  }
}

export const getFiles = async () => {
  const { databases } = await createAdminClient()

  try {
    const currentUser = await getCurrentUser()
    if ( !currentUser ) throw new Error("User not found")

    const queries = createQueries(currentUser)

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    )
    return parseStringify(files)
  } catch (error) {
    handleError(error, "Failed to get files")
  }
}
