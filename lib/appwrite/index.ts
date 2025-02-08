'use server';

import { cookies } from 'next/headers';
import { Account, Avatars, Client, Databases, Storage } from 'node-appwrite';
import { appwriteConfig } from './config';

//new client for each request
export const createSessionClient = async () => {
  //used to initialise instances, to create db, accounts
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get('appwrite-session');

  if (!session?.value) {
    throw new Error('No session found');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  //used to create users, roles, etc
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },

    get storage() {
      return new Storage(client);
    },

    get avatar() {
      return new Avatars(client);
    },
  };
};
